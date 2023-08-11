import { Action_type } from "@/common/constants";
import U from "@/common/U";
import { Utils } from "@/common/Utils";
import { actions } from "@/services/actions";
import { getCourseList } from "@/services/classHourStatistics";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Popover } from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import './index.less'

let isSortAction = false;
let dataSource = [];

const onCell = ({ dataLength }, index) => dataLength - 1 === index ? { colSpan: 0 } : {};

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    align: 'center',
    width: 10,
    onCell,
  },
  {
    title: '课程',
    dataIndex: 'roomId',
    hideInTable: true,
    search: true,
    valueType: 'select',
    request: getCourseList,
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
    title: '角色',
    dataIndex: 'role',
    search: true,
    valueType: 'select',
    width: 30,
    align: "center",
    fieldProps: {
      options: [
        { label: '老师', value: 'teacher' },
        { label: '学生', value: 'student' },
        { label: '助教', value: 'ta' },
      ],
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
    title: '时间',
    dataIndex: 'actionTime',
    width: 40,
    hideInTable: true,
    align: "center",
    valueType: 'dateRange',
    initialValue: [moment().add(0, 'd'), moment().add(0, 'd',)],
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
        console.log(startTime, endTime);
        return ({
          startTime,
          endTime
        })
      }
    },
  }, {
    title: '时间',
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
    search: true,
    valueType: 'select',
    fieldProps: {
      options: Object.values(Action_type)
    }
  },
  {
    title: '备注',
    search: true,
    dataIndex: 'description',
    valueType: 'userId',
    align: 'center',
    width: 60,
    render: (txt) => <Popover content={<p className="table-txt-popover">{txt}</p>} title="备注"> <span className="table-txt">{txt}</span></Popover>,
    onCell,
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

const Actions = () => {

  return (
    <PageContainer>
      <ProTable
        className="action-table"
        rowKey="index"
        columns={columns}
        search={{ labelWidth: 100, defaultCollapsed: false }}
        request={async (params) => {
          console.log("请求", params);
          if (isSortAction) {
            isSortAction = false;
            return dataSource;
          }
          let _params = U.obj.RemoveNulls(params)
          dataSource = await actions(_params);
          return dataSource
        }}
        pagination={true}
        defaultSize="small"
        scroll={{ x: `calc(${scrollX}px + 50%)`, y: 600 }}
        onChange={(_p, _f, sorter) => {
          if (!isEmpty(sorter)) {
            isSortAction = true;
          }
        }}
      />

    </PageContainer>
  );
};
export default Actions;
