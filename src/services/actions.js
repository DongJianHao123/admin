import { Action_type } from '@/common/constants';
import { addListIndex } from '@/utils';
import { request } from '@umijs/max';
import moment from 'moment';

export async function actions(params) {
  return request('/analysis/api/room-actions/getRoomActionsWithTotalNumByConditionsTime', {
    params: {
      clientId: 385,
      ...params,
      sort: "id,desc",
    }
  }).then((res) => {
    return {
      data: addListIndex(res.roomActionList, params),
      total: res.totalNum,
      success: true,
    }
  }
  );
}

export async function playbackActions(params) {
  const totalNum = (await request('/analysis/api/room-actions/getRoomActionsWithTotalNumByConditionsTime', {
    params: {
      clientId: 385,
      ...params,
      sort: "id,desc",
      actionType: Action_type.PLAYBACK.value
    }
  })).totalNum
  const allData = await request('/analysis/api/room-actions/getRoomActionsWithTotalNumByConditionsTime', {
    params: {
      clientId: 385,
      ...params,
      sort: "id,desc",
      actionType: Action_type.PLAYBACK.value,
      page: 0,
      size: totalNum
    }
  })
  const _alldata = filterActionPlayBack(allData.roomActionList)
  return {
    data: addListIndex(_alldata, params),
    total: _alldata.length,
    success: true,
  }
}

const filterActionPlayBack = (data = []) => {
  let _data = [];
  data.forEach((item) => {
    const { courseId, courseClassId, userId, description } = item
    const index = _data.findIndex((value) => value.courseId === courseId && value.courseClassId === courseClassId && value.userId === userId)

    const dateLong = parseInt(description);
    if (index < 0) {
      _data.push({ ...item, viewNum: 1, description: dateLong ? dateLong : 0 })
    } else {
      _data[index].viewNum++;
      _data[index].description += dateLong ? dateLong : 0
    }
  })
  return _data
}
