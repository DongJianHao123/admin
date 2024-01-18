import { useState, useEffect } from 'react'
import {
  fetchConsumptionDuration, fetchOrderAgenciesByConditions, fetchTotalSummaryCount, getAdditionFixesWithTotalNumByConditions,
  // fetchOrderAgenciesByConditions,
  // fetchTotalSummaryCount
} from '@/services/dashboard';
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest, useSelector } from '@umijs/max';
import ReactECharts from 'echarts-for-react';
import React from 'react';
import U from '@/common/U';
import './index.less'
import { DvaState, EUserType, ICourse, IRoomAction, IRoomInfo, IStudent } from '@/common/types';
import { actions } from '@/services/actions';
import { Action_type, grade } from '@/common/constants';
import { getClassroomTimeInfo } from '@/services/classHourStatistics';
import { getAgeChartOption, getRegisterChartOption, getTimeChartData } from './components/options';
import { StudentsState } from '@/models/students';
import { CoursesState } from '@/models/courses';
import { Col, Empty, Row, Statistic } from 'antd';

interface LiveCourse {
  title: string,
  roomId: string,
  count: number
}
export interface ValueName {
  value: number,
  name: string
}

export interface TimeStatic {
  date: string,
  num: number
}
const static_day_num = 7;

const Dashboard: React.FC = () => {

  const [durationData, setDurationData] = useState<Array<{ title: string, value: string, desc: string }>>([])
  const { data } = useRequest(fetchConsumptionDuration);
  const [registers, setRegisters] = useState<{ roomActionList: IRoomAction[], totalNum: number }>({ roomActionList: [], totalNum: 0 })
  const [timeRegister, setTimeRegister] = useState<TimeStatic[]>([])
  const [roomInfo, setRoomInfo] = useState<IRoomInfo>()
  const [liveCourses, setLiveCourses] = useState<LiveCourse[]>([])
  const [educationList, setEducationList] = useState<ValueName[]>([])
  const { courses }: CoursesState = useSelector((state: DvaState) => state.courses)
  const { students }: StudentsState = useSelector((state: DvaState) => state.students)

  let teachers = students.filter((item: IStudent) => item.status === EUserType.TEACHER || (item.registers!.findIndex(item => item.status === EUserType.TEACHER) > -1))

  const formatRegisters = (registers: IRoomAction[]) => {
    const result: TimeStatic[] = registers.reduce((acc: any, register) => {
      const date = U.date.format(new Date(register.actionTime), 'yyyy-MM-dd')!.slice(5); // 截取日期部分（MM-DD）
      const existingItem = acc.find((item: { date: string, num: number }) => item.date === date);
      if (existingItem) {
        existingItem.num++;
      } else {
        acc.push({ date, num: 1 });
      }
      return acc;
    }, []);
    setTimeRegister(result.reverse())
  }

  const loadAction = (actionType: string) => {
    const now = new Date();
    let days = 60 * 60 * 24 * 1000 * static_day_num
    actions({ actionType, startTime: new Date(now.getTime() - days), endTime: now, size: 10000 }).then((res) => {
      if (actionType === Action_type.REGISTER.value) {
        setRegisters({ roomActionList: res.data, totalNum: res.total })
        formatRegisters(res.data)
      }
    })
    getClassroomTimeInfo({ startTime: new Date(now.getTime() - days), endTime: now, size: 2000 }).then((res) => {
      setRoomInfo(res)
    })
  }



  useEffect(() => {
    fetchOrderAgenciesByConditions().then((res1) => {
      let allDuration = 0;
      res1.forEach((item: any) => {
        allDuration += item.minutes * 60
      });
      durationData[0] = {
        title: '购买总时长', value: U.date.remainingHour(allDuration), desc: `已购套餐包：${res1.length}个`
      }
      fetchTotalSummaryCount().then((res2) => {
        console.log(res2);
        getAdditionFixesWithTotalNumByConditions().then((data) => {
          const timeSum = res2.totalTimeLong + data.totalTimeLong
          durationData[1] = {
            title: '消费总时长', value: U.date.remainingHour(timeSum), desc: `日平均量:${U.date.remainingHour(timeSum / res2.days)}`
          }
          durationData[2] = {
            title: '剩余时长', value: U.date.remainingHour(allDuration - timeSum), desc: `预计可用:${allDuration - timeSum > 0 ? parseInt(((allDuration - timeSum) / (timeSum / res2.days)).toString()) : 0}天`
          }
          setDurationData([...durationData])
        })
      })
    })
    loadAction(Action_type.REGISTER.value)
  }, [])

  useEffect(() => {
    if (roomInfo && courses.length > 0) {
      let _liveCourses: LiveCourse[] = []
      roomInfo.roomTimeList.forEach((roomTime) => {
        if (_liveCourses.findIndex((liveCourse) => liveCourse.roomId === roomTime.roomId) < 0) {
          const course = courses.find((_course: ICourse) => _course.roomId === roomTime.roomId)!
          _liveCourses.push({ title: course.title, roomId: course.roomId, count: course.applyCount || 0 })
        }
      })
      setLiveCourses([..._liveCourses])
    }
  }, [roomInfo, courses])

  useEffect(() => {
    if (students.length > 0) {
      let _ValueNameList: ValueName[] = []
      grade.forEach((item) => {
        let value = students.filter((student) => student.registers![student.registers!.length - 1].age === item).length
        _ValueNameList.push({ value, name: item })
      })
      setEducationList(_ValueNameList)
    }
  }, [students])


  const columns: ProColumns<any>[] = [
    {
      title: '日期',
      dataIndex: 'sumDay',
    },
    {
      title: '上课教室总数',
      dataIndex: 'roomNum',
    },
    {
      title: '学生总人数',
      dataIndex: 'studentNum',
    },
    {
      title: '教师总人数',
      dataIndex: 'teacherNum',
    },
    {
      title: '消耗总时长',
      dataIndex: 'timeLong',
    },
  ].map((item) => ({ ...item, align: 'center' }));
  return (
    <div className="dashboard">
      <PageContainer>
        <ProCard direction="row" ghost gutter={[8, 8]} style={{ margin: 0 }}>
          {durationData.map((item, index) => (
            <ProCard
              key={item.title}
              colSpan={6}
              title={<Statistic title={item.title} value={item.value} />}
            >
              <Row style={{ color: '#409eff' }} justify="space-between">
                <Col>{item.desc}</Col>
                <Col style={{ cursor: 'pointer' }}>{index === 2 ? "去充值" : "查看详情"}</Col>
              </Row>
            </ProCard>
          ))}
        </ProCard>
        <ul className='num-overview'>
          <li>课程总数 <span className='num'>{courses.length}</span></li>
          <li>老师总数 <span className='num'>{teachers.length}</span></li>
          <li>学生总数 <span className='num'>{students.length}</span></li>
          <li>近{static_day_num}天学生报名人数 <span className='num'>{registers.totalNum}</span></li>
        </ul>
        <ProCard direction="row" ghost gutter={[8, 8]}>
          <ProCard colSpan={8} title="近30天直播课程" >
            <ul className='live-course'>
              {liveCourses.length > 0 ?
                liveCourses.map((liveCourse, index) => <li key={index}>
                  <span className='title'>{`${index + 1}、${liveCourse.title}`}</span>
                  <span className='num'>{liveCourse.count} 人</span>
                </li>)
                :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </ul>
          </ProCard>
          <ProCard colSpan={8} title="学生学历占比" >
            <ReactECharts option={getAgeChartOption(educationList)} />
          </ProCard>
          <ProCard colSpan={8} title="近7天报名人数" >
            {/* <div id='register-chart' className='chart'></div> */}
            <ReactECharts option={getRegisterChartOption(timeRegister)} />
          </ProCard>
        </ProCard>
        <ProCard direction="row" ghost gutter={[8, 8]} style={{ marginTop: 30 }}>
          <ProCard colSpan={14}>
            <ReactECharts
              option={getTimeChartData(data)}
              style={{ height: '447px', width: '100%' }}
            />
          </ProCard>
          <ProCard colSpan={10}>
            <ProTable
              rowKey="id"
              style={{ height: '447px', width: '100%' }}
              pagination={false}
              toolBarRender={false}
              dataSource={data?.daySummaryList}
              search={false}
              columns={columns}
              scroll={{ y: 360 }}
            />
          </ProCard>
        </ProCard>
      </PageContainer>
    </div>
  );
};

export default Dashboard;
