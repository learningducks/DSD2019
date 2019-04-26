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
        const info = JSON.parse(localStorage.getItem('userinfo'));
        if (info.role) state.userinfo = info;
      }
      sessionStorage.setItem('userinfo', JSON.stringify(state.info));
      return state.userinfo;
    },
    token(state) {
      return state.token;
    },
  },
  mutations: {
    setUserinfo(state, info) {
      sessionStorage.setItem('userinfo', JSON.stringify(info));
      state.userinfo = info;
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
