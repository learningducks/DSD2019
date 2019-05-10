import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export default {
  init() {
    const mock = new MockAdapter(axios, 2000);
    mock.onPost('/interface/login').reply((config) => {
      let { UID } = JSON.parse(config.data);
      UID = Number(UID);
      return new Promise((resolve, reject) => {
        if (UID === 2016) {
          resolve([200, { status: 0, msg: 'Login', info: { UID: 2016, SID: 'sid2016', Authority: 2, Nickname: 'awei2016' } }]);
        } else if (UID === 2017) {
          resolve([200, { status: 0, msg: 'Login', info: { UID: 2017, SID: 'sid2016', Authority: 1, Nickname: 'alex2017' } }]);
        } else if (UID === 2018) {
          resolve([200, { status: 0, msg: 'Login', info: { UID: 2018, SID: 'sid2016', Authority: 0, Nickname: 'tom2018' } }]);
        }
        resolve([200, { status: -3, msg: 'Not a String' }]);
      });
    });
    mock.onGet('/interface/building').reply(config => new Promise((resolve, reject) => {
      resolve([200, {
        status: 0,
        buildingNum: 2,
        vals: [
          { BID: 2, buildingName: 'yifu' },
          { BID: 3, buildingName: 'cuiwen' },
        ],
      }]);
    }));
    mock.onGet('/interface/room').reply(config => new Promise((resolve, reject) => {
      resolve([200, {
        status: 0,
        vals: [
          { RID: 210 },
          { RID: 211 },
          { RID: 213 },
        ],
      }]);
    }));
  },
};
