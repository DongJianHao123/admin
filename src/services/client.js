import { addListIndex } from '@/utils';
import { request } from '@umijs/max';

export async function fetchClient() {
  return request(
    'seller/api/clients?current=1&pageSize=10&clientId.equals=421&size=10',
  ).then((res) => ({
    data: res,
  }));
}
export async function getAllActions(params) {
  let res = await request(
    `/analysis/api/room-actionsget/getAllRoomActionsByConditions?clientId=381&current=1&sort=id%2Cdesc`,
    { params: { ...params } },
  );
  return res;
}
