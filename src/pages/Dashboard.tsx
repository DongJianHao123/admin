import { useState, useEffect } from 'react'
import { fetchConsumptionDuration, fetchOrderAgenciesByConditions, fetchTotalSummaryCount } from '@/services/dashboard';
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';
import '../style/Dashboard/dashboard.less';
import U from '@/common/U';

const packChartData = (rawData: any) => {
  const list:Array<any> = (rawData?.daySummaryList || []).toReversed();
  return {
    title: {
      text: `近15天消费时长: ${U.date.remainingHour(rawData?.totalTimeLong)}`,
    },
    tooltip: {
      formatter: ``,
      //  trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: list.map((item: any) => item.sumDay),
    },
    yAxis: {
      type: 'value',
      interval: rawData?.totalTimeLong / 20,
      axisLabel: {
        formatter: (seconds: any) => Math.floor(seconds / 3600) + "时",
      },
    },
    series: [
      {
        data: list.map((item: any) => item.timeLong),
        type: 'bar',
        smooth: true,
        label: {
          show: true,
          position: 'top',
          formatter: (e: any) => (Math.floor(e.data / 3600) > 0 ? Math.floor(e.data / 3600) : (e.data / 3600).toFixed(1)) + "时"
        },
        tooltip: {
          valueFormatter: (seconds: any) => Math.floor(seconds / 3600) + "小时",
        },
      },
    ],
  };
};

const Dashboard: React.FC = () => {

  const [durationData, setDurationData] = useState<Array<{ title: string, value: string, desc: string }>>([])
  const { data, loading } = useRequest(fetchConsumptionDuration);

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
        durationData[1] = {
          title: '消费总时长', value: U.date.remainingHour(res2.totalTimeLong), desc: `日平均量:${U.date.remainingHour(res2.totalTimeLong / res2.days)}`
        }
        durationData[2] = {
          title: '剩余时长', value: U.date.remainingHour(allDuration - res2.totalTimeLong), desc: `预计可用:${allDuration - res2.totalTimeLong > 0 ? parseInt(((allDuration - res2.totalTimeLong) / (res2.totalTimeLong / res2.days)).toString()) : 0}天`
        }
        setDurationData([...durationData])
      })
    })

  }, [])

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
        <ProCard direction="row" ghost gutter={[8, 8]}>
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
      </PageContainer>
      <PageContainer loading={loading}>
        <ProCard direction="row" ghost gutter={[8, 8]}>
          <ProCard colSpan={14}>
            <ReactECharts
              option={packChartData(data)}
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