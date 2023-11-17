import { CoursesState } from "@/models/courses"
import { Effect, Reducer, Subscription } from "@umijs/max"

type IDType = number | string

export enum EUserType {
  STUDENT = '1',
  TEACHER = '2',
  VISITOR = '3',
  TUTOR = '4',
  ADMIN = '5',
  PARENT = '6'
}

export type LableValue = {
  label: string,
  value: any
}


export interface IChatgptHistory {
  id?: IDType
  index: number
  answer?: string
  createdAt: string
  parentMessageId?: string
  question?: string
  user: string
  isEnd: boolean
}

export interface IRoomAction {
  userId: string;
  userName: string;
  courseClassId?: number;
  role: string;
  clientId: string;
  clientName: string;
  actionType: string;
  description: string | number;
  actionTime: Date;
  courseId: IDType;
  courseName: string;
  courseClassName?: string;
  roomId: string;
}

export interface ICourse {
  applyCount?: number
  buyersCount?: number
  clientId: string
  clientName: string
  courseClasss?: any[]
  courseId: string
  courseIndex: 1
  coverUrl: string
  createdAt?: string
  domain?: string
  gradeLevel?: number | null
  id: IDType
  info?: string
  introduction?: string
  isDelete?: number
  isSpecail?: number
  ishd?: number
  linkUrl?: string
  location?: string
  oldPrice?: number
  price?: string
  roomId: string
  showqr?: number | string | null
  startAt?: string
  status?: number
  summary?: string
  tag?: string
  teacher?: string
  title: string
  totalNum?: number
  type?: number
  typeId?: string
  updatedAt?: string,
  replayList?: any[],
  students?: any[]
}

export interface IStudent {
  id: IDType
  clientId?: IDType
  courseId: IDType
  classId?: IDType
  userId?: IDType
  type?: string
  name: string
  avatalUrl?: null
  phone: string
  email?: string
  gender?: string
  age?: string
  location?: string
  company?: string
  tag?: string
  status: EUserType
  createdAt?: string
  updatedAt?: string
  verify?: string
  uniCourseId?: IDType
  tencentUserId?: IDType
  index?: number,
  registers?: IStudent[]
}


export interface ModelType<T> {
  namespace: string;
  state: T;
  effects?: {
    [key in string]: Effect;
  };
  reducers: {
    [key in string]: Reducer<T>;
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions?: { setup: Subscription };
}

export interface DvaState {
  courses: CoursesState
  students: {
    students: IStudent[]
  }
}


export interface IRoomTime {
  chatNum: number;
  clientId: string;
  description: string | null;
  endTime: string;
  handupNum: number;
  id: number;
  onscreenNum: number;
  onscreenTimelong: number;
  refreshNum: number;
  rewardNum: number;
  roomId: string;
  roomName: string | null;
  startTime: string;
  studentNum: number;
  sumDay: string;
  teacherNum: number;
  timeLong: number;
  timeLongMultiflow: number;
  updateTime: string;
}

export interface IRoomInfo {
  roomNum: number;
  roomTimeList: IRoomTime[];
  studentNum: number;
  teacherNum: number;
  totalNum: number;
  totalTimeLong: number;
  totalTimeLongMultiflow: number;
}
