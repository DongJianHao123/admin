import { addListIndex } from '@/utils';
import { request } from '@umijs/max';
import moment from 'moment';
import { fetchCourseList } from './course';

export async function getCourseList() {
  return fetchCourseList().then(({ data }) => {
    console.log(data);
    return data
      .map((item) => ({
        label: item.title || " ",
        value: item.roomId || " ",
      }))
      .filter(
        (item, index, self) =>
          self.findIndex((i) => i.value === item.value) === index,
      )
  }

  );
}

export async function fetchCourseDateRec(params) {
  const tmp = {
    clientId: 385,
    ...params,
    startTime: +moment(params.startTime).startOf('day'),
    endTime: +moment(params.endTime).endOf('day'),
  };
  return request('/analysis/api/room-timesget/getClientTimeByClientId', {
    params: tmp,
  });
}

export async function fetchCourseStatisticData(params) {
  return request('/analysis/api/studentRoomTimeDetailStatistics', {
    params: {
      clientId: 385,
      ...params,
    },
  }).then((resp) => {
    const data = resp.dayDetail
      .map((item) => ({
        ...item,
        times: item.info.length,
        duration: item.info
          .map((item) => item.timeLong)
          .reduce((pre, curr) => pre + curr, 0),
        ...Object.fromEntries(item.info.map((i) => [i.sumDay, i.timeLong])),
      }))
      .filter((item) => item.duration);
    return {
      ...resp,
      // data: [
      //   ...addListIndex(data),
      //   ...(data.length > 0
      //     ? [
      //       {
      //         index: data.length + 1,
      //         name: '时长统计',
      //         ...resp.daySum,
      //       },
      //     ]
      //     : []),
      // ].map((item, _i, self) => ({
      //   ...item,
      //   dataLength: self.length,
      // })),
      data: data,
      success: true,
    };
  });
}
