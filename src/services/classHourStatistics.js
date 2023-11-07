import { addListIndex } from '@/utils';
import { request } from '@umijs/max';
import moment from 'moment';
import { fetchCourseList } from './course';
import U from '@/common/U';

export async function getCourseList() {
  return fetchCourseList({size:200}).then(({ data }) => {
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

export async function getAllCourseList() {
  return fetchCourseList({size:200}).then(({ data }) => {
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
  const _startTime = typeof params.startTime === "string" ? params.startTime : params.startTime.$d
  const _endTime = typeof params.endTime === "string" ? params.endTime : params.endTime.$d
  const tmp = {
    clientId: 385,
    ...params,
    startTime: new Date(_startTime).getTime(),
    endTime: new Date(_endTime).getTime()
  }
  return request('/analysis/api/room-timesget/getClientTimeByClientId', {
    params: tmp,
  });
}

export async function fetchStudentsLiveStatic(params) {
  const _startTime = typeof params.startTime === "string" ? params.startTime : params.startTime.$d
  const _endTime = typeof params.endTime === "string" ? params.endTime : params.endTime.$d

  return request('/analysis/api/room-timesget/getUserTimesWithTotalNumByConditions', {
    params: {
      clientId: 385,
      ...params,
      sort: "startTime,desc",
      role:"student",
      startTime: new Date(_startTime),
      endTime: new Date(_endTime)
    }
  }).then((res) => {
    return {
      success: true,
      total: res.totalNum,
      data: res.userTimeList
    }
  })
}

export async function fetchCourseStatisticData(params) {
  const _startTime = typeof params.startTime === "string" ? params.startTime : params.startTime.$d
  const _endTime = typeof params.endTime === "string" ? params.endTime : params.endTime.$d
  return request('/analysis/api/studentRoomTimeDetailStatistics', {
    params: {
      clientId: 385,
      ...params,
      startTime: U.date.format(new Date(_startTime), "yyyy-MM-dd"),
      endTime: U.date.format(new Date(_endTime), "yyyy-MM-dd")
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
