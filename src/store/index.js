import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userinfo: {},
    token: '',
  },
  modules: {

  },
  getters: {
    userinfo(state) {
      if (!state.userinfo.role) {
        const userinfo = JSON.parse(localStorage.getItem('userinfo'));
        if (userinfo.role) state.userinfo = userinfo;
      }
      sessionStorage.setItem('userinfo', JSON.stringify(state.userinfo));
      return state.userinfo;
    },
    token(state) {
      return state.token;
    },
  },
  mutations: {
    setUserinfo(state, userinfo) {
      sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
      state.userinfo = userinfo;
    },
    setToken(state, token) {
      sessionStorage.setItem('token', token);
      state.token = token;
    },
    clear(state) {
      sessionStorage.clear();
      state.userinfo = {};
      state.token = '';
    },
  },
});
