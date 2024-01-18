import { request } from '@umijs/max';

export async function fetchConsumptionDuration() {
  return request(
    '/analysis/api/room-timesget/getTotalSummaryDetailsByClientId?clientId=385',
  );
}

export async function fetchOrderAgenciesByConditions() {
  return request(
    '/order/api/order-agencies/getOrderAgenciesByConditions?clientId=385&size=200&sort=id,desc',
  );
}

export async function fetchTotalSummaryCount() {
  return request(
    '/analysis/api/day-summaries/getTotalSummaryCount?clientId=483',
  );
}
export const getTotalSummaryMultiflowCount = () => request(`/analysis/api/day-summaries/getTotalSummaryMultiflowCount?clientId=483`);

export const getAdditionFixesWithTotalNumByConditions = () => request(`/analysis/api/addition-fixes/getAdditionFixesWithTotalNumByConditions?clientId=483`,);

