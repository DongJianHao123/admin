import { ProTable } from '@ant-design/pro-components';
import {
  fetchStudentsLiveStatic,
  getAllCourseList,
  getCourseList,
} from '@/services/classHourStatistics';
import { secondsParse } from '@/utils';
import moment from 'moment';
import { useState } from 'react';
import U from '@/common/U';

const onCell = ({ dataLength }, index) =>
  dataLength - 1 === index ? { colSpan: 0 } : {};

const render = (val, row, index) => {
  return row.dataLength - 1 === index ? <strong>{val}</strong> : val;
};

const columns = [
  {
    title: '用户上课时长',
    dataIndex: 'timeLong',
    hideInTable: true,
    search: true,
    valueType: 'select',
    initialValue: 15 * 60,
    request: async () => [
      { label: '大于15分钟', value: 15 * 60 },
      { label: '大于30分钟', value: 30 * 60 },
      { label: '大于45分钟', value: 45 * 60 },
      { label: '大于60分钟', value: 60 * 60 },
    ],
  },
  {
    title: '时间',
    dataIndex: 'timeRange',
    hideInTable: true,
    search: true,
    valueType: 'dateRange',
    // colSize: 2,
    initialValue: [moment().add(-1, 'd'), moment().add(0, 'd')],
    fieldProps: {
      allowClear: false,
    },
    search: {
      transform: ([start, end]) => {
        console.log('transform', start, end);
        return {
          startTime: start,
          endTime: end,
        };
      },
    },
  },
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    width: 60,
    search: false,
    renderText: (_, row, index) => index + 1,
    onCell,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    align: 'center',
    width: 80,
    onCell: ({ dataLength }, index) => {
      if (dataLength - 1 === index) {
        return {
          colSpan: 4,
        };
      }
    },
  },

  {
    title: '联系方式',
    dataIndex: 'userId',
    valueType: 'text',
    align: 'center',
    search: true,
    width: 120,
    onCell,
  },

  {
    title: '教室',
    dataIndex: 'roomId',
    search: true,
    valueType: 'select',
    width: 180,
    align: 'center',
    request: getAllCourseList,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    align: 'center',
    search: false,
    width: 180,
    render: (val) => U.date.format(new Date(val), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    align: 'center',
    search: false,
    width: 180,
    render: (val) => U.date.format(new Date(val), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    title: '上课时长',
    dataIndex: 'timeLong',
    align: 'center',
    width: 150,
    search: false,
    sorter: {
      compare: (x, y) => x.timeLong - y.timeLong,
    },
    renderText: secondsParse,
    onCell,
  },
  {
    title: '上屏时间',
    dataIndex: 'onscreenTimelong',
    align: 'center',
    search: false,
    width: 100,
  },
  {
    title: '举手(次)',
    dataIndex: 'handupNum',
    align: 'center',
    search: false,
    width: 100,
  },
  {
    title: '上屏(次)',
    dataIndex: 'onscreenNum',
    align: 'center',
    search: false,
    width: 100,
  },
  {
    title: '聊天 (次)',
    dataIndex: 'chatNum',
    align: 'center',
    search: false,
    width: 100,
  },
];

const LiveTable = () => {
  return (
    <ProTable
      columns={columns}
      search={{ labelWidth: 100, defaultCollapsed: false }}
      request={async (params) => {
        const dataSource = await fetchStudentsLiveStatic(params);
        console.log(dataSource);
        return dataSource;
      }}
    />
  );
};

export default LiveTable;
