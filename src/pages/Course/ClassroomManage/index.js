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
import { useRequest, useSearchParams } from '@umijs/max';
import { Button, message, Switch, Upload } from 'antd';
import { useRef, useState } from 'react';
import { history } from 'umi';
import BatchImportProps from '../components/BatchImportProps';
import ClassroomManageForm from '../components/ClassroomManageForm';
import '../../../style/classroomManage.less';
import { useEventListener } from 'ahooks';
import { Utils } from '@/common/Utils';

const columns = (openDrawer, handleStatusChange, deleteRow) =>
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
      width: 140,
    },
    {
      title: '结束时间',
      dataIndex: 'endAt',
      align: 'center',
      valueType: 'dateTime',
      width: 140,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      align: 'center',
    },
    {
      title: '上课地点',
      dataIndex: 'location',
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
            onClick={() => openDrawer({ visible: true, id: row.id })}
            size="small"
            type="link"
          >
            编辑
          </Button>
          <Button
            onClick={() => deleteRow(row)}
            size="small"
            type="link"
            danger
          >
            删除
          </Button>
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

export default () => {
  const [searchParams] = useSearchParams();
  const [drawerProps, setDrawerProps] = useState({ visible: false });
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
        columns={columns(setDrawerProps, handleStatusChange, handleDelete)}
        request={async (params) =>
          fetchClassroomList({
            ...params,
            'courseId.equals': searchParams.get('courseId'),
          })
        }
        scroll={{ y: 400 }}
        toolBarRender={() => (
          <div className="table-btn">
            <BatchImportProps reloadData={tableRef.current.reload} />
            <Button
              onClick={() => setDrawerProps({ visible: true })}
              icon={<PlusOutlined />}
              type="primary"
            >
              新增
            </Button>
          </div>
        )}
      />
      <ClassroomManageForm
        tableReload={() => tableRef.current.reload()}
        handleClose={() => setDrawerProps({ visible: false })}
        {...drawerProps}
      />
    </PageContainer>
  );
};
