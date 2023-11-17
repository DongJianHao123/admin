import { ICourse, LableValue, ModelType } from "@/common/types";
import { getAllCourseList } from "@/services/classHourStatistics";

export type CoursesState = {
  courses: ICourse[]
  coursesKV: LableValue[]
}

const coursesModel: ModelType<CoursesState> = {
  namespace: 'courses',
  state: {
    courses: [],
    coursesKV: []
  },

  effects: {
    *getAll({ }, { call, put }): any {
      const courses: ICourse[] = yield call(getAllCourseList);
      const coursesKV = courses.map((item) => ({
        label: item.title || " ",
        value: item.roomId || " ",
      })).filter(
        (item, index, self) =>
          self.findIndex((i) => i.value === item.value) === index,
      )
      yield put({ type: 'save', payload: { courses, coursesKV } });
    },
  },

  reducers: {
    save: (state, { payload }) => {
      console.log(payload);

      return {
        ...state,
        ...payload
      };
    },
  },
  // subscriptions: {
  //   // 进入/users页面,触发action`users/fetch`
  //   setup({ dispatch, history }) {
  //     return history.listen(({ action, location }) => {
  //       if (location.pathname === '/dashboard') {
  //         console.log('进入首页');
  //         dispatch({ type: 'queryCourses' })
  //       }
  //     });
  //   },
  // },
};

export default coursesModel
