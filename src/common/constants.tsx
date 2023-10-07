export const Action_type = {
  REGISTER: { label: "报名", value: "REGISTER" },
  PLAYBACK: { label: "观看回放", value: "PLAYBACK" },
  ENTER: { label: "进入课堂", value: "ENTER" },
  EXIT: { label: "退出课堂", value: "EXIT" },
  CHATGPT: { label: "CHATGPT", value: "CHATGPT" },
  RECEIVED_STREAMS: { label: "接收流", value: "RECEIVED_STREAMS" },
  JOIN: { label: "签到", value: "JOIN" },
  CHAT: { label: "聊天", value: "CHAT" },
  ON_SCREEN: { label: "上屏", value: "ON_SCREEN" },
  OFF_SCREEN: { label: "下屏", value: "OFF_SCREEN" },
  ALIVE: { label: "在线", value: "ALIVE" },
  ERROR: { label: "报错", value: "ERROR" },
  TIMEOUT: { label: "超时", value: "TIMEOUT" },
  // HAND_UP: { label: "举手", value: "HAND_UP" },
  // HAND_DOWN: { label: "取消举手", value: "HAND_DOWN" },
  // REFRESH: { label: "刷新", value: "REFRESH" },
  // STAND_UP: { label: "主动上屏", value: "STAND_UP" },
  // GET_REWARD_TROPHY: { label: "获得奖杯", value: "GET_REWARD_TROPHY" },
  // PUT_ON_SCREEN: { label: "允许学生上屏", value: "PUT_ON_SCREEN" },
  // PUT_OFF_SCREEN: { label: "点击学生下屏", value: "PUT_OFF_SCREEN" },
  // REWARD_STUDENT_TROPHY: { label: "奖励学生奖杯", value: "REWARD_STUDENT_TROPHY" },
  // SELECT: { label: "选择", value: "SELECT" },
}

export interface labelValue {
  label: string,
  value: string,
}

export const SMS_PARAMS = {
  NAME: "call",
  TITLE: "title",
  DATE: "date",
  ROLE: "role",
  NOTE: "note"
}

const default_sms_params = [SMS_PARAMS.NAME, SMS_PARAMS.TITLE, SMS_PARAMS.DATE, SMS_PARAMS.NOTE]

export const SMS_template = [
  {
    value: 1641392,
    label: "上课通知1",
    params: default_sms_params,
    getContent: ([signature = "", call = "", title = "", date = "", note = ""]) => `【${signature}】${call}，您报名的课程 ${title} 即将开始，上课时间是${date} ，请准时参加。备注：${note} 。 回T退订`,
  }, {
    value: 1646915,
    label: "上课通知2",
    params: default_sms_params,
    getContent: ([signature = "", call = "", title = "", date = "", note = ""]) => `【${signature}】${call}您好,${title}即将开讲, 上课时间${date},备注：${note} 。 回T退订`,
  }, {
    value: 1644970,
    label: "活动通知",
    params: [SMS_PARAMS.NAME, SMS_PARAMS.TITLE, SMS_PARAMS.ROLE, SMS_PARAMS.DATE, SMS_PARAMS.NOTE],
    getContent: ([signature = "", call = "", title = "", role = "", date = "", note = ""]) => `【${signature}】温馨提醒：${call}即将举办${title}，本次活动面向${role}，报名时间截止到${date}，欢迎参加。备注：${note} 。 回T退订`,
  }, {
    value: 1641362,
    label: "课程报名",
    params: [SMS_PARAMS.TITLE, SMS_PARAMS.NAME, SMS_PARAMS.DATE, SMS_PARAMS.NOTE],
    getContent: ([signature = "", title = "", call = "", date = "", note = ""]) => `【${signature}】您好，《${title}》即将开讲，由 ${call} 亲临授课，报名时间截止到${date}， 不要错过哦! 备注： ${note} 。 回T退订`,
  },
]

export const roles = [
  {
    value: '1',
    label: '学生',
  },
  {
    value: '2',
    label: '教师',
  },
  {
    value: '4',
    label: '助教',
  },
  {
    value: '5',
    label: '管理员',
  },
];

//根据verify的值表示进入教室和观看回放的权限是否打开，使用二进制表示，
// 00为“0”,表示都未开启，01 为“1”，开启教室，10为“2” 表示观看回放，11为“3”,表示全部开启
export const verify_rules = {
  NONE: "0",
  ONLY_ROOM: "1",
  ONLY_PLAYBACK: "2",
  ALL_RIGNHT: "3"
}
export const verify_promissions = {
  ROOM: { name: "ROOM", label: "verify_room", value: 1 },
  PLAYBACK: { name: "PLAYBACK", label: "verify_playback", value: 2 },
}

export const getVerify = (currentVerify: string, value: number, allow: boolean) => {
  let _value = allow ? value : value * (-1)
  return (parseInt(currentVerify) + _value).toString();
}

export const grade = [
  "大一",
  "大二",
  "大三",
  "大四",
  "硕士研究生",
  "博士研究生",
  "大学老师",
  "公司技术工程师",
  "其他",
];

export const tags = [
  {
    value: '未订阅通知',
    label: '不订阅通知',
  },
  {
    value: '已订阅短信通知',
    label: '订阅短信通知',
  },
  {
    value: '已订阅电话通知',
    label: '订阅电话通知',
  },
  {
    value: '已订阅全部通知',
    label: '订阅全部通知',
  },
];

export const PhoneRegex=/^(\+86|86)?1[3-9]\d{9}$|^(\+886|0)9\d{8}$/;

export const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
