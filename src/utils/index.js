import md5 from 'js-md5';
import axios from '@/api';
import { asyncRouterMap } from '@/router';

const roleName = ['student', 'teacher', 'admin'];

export const requestLogin = params => axios.post('/interface/login', {
  UID: params.username,
  password: md5(`${params.password}helloworld`),
}).then(data => ({
  token: data.info.SID,
  userinfo: {
    uid: Number(data.info.UID),
    nickname: data.info.Nickname,
    role: roleName[Number(data.info.Authority)],
  },
}));

export const getBuildingList = params => axios.get('/interface/building', { params }).then((data) => {
  const buildingList = [];
  data.vals.forEach((building) => {
    buildingList.push({
      buildingID: Number(building.BID),
      buildingName: building.buildingName,
    });
  });
  return buildingList;
});

export const getRoomList = params => axios.get('/interface/room', { params }).then((data) => {
  const roomList = [];
  data.vals.forEach((room) => {
    roomList.push({ roomID: Number(room.RID) });
  });
  return roomList;
});

export const removeRoom = (params) => {

  // return axios
};

export const generateRoutes = (role) => {
  const accessedRoutes = asyncRouterMap.filter((route) => {
    if (route.meta && route.meta.role) {
      return route.meta.role.indexOf(role) >= 0;
    }
    return true;
  });
  return accessedRoutes;
};
