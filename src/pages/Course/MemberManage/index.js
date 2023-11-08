import {
  getVerify,
  roles,
  verify_promissions,
  verify_rules,
} from '@/common/constants';
import U from '@/common/U';
import {
  deleteMember,
  fetchCourseInfo,
  fetchCourseList,
  fetchMemberList,
  updateMember,
} from '@/services/course';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useParams, useSearchParams } from '@umijs/max';
import { Button, Form, message, Popconfirm, Switch } from 'antd';
import { useEffect, useRef, useState } from 'react';
import MemberManageForm from '../components/MemberManageForm';
import { data2Excel } from '@/common/data2Excel';

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
      align: 'center',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      search: true,
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      align: 'center',
      search: false,
      width: 180,
      render: (time) =>
        time === '-'
          ? '暂无'
          : U.date.format(new Date(time), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      align: 'center',
      valueType: 'select',
      width: 80,
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
      align: 'center',
      fieldProps: {
        options: roles,
      },
    },
    {
      title: '进入课堂',
      dataIndex: 'verify',
      align: 'center',
      render: (val, row) => (
        <Switch
          checkedChildren="允许"
          unCheckedChildren="不允许"
          checked={[verify_rules.ALL_RIGNHT, verify_rules.ONLY_ROOM].includes(
            val,
          )}
          onChange={(checked) => {
            updateMember({
              id: row.id,
              verify: getVerify(val, verify_promissions.ROOM.value, checked),
            }).then(() => {
              tableRef.current.reload();
              message.success('操作成功');
            });
          }}
        />
      ),
    },
    {
      title: '观看回放',
      dataIndex: 'verify',
      align: 'center',
      render: (val, row) => (
        <Switch
          checkedChildren="允许"
          unCheckedChildren="不允许"
          checked={[
            verify_rules.ALL_RIGNHT,
            verify_rules.ONLY_PLAYBACK,
          ].includes(val)}
          onChange={(checked) => {
            updateMember({
              id: row.id,
              verify: getVerify(
                val,
                verify_promissions.PLAYBACK.value,
                checked,
              ),
            }).then(() => {
              tableRef.current.reload();
              message.success('操作成功');
            });
          }}
        />
      ),
    },
    // {
    //   title: '课堂链接',
    //   dataIndex: 'url',
    // },
    {
      title: '备注',
      dataIndex: 'tag',
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

const MemberManage = () => {
  const { courseId } = useParams();
  const tableRef = useRef();
  const formRef = useRef()
  const [drawerProps, setDrawProps] = useState({ visible: false });
  const [course, setCourse] = useState();
  const [total, setTotal] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams()

  const loadCourse = () => {
    fetchCourseList({ courseId }).then((res) => {
      setCourse(res.data[0]);
    });
  };

  const studentsExport = () => {
    setLoading(true);
    data2Excel(
      `《${course.title}》学生信息表-${U.date.format(
        new Date(),
        'yyyy-MM-dd',
      )}`,
      [
        {
          sheetData: allUsers, //excel文件中的数据源
          sheetName: '表1', //excel文件中sheet页名称
          sheetFilter: [
            'index',
            'name',
            'gender',
            'phone',
            'createdAt',
            'age',
            'verify',
          ], //excel文件中需显示的列数据
          sheetHeader: [
            '序号',
            '姓名',
            '性别',
            '联系方式',
            '报名时间',
            '年级',
            '权限',
          ], //excel文件中每列的表头名称
          columnWidths: [4, 5, 5, 5, 10, 10, 15, 10],
        },
      ],
    );
    setLoading(false);
  };
  const phoneField = 'phone'
  let defaultPhone = searchParam.get(phoneField)
  useEffect(() => {
    defaultPhone && formRef.current.setFieldValue(phoneField, defaultPhone)
    loadCourse()
  }, []);
  // TODO try fix
  useEffect(async () => {
    if (total > 0) {
      const _allUser = (
        await fetchMemberList({ size: total, courseId: courseId })
      ).data;
      setAllUsers(_allUser);
    }
  }, [total]);

  return (
    <PageContainer
      header={{
        title: '成员管理',
        onBack: () => history.back(),
      }}
    >
      <ProTable
        headerTitle={course && course.title}
        actionRef={tableRef}
        formRef={formRef}
        rowKey="id"
        columns={columns(setDrawProps, tableRef)}
        request={async (params) => {
          let _params = { ...params, courseId, phone: defaultPhone ?? params.phone }
          console.log('==>', _params);
          if (defaultPhone) {
            searchParam.delete(phoneField)
            setSearchParam(searchParam)
          }
          const result = await fetchMemberList(_params);
          setTotal(result.total);
          return result;
        }}
        scroll={{ x: 900 }}
        toolBarRender={() => (
          <>
            <Button
              type="primary"
              loading={loading}
              icon={<ExportOutlined />}
              onClick={() => {
                studentsExport();
              }}
            >
              导出
            </Button>
            <Button
              onClick={() => setDrawProps({ visible: true })}
              icon={<PlusOutlined />}
              type="primary"
            >
              新建
            </Button>
          </>
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

export default MemberManage;
