import U from '@/common/U';
import { fetchCourseList, updateCourse } from '@/services/course';
import { history } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import CourseManageForm from './components/CourseManageForm';

const columns = (openDrawer, tableRef) =>
  [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: '课程号',
      dataIndex: 'courseId',
      search: true,
      hideInTable: true,
    },
    {
      title: '课程名称',
      dataIndex: 'title',
      width: 200,
      search: true,
      ellipsis: true,
    },
    {
      title: '教室ID',
      dataIndex: 'roomId',
      align: 'center',
    },
    {
      title: '主讲教师',
      dataIndex: 'teacher',
      align: 'center',
    },
    {
      title: '报名人数',
      dataIndex: 'applyCount',
      align: 'center',
    },
    {
      title: '课程价格',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 300,
      fixed: 'right',
      render: (_, row) => (
        <>
          <Button
            size="small"
            type="link"
            onClick={() =>
              history.push({
                pathname: `/course/member-manage/${row.courseId}`,
                search: {
                  uniCourseId: row.id,
                },
              })
            }
          >
            成员管理
          </Button>
          <Button
            size="small"
            type="link"
            onClick={() =>
              history.push({
                pathname: `/course/classroom-manage/${row.courseId}`,
                search: {
                  courseName: row.title,
                  roomId: row.roomId,
                  courseId: row.courseId,
                },
              })
            }
          >
            课堂管理
          </Button>
          <Button onClick={() => openDrawer(row)} size="small" type="link">
            编辑
          </Button>
          <Popconfirm
            title="确定删除?"
            onConfirm={() =>
              updateCourse({ id: row.id, isDelete: 0 }).then(() => {
                tableRef.current.reload();
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

const Course = () => {
  const [drawerProps, setDrawerProps] = useState({ visible: false });
  const tableRef = useRef();

  const handleDrawerOpen = (row) => {
    setDrawerProps({
      visible: true,
      id: row?.id,
    });
  };

  const filterParams = (params, fields = []) => {
    let _params = {}
    fields.forEach((field) => {
      _params[field] = params[field]
    })
    return _params;
  }

  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        pagination={null}
        rowKey="id"
        columns={columns(handleDrawerOpen, tableRef)}
        request={async (params) => {
          const _params = filterParams(params, ["title", "courseId", "current", "pageSize"]);
          U.obj.RemoveNulls(_params)
          return await fetchCourseList(_params)
        }}
        scroll={{ y: 458 }}
        toolBarRender={() => (
          <Button
            onClick={() => handleDrawerOpen()}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            创建课程
          </Button>
        )}
      />
      <CourseManageForm
        {...drawerProps}
        tableReload={() => tableRef.current.reload()}
        handleClose={() => setDrawerProps({ visible: false })}
      />
    </PageContainer>
  );
};

export default Course
