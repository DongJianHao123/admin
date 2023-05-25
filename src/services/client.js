import { addListIndex } from '@/utils';
import { request } from '@umijs/max';
import axios from 'axios';

export async function fetchClient(clientId) {
  let res = await axios(
    `https://admin.maodouketang.com:8443/seller/api/clients?current=1&pageSize=10&clientId.equals=${clientId}&size=10`,
  );
  console.log("请求结果", res);
  return res.data;
}
export async function getAllActions(params) {
  let res = await request(
    `/analysis/api/room-actionsget/getAllRoomActionsByConditions?clientId=381&current=1&sort=id%2Cdesc`,
    { params: { ...params } },
  );
  return res;
}

export async function login(params) {
  let res = await request('/boss/loginSimple?logintype=client', {
    params: { ...params },
  });
  return res;
}
