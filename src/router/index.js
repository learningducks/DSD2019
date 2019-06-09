import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import NotFound from '@/views/404';
import Home from '@/views/Home';
import Dashboard from '@/views/Dashboard';
import User from '@/views/User';
import Raspi from '@/views/Raspi';

Vue.use(Router);

export const defaultRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true,
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    hidden: true,
  },
  {
    path: '/',
    redirect: '/login',
    hidden: true,
  },
];

export const asyncRouterMap = [
  {
    path: '/',
    component: Home,
    meta: { role: ['Administrator', 'Teacher', 'Student'] },
    hidden: true,
    children: [
      {
        path: '/dashboard',
        name: 'DASHBOARD',
        icon: 'fa fa-tachometer',
        component: Dashboard,
      },
    ],
  },
  {
    path: '/',
    component: Home,
    meta: { role: ['Administrator', 'Teacher'] },
    hidden: true,
    children: [
      {
        path: '/rapsi',
        name: 'RASPI',
        icon: 'fa fa-microchip',
        component: Raspi,
      },
    ],
  },
  {
    path: '/',
    component: Home,
    meta: { role: ['Administrator'] },
    hidden: true,
    children: [
      {
        path: '/user',
        name: 'USER',
        icon: 'fa fa-users',
        component: User,
      },
    ],
  },
  {
    path: '/home',
    redirect: '/dashboard',
    hidden: true,
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

export default new Router({
  routes: defaultRouterMap,
});
