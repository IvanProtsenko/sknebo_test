<template>
  <div id="app">
      <v-app>
        <v-main>
          <transition name="slide">
            <router-view></router-view>
          </transition>
        </v-main>
      </v-app>
  </div>
</template>
<script>

export default {
  name: "App",
  components: {
    
  }
};
</script>