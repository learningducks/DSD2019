// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import { generateRoutes } from '@/utils';

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ path: '/login' });
  } else if (store.getters.token) {
    if (to.path === '/login') {
      next({ path: '/home' });
    } else if (store.getters.generated) {
      next();
    } else {
      const accessedRoutes = generateRoutes(store.getters.userinfo.role);
      router.options.routes = accessedRoutes;
      router.addRoutes(accessedRoutes);
      store.commit('setGenerated', true);
      next({ ...to, replace: true });
    }
  } else if (to.path === '/login') {
    next();
  } else {
    next({ path: '/login' });
  }
});

export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App />',
});
