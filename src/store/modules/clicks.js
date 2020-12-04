export default {
  state: {
    lastCoords: '',
    addresses: [],
  },
  actions: {
    ADD_COORDS(ctx, history) {
      ctx.commit('updateCoords', history);
    },
  },
  mutations: {
    updateCoords(state, newCoords) {
      state.addresses.push(newCoords.coords);
      localStorage.setItem('lastCoords', newCoords.coords);
      state.lastCoords = newCoords.coords;
      console.log(state);
    },
  },
  getters: {
    allData(state) {
      return {
        lastCoords: state.lastCoords,
      };
    },
  },
};
