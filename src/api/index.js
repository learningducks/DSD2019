import axios from 'axios';
import vue from '@/main';
import { Message } from 'element-ui';

axios.defaults.baseURL = 'http://39.106.7.29:8088';
axios.defaults.timeout = 5000;

axios.interceptors.request.use((config) => {
  if (config.url === '/interface/login') return config;
  const cfg = config;
  if (cfg.method === 'get') {
    cfg.params.token = vue.$store.getters.token;
    cfg.params.uid = vue.$store.getters.userinfo.uid;
  } else if (cfg.method === 'post') {
    cfg.data.token = vue.$store.getters.token;
    cfg.data.uid = vue.$store.getters.userinfo.uid;
  }
  return cfg;
}, error => Promise.reject(error));

// eslint-disable-next-line consistent-return
axios.interceptors.response.use((response) => {
  console.log(response);
  const status = Number(response.data.status);
  if (status === 0) {
    return response.data.info;
  } else if (status === -3) {
    vue.$store.commit('clear');
    vue.$router.push({ path: '/404' });
    Message.error('登录超时，请重新登录！');
  } else {
    return Promise.reject(response.data.message);
  }
}, (error) => {
  console.log(`in response interceptors:${error}`);
  console.log(error.status);
  console.log(error.message);
  console.log(error.config);
  return Promise.reject(error);
});

export default axios;
