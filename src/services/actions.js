import { addListIndex } from '@/utils';
import { request } from '@umijs/max';
import moment from 'moment';

export async function actions(params) {
    return request('/analysis/api/room-actions/getRoomActionsWithTotalNumByConditionsTime', {
        params: {
            clientId: 385,
            ...params,
            sort:"id,desc",
        }
    }).then((res) => {
        return {
            data: addListIndex(res.roomActionList,params),
            total: res.totalNum,
            success: true,
        }
    }
    );
}
