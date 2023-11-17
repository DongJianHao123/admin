import { useEffect, useRef, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { fetchCourseList, updateCourse } from '@/services/course';

import { history } from '@/utils';
import U from '@/common/U';
import { connect, useSearchParams } from '@umijs/max';

const columns = (tableRef) =>
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
                  uniCourseId: row.id
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
          <Button
            onClick={() => history.push({
              pathname: `/course/edit/${row.id}`
            })}
            size="small"
            type="link"
          >
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

const Course = (props) => {
  const tableRef = useRef();
  const [searchParam, setSearchParam] = useSearchParams()

  const filterParams = (params, fields = []) => {
    let _params = {};
    fields.forEach((field) => {
      _params[field] = params[field];
    });
    return _params;
  };
  useEffect(() => {
    const page_num = searchParam.get('page_num') || 1;
    tableRef.current.setPageInfo({ ...tableRef.current.pageInfo, current: page_num })
    console.log(props);
  }, [])
  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        // pagination={null}
        rowKey="id"
        columns={columns(tableRef)}
        request={async (params) => {
          let _params = filterParams(params, [
            'title',
            'courseId',
            'current',
            'pageSize',
          ]);
          _params = U.obj.RemoveNulls(_params);
          setSearchParam({ page_num: _params['current'] })
          const data = await fetchCourseList(_params);
          return data
        }}
        toolBarRender={() => (
          <Button
            onClick={() => history.push('/course/edit/0')}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            新建课程
          </Button>
        )}
      />
    </PageContainer>
  );
};

export default connect(({ courses }) => ({ courses }))(Course);
