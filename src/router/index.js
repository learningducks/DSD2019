import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import NotFound from '@/views/404';
import Home from '@/views/Home';
import AddAccount from '@/views/NavAccountManagement/AddAccount';
import DeleteAccount from '@/views/NavAccountManagement/DeleteAccount';
import AddBuilding from '@/views/NavBasicManagement/AddBuilding';
import DeleteBuilding from '@/views/NavBasicManagement/DeleteBuilding';
import AddHardware from '@/views/NavBasicManagement/AddHardware';
import DeleteHardware from '@/views/NavBasicManagement/DeleteHardware';

import RoomList from '@/views/NavOverview/RoomList';

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
    path: '/overview',
    component: Home,
    name: '概览',
    icon: 'fa fa-info-circle',
    meta: { role: ['admin', 'teacher', 'student'] },
    children: [
      {
        path: '',
        redirect: '/404',
        hidden: true,
      },
      {
        path: '/overview/roomlist',
        component: RoomList,
        name: '房间列表',
        meta: { role: ['admin', 'teacher', 'student'] },
      },
    ],
  },
  {
    path: '/basicmanagement',
    component: Home,
    name: '基本功能',
    icon: 'fa fa-cog',
    meta: { role: ['admin', 'teacher'] },
    children: [
      {
        path: '/basicmanagement/addbuilding',
        component: AddBuilding,
        name: '添加教学楼',
        meta: { role: ['admin', 'teacher'] },
      },
      {
        path: '/basicmanagement/deletebuilding',
        component: DeleteBuilding,
        name: '删除教学楼',
        meta: { role: ['admin', 'teacher'] },
      },
      {
        path: '/basicmanagement/addhardware',
        component: AddHardware,
        name: '添加硬件',
        meta: { role: ['admin', 'teacher'] },
      },
      {
        path: '/basicmanagement/deletehardware',
        name: '删除硬件',
        meta: { role: ['admin', 'teacher'] },
      },
      {
        path: '',
        redirect: '/basicmanagement/addbuilding',
        meta: { role: ['admin', 'teacher'] },
        hidden: true,
      },
    ],
  },
  {
    path: '/accountmanagement',
    component: Home,
    name: '账户管理',
    icon: 'fa fa-users',
    meta: { role: ['admin'] },
    children: [
      {
        path: '/accountmanagement/addaccount',
        component: AddAccount,
        name: '添加账户',
        meta: { role: ['admin'] },
      },
      {
        path: '/accountmanagement/deleteaccount',
        component: DeleteAccount,
        name: '删除账户',
        meta: { role: ['admin'] },
      },
      {
        path: '',
        redirect: '/accountmanagement/addaccount',
        meta: { role: ['admin'] },
        hidden: true,
      },
    ],
  },
  {
    path: '/home',
    redirect: '/overview/roomlist',
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
