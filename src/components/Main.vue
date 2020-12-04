<template>
    <v-app id="main_back">
        <v-container fluid id="back" dark>
            <yandex-map
                zoom="12"
                style="width: 100%; max-width: 100%; height: 98vh;"
                :coords="coords"
                @click="onClick"
                @map-was-initialized="initMap"
            >
                <ymap-marker
                    :coords="coords"
                    marker-id="markerIcon"
                    :icon="markerIcon"
                />
                <ymap-marker
                    marker-id="mkad"
                    marker-type="polygon"
                    :coords="[polygon,[]]"
                    circle-radius="16000"
                    :marker-fill="{color: '#1890ff', opacity: opt}"
                    :marker-stroke="{color: '#1890ff', width: 1}"
                    :balloon="{header: 'header', body: 'body', footer: 'footer'}"
                ></ymap-marker>
            </yandex-map>
        </v-container>
    </v-app>
</template>

<script>
    import { yandexMap, ymapMarker } from 'vue-yandex-maps'
    import mkadArray from './mkad';
    import { sortBy, debounce } from 'lodash';
    export default {
        name: 'Main',
        components: {yandexMap, ymapMarker},
        data: () => ({
            coords: [
                55.76596654088406,
                37.599893822753904,
            ],
            opt: 0.4,
            polygon: mkadArray.map((i) => i.reverse()),
            globalMap: null,
            autoRouteModel: null,
            autoRoute: null,
            pedestrianRouteModel: null,
            pedestrianRoute: null,
            height: window.innerHeight,
            markerIcon: {
                content: '',
                contentOffset: [0, 15],
                contentLayout: '<v-card style="width: 50px; color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</v-card>'
            }
        }),
        watch: {
            windowHeight(newHeight) {
                this.height = newHeight;
            }
        },
        created() {},
        mounted() {},
        methods: {
            getStyle() {
                return `height: ${this.height}px`;
            },
            initMap(map) {
                this.globalMap = map;
            },
            async onClick(e) {
                this.coords = e.get('coords');
                this.$store.dispatch("ADD_COORDS", {
                    coords: this.coords
                });
                var names = [];
                await ymaps.geocode(this.coords).then(function (res) {
                    res.geoObjects.each(function (obj) {
                        names.push(obj.properties.get('name'));
                    });
                });
                names = [names[0], names[1], names[2]];

                const closestDistance = this.getClosestDistance(this.coords);
                await this.setRoute(e, closestDistance);

                this.globalMap.balloon.open(this.coords, names.join(', '), {
                    closeButton: false
                });
            },
            getClosestDistance(currentPoint) {
                const object = [];
                this.polygon.forEach((coords) => {
                    const r = 6371; // Радиус земли
                    const dLat = (currentPoint[0].toFixed(6) - coords[0]) * (Math.PI / 180);
                    const dLon = (currentPoint[1].toFixed(6) - coords[1]) * (Math.PI / 180);
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(coords[0] * (Math.PI / 180)) * Math.cos(currentPoint[0] * (Math.PI / 180))
                        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = r * c; // Дистанция в КМ
                    object.push({ distance, coords });
                });
                return object;
            },
            async setRoute(e, closestDistance) {
                const selectPoint = sortBy(closestDistance, 'distance')[0];
                if(this.autoRoute) this.globalMap.geoObjects.remove(this.autoRoute);
                if(this.pedestrianRoute) this.globalMap.geoObjects.remove(this.pedestrianRoute);
                this.pedestrianRoute = new ymaps.multiRouter.MultiRoute({
                    referencePoints: [e.get('coords'), selectPoint.coords],
                    params: { routingMode: 'pedestrian' },
                }, {
                    routeActiveStrokeColor: '32a852'
                });
                this.autoRoute = new ymaps.multiRouter.MultiRoute({
                    referencePoints: [e.get('coords'), selectPoint.coords],
                    params: { routingMode: 'auto' },
                }, {
                    routeActiveStrokeColor: '5542f5'
                });
                this.globalMap.geoObjects.add(this.autoRoute);
                this.globalMap.geoObjects.add(this.pedestrianRoute);

                this.outputProps(this.autoRoute, "на автомобиле");
                this.outputProps(this.pedestrianRoute, "пешком");
            },
            outputProps(route, how) {
                route.model.events.add('requestsuccess', function() {
                    var activeRoute = route.getActiveRoute();
                    console.log("Дистанция "+ how + ": " + activeRoute.properties.get("distance").text);
                    console.log("Время " + how + ": " + activeRoute.properties.get("duration").text);
                    if (activeRoute.properties.get("blocked")) {
                        console.log("The route has sections with closed roads.");    
                    }
                });
            }
        },
    };
</script>

<style scoped>
#mainCard {
    background: transparent;
    border: 0px;
}

.title {
    font-family: Roboto;
    font-style: normal;
    font-weight: bolder;
    font-size: 12px;
    color: black;
}

#title-description {
    font-family: Montserrat;
    font-style: normal;
    font-weight: bolder;
    text-align: center;
    font-size: 18px;
    margin-top: 5px;
    color: black;
}

#buy_btn {
    padding: 0px 0px 0px 0px;
    margin-left: -30px;
    background-color: #9E9E9E;
    border: 0px;
    border-radius: 50px;
    color: #000000;
    font-family: Roboto;
    font-weight: bolder;
    letter-spacing: 0.75px;
    font-size: 14px;
}
</style>
