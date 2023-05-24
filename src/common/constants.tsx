export const Action_type = {
    ENTER: { label: "进入课堂", value: "ENTER" },
    EXIT: { label: "退出课堂", value: "EXIT" },
    PLAYBACK: { label: "观看回放", value: "PLAYBACK" },
    RECEIVED_STREAMS: { label: "接收流", value: "RECEIVED_STREAMS" },
    JOIN: { label: "签到", value: "JOIN" },
    CHAT: { label: "聊天", value: "CHAT" },
    ON_SCREEN: { label: "上屏", value: "ON_SCREEN" },
    OFF_SCREEN: { label: "下屏", value: "OFF_SCREEN" },
    HAND_UP: { label: "举手", value: "HAND_UP" },
    HAND_DOWN: { label: "取消举手", value: "HAND_DOWN" },
    ALIVE: { label: "在线", value: "ALIVE" },
    REFRESH: { label: "刷新", value: "REFRESH" },
    STAND_UP: { label: "主动上屏", value: "STAND_UP" },
    GET_REWARD_TROPHY: { label: "获得奖杯", value: "GET_REWARD_TROPHY" },
    PUT_ON_SCREEN: { label: "允许学生上屏", value: "PUT_ON_SCREEN" },
    PUT_OFF_SCREEN: { label: "点击学生下屏", value: "PUT_OFF_SCREEN" },
    REWARD_STUDENT_TROPHY: { label: "奖励学生奖杯", value: "REWARD_STUDENT_TROPHY" },
    ERROR: { label: "报错", value: "ERROR" },
    TIMEOUT: { label: "超时", value: "TIMEOUT" },
    SELECT: { label: "选择", value: "SELECT" },
}

export interface labelValue {
    label: string,
    value: string,
}