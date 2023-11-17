import { IStudent, ModelType } from "@/common/types";
import { fetchMemberList } from "@/services/course";


export type StudentsState = {
  students: IStudent[]
}

const coursesModel: ModelType<StudentsState> = {
  namespace: 'students',
  state: {
    students: [],
  },

  effects: {
    *getAll({ }, { call, put }): any {
      let { data = [] } = yield call(async () => fetchMemberList({ size: 10000 }))
      let _students: IStudent[] = []
      data.forEach(async (item: IStudent) => {
        const { id, name, gender, phone, courseId, createdAt, status } = item
        let _index = _students.findIndex((item) => item.phone === phone)
        if (_index < 0) {
          _students.push({ id, name, gender, phone, courseId, createdAt, status, index: _students.length + 1, registers: [item] });
        } else {
          _students[_index].registers!.push(item)
        }
      });
      yield put({ type: 'save', payload: _students });
    },
  },

  reducers: {
    save: (state, { payload }) => {
      return {
        ...state,
        students: payload,
      };
    },
  }
};


export default coursesModel
