import Vue from 'vue';
import YmapPlugin from 'vue-yandex-maps';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router1 from './routes';
import store from './store';

Vue.use(vuetify);

Vue.use(YmapPlugin, {
  version: '2.1',
  coordorder: 'latlong',
  apiKey: '2d6d0e6a-5358-45fc-a45c-c4dd25d6f054',
});

new Vue({
  vuetify,
  router: router1,
  store,
  render: (h) => h(App),
}).$mount('#app');
