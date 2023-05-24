import {
  fetchCourseDateRec,
  fetchCourseList,
  fetchCourseStatisticData,
} from '@/services/classHourStatistics';
import { fetchClassroomList } from '@/services/course';
import { secondsParse } from '@/utils';
import { ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, message } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useRef, useState } from 'react';
import * as XLSX from "xlsx"
import ExportJsonExcel from "js-export-excel"
import { ExportOutlined } from '@ant-design/icons';

let isSortAction = false;
let dataSource = [];

const onCell = ({ dataLength }, index) =>
  dataLength - 1 === index ? { colSpan: 0 } : {};

const render = (val, row, index) => {
  return row.dataLength - 1 === index ? <strong>{val}</strong> : val;
};

const packColumns = (dateRec) =>
  [
    {
      title: '角色',
      dataIndex: 'role',
      hideInTable: true,
      search: true,
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '老师', value: 'teacher' },
          { label: '学生', value: 'student' },
          { label: '助教', value: 'ta' },
        ],
      },
    },
    {
      title: '教室',
      dataIndex: 'roomId',
      hideInTable: true,
      search: true,
      valueType: 'select',
      request: fetchCourseList,
    },
    {
      title: '学生数',
      dataIndex: 'minStudent',
      hideInTable: true,
      search: true,
    },
    {
      title: '当日课程时长',
      dataIndex: 'minRoomTime',
      hideInTable: true,
      search: true,
      initialValue: 15 * 60,
      valueType: 'select',
      request: async () => [
        { label: '大于15分钟', value: 15 * 60 },
        { label: '大于30分钟', value: 30 * 60 },
        { label: '大于45分钟', value: 45 * 60 },
        { label: '大于60分钟', value: 60 * 60 },
      ],
    },
    {
      title: '用户上课时长',
      dataIndex: 'minUserTime',
      hideInTable: true,
      search: true,
      valueType: 'select',
      search: {
        transform: (val) => ({ minTeacherTime: val, minStudentTime: val }),
      },
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
      colSize: 2,
      initialValue: [moment().add(-1, 'd'), moment().add(-1, 'd')],
      fieldProps: {
        allowClear: false,
      },
      search: {
        transform: ([start, end]) => ({
          startTime: start,
          endTime: end,
        }),
      },
    },
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: '姓名',
      dataIndex: 'name',
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
      title: '出勤次数',
      dataIndex: 'times',
      align: 'center',
      width: 80,
      defaultSortOrder: 'descend',
      sorter: {
        compare: (x, y) => x.times - y.times,
      },
      onCell,
    },
    {
      title: '上课时长',
      dataIndex: 'duration',
      align: 'center',
      width: 80,
      renderText: secondsParse,
      onCell,
    },
    ...dateRec.map((item) => ({
      title: item[0],
      dataIndex: item[0],
      width: 100,
      renderText: secondsParse,
    })),
  ].map((item) => ({
    search: false,
    ...item,
    render,
  }));

export default () => {
  const [timeRange, setTimeRange] = useState({});
  const [dateRec, setDateRec] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = packColumns(dateRec);
  const scrollX = columns
    .map((item) => item.width)
    .reduce((pre = 0, curr = 0) => pre + curr);

  const downloadFileToExcel = () => {
    if (tableData.length < 1 || dateRec.length < 1) {
      message.info('导出数据不能为空，请重新查询');
      return
    }
    setLoading(true)
    parseExcelData().then((res) => {
      let option = {};  //option代表的就是excel文件
      option.fileName = "课时统计表";  //excel文件名称
      option.datas = [
        {
          sheetData: res,  //excel文件中的数据源
          sheetName: "表1",  //excel文件中sheet页名称
          sheetFilter: ["index", "name", "times", "duration", ...dateRec.map((item) => item[0])],  //excel文件中需显示的列数据
          sheetHeader: ["序号", "姓名", "出勤次数", "上课时长", ...dateRec.map((item) => item[0])], //excel文件中每列的表头名称
          columnWidths: [4, 5, 5, 10, 10, ...dateRec.map(() => 10)]
        }
      ]
      let toExcel = new ExportJsonExcel(option);  //生成excel文件
      toExcel.saveExcel();  //下载excel文件
      setLoading(false);
      message.success("数据导出成功")
    }).catch((err) => {
      message.error("导出出错,请刷新重试")
      console.log(err);
      setLoading(false)
    });
  }

  const parseExcelData = () => {
    return new Promise((resolve, reject) => {
      let _res = [];// res.sort((a, b) => (b.times - a.times));
      tableData.sort((a, b) => {
        if ((b.times === a.times)) {
          return b.duration - a.duration;
        } else {
          return b.times - a.times
        }
      })
      try {
        tableData.map((item, index) => {
          let _item = {
            index: index + 1,
            name: item.name,
            times: item.times,
            duration: secondsParse(item.duration),
          }
          dateRec.forEach((date) => {
            _item[date[0]] = secondsParse(item[date[0]])
          })
          _res.push(_item)
        })
        resolve(_res);
        return
      } catch (error) {
        reject(error)
        return
      }
    })
  }


  return (
    <ProTable
      bordered
      rowKey="index"
      columns={columns}
      search={{ labelWidth: 100, defaultCollapsed: false }}
      postData={(res) => {
        setTableData(res)
        return res;
      }}
      request={async (params) => {
        if (isSortAction) {
          isSortAction = false;
          return dataSource;
        }
        fetchCourseDateRec(params).then((recs) =>
          setDateRec(Object.entries(recs)),
        );
        dataSource = await fetchCourseStatisticData(params);
        return dataSource;
      }}
      headerTitle={
        <span style={{ color: '#1890ff' }}>时长统计 79小时10分9秒</span>
      }
      toolBarRender={() => {
        return <Button type="primary" loading={loading} icon={<ExportOutlined />} onClick={downloadFileToExcel} >导出excel</Button>

      }}
      pagination={false}
      defaultSize="small"
      scroll={{ x: `calc(${scrollX}px + 50%)` }}
      onChange={(_p, _f, sorter) => {
        if (!isEmpty(sorter)) {
          isSortAction = true;
        }
      }}
    />
  );
};
