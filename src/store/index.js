import Vue from 'vue';
import Vuex from 'vuex';
import Storage from './modules/clicks';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    storage: Storage,
  },
});
