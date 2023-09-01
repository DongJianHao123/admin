import U from '@/common/U';
import { Action_type } from '@/common/constants';
import { data2Excel } from '@/common/data2Excel';
import { actions, playbackActions } from '@/services/actions';
import { getCourseList } from '@/services/classHourStatistics';
import { secondsParse } from '@/utils';
import { ExportOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popover } from 'antd';
import moment from 'moment';
import { useState } from 'react';

let isSortAction = false;
let dataSource = [];

const onCell = ({ dataLength }, index) => dataLength - 1 === index ? { colSpan: 0 } : {};

const columns = [

  {
    title: '课程',
    dataIndex: 'roomId',
    hideInTable: true,
    search: true,
    valueType: 'select',
    request: getCourseList,
  },
  {
    title: '时间',
    dataIndex: 'actionTime',
    width: 40,
    hideInTable: true,
    align: "center",
    valueType: 'dateRange',
    initialValue: [moment().add(-1, 'd'), moment().add(0, 'd',)],
    fieldProps: {
      allowClear: false,
    },
    search: {
      transform: ([start, end]) => {
        let _start = typeof start === "string" ? start : start.$d
        let _end = typeof end === "string" ? end : end.$d
        let startTime = new Date(_start);
        let endTime = new Date(_end);
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        return ({
          startTime,
          endTime
        })
      }
    },
  },
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    align: 'center',
    width: 10,
    onCell,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    search: true,
    align: 'center',
    width: 40,
    onCell: ({ dataLength }, index) => {
      if (dataLength - 1 === index) {
        return {
          colSpan: 4,
        };
      }
    },
  },
  {
    title: '手机号',
    search: true,
    dataIndex: 'userId',
    width: 55,
    align: 'center',
    render: (txt) => <span style={{ wordBreak: "break-all", wordWrap: "break-word" }}>{txt}</span>
  },

  {
    title: '课程',
    dataIndex: 'roomId',
    align: "center",
    search: false,
    width: 50,
    render: (txt) => <span style={{ wordBreak: "break-all", wordWrap: "break-word" }}>{txt}</span>
  },
  {
    title: '最近观看时间',
    dataIndex: 'actionTime',
    width: 40,
    align: "center",
    search: false,
    render: (time, item, index) => {
      return U.date.format(new Date(time), 'yyyy-MM-dd HH:mm:ss')
    }
  },
  {
    title: '行为',
    dataIndex: 'actionType',
    width: 40,
    align: "center",
    search: false,
    valueType: 'select',
    fieldProps: {
      options: Object.values(Action_type)
    }
  },
  {
    title: '观看时长',
    search: false,
    dataIndex: 'description',
    align: 'center',
    width: 60,
    onCell,
    render: (val) => U.date.remainingTime(val * 1000),
    sorter: {
      compare: (a, b) => b.description - a.description,
    },
  },
  {
    title: '观看次数',
    search: false,
    dataIndex: 'viewNum',
    align: 'center',
    width: 60
  },
  {
    title: '课程名',
    search: false,
    dataIndex: 'courseName',
    align: 'center',
    width: 120,
    render: (txt) => <span className="table-txt">{txt}</span>,
    onCell,
  },
  {
    title: '课堂',
    dataIndex: 'courseClassName',
    search: false,
    align: 'center',
    width: 120,
    render: (txt) => <span className="table-txt">{txt}</span>,
    onCell,
  },

]


const     PlayBackTable = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([])

  const dataExport = () => {
    setLoading(true)
    data2Excel(`回放统计表-${U.date.format(new Date(), "yyyy-MM-dd")}`, [
      {
        sheetData: list,  //excel文件中的数据源
        sheetName: "表1",  //excel文件中sheet页名称
        sheetFilter: ["index", "userName", "userId", "roomId", "actionTime", "actionType", "description", "viewNum", "courseName", "courseClassName"],  //excel文件中需显示的列数据
        sheetHeader: ["序号", "姓名", "手机号", "课程", "最近观看时间", "行为", "观看时长", "观看次数", "课程名", "课堂名"], //excel文件中每列的表头名称
        columnWidths: [4, 5, 5, 5, 10, 5, 10, 5, 15, 30]
      }
    ])
    setLoading(false)
  }

  return <ProTable
    columns={columns}
    search={{ labelWidth: 100, defaultCollapsed: false }}
    postData={(data) => {
      setList(data)
      return data;
    }}
    request={async (params) => {
      if (isSortAction) {
        isSortAction = false;
        return dataSource;
      }
      let _params = U.obj.RemoveNulls(params)
      _params['actionType'] = Action_type.PLAYBACK.value
      dataSource = await playbackActions(_params);
      return dataSource
    }}
    pagination={false}
    toolBarRender={() => <Button type="primary" loading={loading} icon={<ExportOutlined />} onClick={() => { dataExport() }} >导出学生信息</Button>}
  />
}

export default PlayBackTable
