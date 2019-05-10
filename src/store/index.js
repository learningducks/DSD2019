import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userinfo: {},
    token: '',
    generated: false,
  },
  modules: {

  },
  getters: {
    userinfo(state) {
      if (!state.userinfo.role) {
        const userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        if (userinfo && userinfo.role) state.userinfo = userinfo;
      }
      sessionStorage.setItem('userinfo', JSON.stringify(state.userinfo));
      return state.userinfo;
    },
    token(state) {
      if (state.token === '') {
        const token = sessionStorage.getItem('token');
        if (token && token !== '') state.token = token;
      }
      sessionStorage.setItem('token', state.token);
      return state.token;
    },
    generated(state) {
      return state.generated;
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
    setGenerated(state, generated) {
      state.generated = generated;
    },
    clear(state) {
      sessionStorage.clear();
      state.userinfo = {};
      state.token = '';
      state.generated = false;
    },
  },
});
