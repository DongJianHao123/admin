import { deleteMember, fetchMemberList, updateMember } from '@/services/course';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, message, Popconfirm, Switch } from 'antd';
import { useRef, useState } from 'react';
import MemberManageForm, { roles } from '../components/MemberManageForm';

const columns = (setDrawProps, tableRef) =>
  [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '男',
            value: 'male',
          },
          {
            label: '女',
            value: 'female',
          },
        ],
      },
    },
    {
      title: '年级',
      dataIndex: 'age',
    },
    {
      title: '角色',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: {
        options: roles,
      },
    },
    {
      title: '进入课堂',
      dataIndex: 'verify',
      render: (val, row) => (
        <Switch
          checkedChildren="允许"
          unCheckedChildren="不允许"
          defaultChecked={val === '1'}
          onChange={(checked) => {
            updateMember({ id: row.id, verify: checked ? '1' : '0' }).then(
              () => {
                tableRef.current.reload();
                message.success('操作成功');
              },
            );
          }}
        />
      ),
    },
    {
      title: '课堂链接',
      dataIndex: 'url',
    },
    {
      title: '备注',
      dataIndex: 'tag',
      width: 200,
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
            onClick={() => setDrawProps({ visible: true, id: row.id })}
            size="small"
            type="link"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() =>
              deleteMember(row.id).then(() => {
                tableRef.current.reload();
                message.success('操作成功');
              })
            }
          >
            <Button size="small" type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ].map((item) => ({ search: false, width: 120, ...item }));

export default () => {
  const { courseId } = useParams();
  const tableRef = useRef();
  const [drawerProps, setDrawProps] = useState({ visible: false });

  return (
    <PageContainer
      header={{
        title: '成员管理',
        onBack: () => history.back(),
      }}
    >
      <ProTable
        actionRef={tableRef}
        pagination={{ pageSize: 20 }}
        rowKey="id"
        columns={columns(setDrawProps, tableRef)}
        request={(params) => fetchMemberList({ ...params, courseId })}
        scroll={{ y: 458 }}
        toolBarRender={() => (
          <Button
            onClick={() => setDrawProps({ visible: true })}
            icon={<PlusOutlined />}
            type="primary"
          >
            新建
          </Button>
        )}
      />
      <MemberManageForm
        {...drawerProps}
        tableReload={() => tableRef.current.reload()}
        handleClose={() => setDrawProps({ visible: false })}
      />
    </PageContainer>
  );
};
