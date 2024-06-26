import {
  deleteClassroom,
  fetchClassroomList,
  updateClassroomStatus,
} from '@/services/course';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest, useSearchParams, useParams } from '@umijs/max';
import { Button, message, Popconfirm, Switch, Upload } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import BatchImportProps from '../components/BatchImportProps';
import '../../../style/Course/classroomManage.less';
import { useEventListener } from 'ahooks';
import { Utils } from '@/common/Utils';

const columns = (courseId, handleStatusChange, deleteRow) =>
  [
    {
      title: '课堂状态',
      dataIndex: 'classroomStatus',
      search: true,
      hideInTable: true,
      valueType: 'select',
      initialValue: ['ended', 'notStarted', 'ongoing', 'video'],
      fieldProps: {
        allowClear: false,
        mode: 'multiple',
        options: [
          { label: '已结束的课堂', value: 'ended' },
          { label: '未开始的课堂', value: 'notStarted' },
          { label: '上课中的课堂', value: 'ongoing' },
          { label: '上传视频的课堂', value: 'video' },
        ],
      },
    },
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      render: (_, row, index) => index + 1
    },
    {
      title: '封面图',
      dataIndex: 'coverUrl',
      align: 'center',
      width: 160,
      render: (coverUrl, row, index) => coverUrl !== '-' ? <img style={{ borderRadius: '4px', width: "140px", height: "79px" }} className="cover" src={coverUrl} /> : <div>暂无</div>
    },
    {
      title: '课堂名称',
      dataIndex: 'classroomName',
      width: 180,
      ellipsis: true,
      render: (_, row) => (
        <Button
          onClick={() => window.open(row.choseUrl)}
          size="small"
          type="link"
        >
          {row.className}
        </Button>
      ),
    },
    {
      title: '上课时间',
      dataIndex: 'startAt',
      align: 'center',
      valueType: 'dateTime',
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
      },
      width: 180,
    },
    // {
    //   title: '结束时间',
    //   dataIndex: 'endAt',
    //   align: 'center',
    //   valueType: 'dateTime',
    //   width: 140,
    // },
    // {
    //   title: '时长',
    //   dataIndex: 'duration',
    //   align: 'center',
    // },
    {
      title: '上课地点',
      dataIndex: 'location',
      align: "center"
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width:180,
    },
    {
      title: '上架/下架',
      dataIndex: 'status',
      align: 'center',
      render: (val, row) => (
        <Switch
          onChange={(checked) => handleStatusChange(row, checked ? '1' : '0')}
          defaultChecked={val === '1'}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_, row) => (
        <>
          <Button
            onClick={() => history.push(`/course/classroom-manage/edit/${courseId}/${row.id}`)}
            size="small"
            type="link"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => deleteRow(row)}
          >
            <Button

              size="small"
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
          <Button
            size="small"
            type="link"
            onClick={() =>
              history.push(`/course/classroom-manage/${row.courseId}`)
            }
          >
            布置作业
          </Button>
        </>
      ),
    },
  ].map((item) => ({ search: false, width: 120, ...item }));

const ClassroomManage = () => {
  const [searchParams] = useSearchParams();
  const { courseId } = useParams()
  const [importProps, setImportProps] = useState({ visible: false });
  const tableRef = useRef();
  const { run: runUpdateStatus } = useRequest(updateClassroomStatus, {
    manual: true,
  });
  const { run: runDelete } = useRequest(deleteClassroom, { manual: true });

  const handleStatusChange = (row, status) => {
    runUpdateStatus({ status, id: row.id }).then(() => {
      message.success('操作成功');
      tableRef.current.reload();
    });
  };

  const handleDelete = (row) => {
    runDelete(row.id).then(() => {
      message.success('操作成功');
      tableRef.current.reload();
    });
  };

  return (
    <PageContainer
      header={{
        title: '课堂管理',
        onBack: () => history.back(),
      }}
      className="classroom-manage"
    >
      <ProForm
        readonly
        render={null}
        submitter={{ render: () => null }}
        layout="horizontal"
        grid
        request={async () => ({
          courseName: searchParams.get('courseName'),
          classroomNum: searchParams.get('roomId'),
        })}
      >
        <ProFormText
          colProps={{ span: 6 }}
          name="courseName"
          label="课程名称"
        />
        <ProFormText
          colProps={{ span: 6 }}
          name="classroomNum"
          label="教室号"
        />
      </ProForm>
      <ProTable
        actionRef={tableRef}
        pagination={false}
        rowKey="id"
        columns={columns(courseId, handleStatusChange, handleDelete)}
        request={async (params) =>
          fetchClassroomList({
            ...params,
            'courseId.equals': searchParams.get('courseId'),
          })
        }
        toolBarRender={() => (
          <div className="table-btn">
            <BatchImportProps reloadData={tableRef.current.reload} />
            <Button
              onClick={() => history.push(`/course/classroom-manage/edit/${courseId}/0`)}
              icon={<PlusOutlined />}
              type="primary"
            >
              新建
            </Button>
          </div>
        )}
      />
    </PageContainer>
  );
};

export default ClassroomManage;
