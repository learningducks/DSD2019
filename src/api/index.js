import axios from 'axios';
import vue from '@/main';
import { Message } from 'element-ui';

// axios.defaults.baseURL
axios.defaults.timeout = 5000;

axios.interceptors.request.use((config) => {
  if (config.url === '/interface/login') return config;
  const cfg = config;
  if (cfg.method === 'get') {
    cfg.params.SID = vue.$store.getters.token;
    cfg.params.UID = vue.$store.getters.userinfo.uid;
  } else if (cfg.method === 'post') {
    cfg.data.SID = vue.$store.getters.token;
    cfg.data.UID = vue.$store.getters.userinfo.uid;
  }
  return cfg;
}, error => Promise.reject(error));

// eslint-disable-next-line consistent-return
axios.interceptors.response.use((response) => {
  const status = Number(response.data.status);
  if (status === 0) {
    return response.data;
  } else if (status === -3) {
    vue.$store.commit('clear');
    vue.$router.push({ path: '/404' });
    Message.error('登录超时，请重新登录！');
  } else {
    return Promise.reject(response.data.msg);
  }
}, error => Promise.reject(error));

export default axios;
