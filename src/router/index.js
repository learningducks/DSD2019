import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/views/Login';
import NotFound from '@/views/404';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '*',
      name: '404',
      redirect: { path: '/404' },
    },
  ],
});
