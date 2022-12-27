import { addListIndex } from '@/utils';
import { request } from '@umijs/max';

export async function fetchClient() {
  let res = await request(
    '/seller/api/clients?current=1&pageSize=10&clientId.equals=381&size=10',
  );
  return res;
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
