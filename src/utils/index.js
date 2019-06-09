import axios from '@/api';
import { asyncRouterMap } from '@/router';

export const requestLogin = params => axios.get('/interface/login', { params }).then(data => ({
  token: data.token,
  userinfo: {
    uid: data.id,
    nickname: data.name,
    permission: data.permission_str,
    role: data.role,
  },
}));

export const requestBuildingList = params => axios.get('/interface/building', { params });

export const updateBuilding = params => axios.get('/interface/building', { params });

export const requestRoomList = params => axios.get('/interface/room', { params });

export const updateRoom = params => axios.get('/interface/room', { params });

export const requestHardwareList = params => axios.get('/interface/hardware', { params }).then((data) => {
  console.log(data);
  return data;
});

export const controlHardware = params => axios.get('/command/command', { params });

export const requestRaspiList = params => axios.get('/interface/raspi', { params });

export const updateRaspi = params => axios.get('/interface/raspi', { params });

export const requestUserList = params => axios.get('/interface/user', { params });

export const updateUser = params => axios.get('/interface/user', { params });

export const requestRoleList = params => axios.get('/interface/role', { params });

export const updateRole = params => axios.get('/interface/role', { params });

export const requestLogList = params => axios.get('/interface/log', { params });

export const generateRoutes = (role) => {
  const accessedRoutes = asyncRouterMap.filter((route) => {
    if (route.meta && route.meta.role) {
      return route.meta.role.indexOf(role) >= 0;
    }
    return true;
  });
  return accessedRoutes;
};
