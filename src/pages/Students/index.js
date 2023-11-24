import U from '@/common/U';
import { Utils } from '@/common/Utils';
import { data2Excel } from '@/common/data2Excel';
import { EUserType } from '@/common/types';
import { getCourseList } from '@/services/classHourStatistics';
import { getAllActions } from '@/services/client';
import { fetchMemberList } from '@/services/course';
import { history } from '@/utils';
import { DownOutlined, ExportOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { connect, useSelector, useStore } from '@umijs/max';
import { Button, Dropdown, Menu, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';


const columns = (courses = [], onCourseClick) =>
  [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 40,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 50,
      align: 'center',
      search: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      search: true,
      width: 80,
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      align: 'center',
      search: false,
      width: 80,
      render: (time) => time === "-" ? "暂无" : U.date.format(new Date(time), 'yyyy-MM-dd HH:mm:ss')
    },
    {
      title: '报名课次',
      dataIndex: 'registers',
      align: 'center',
      width: 50,
      render: (registers) => {
        return <p>{registers.length}次</p>
      },
    },
    {
      title: '操作',
      dataIndex: 'registers',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (registers) => {
        let items = courses.length > 0 ? registers.map((item, index) => {
          let { courseId, verify, uniCourseId } = item;
          const currentCourse = courses.find((item) => item.value.endsWith(courseId))
          return {
            label: <div style={{ display: "flex", gap: "10px" }}>
              <span>课程号:{courseId}</span>
              <span style={{ flex: 1 }}>{currentCourse !== undefined ? currentCourse.label : '该课程已结束'}</span>
              {Utils.role.getRoleTag(item.status)}
            </div>,
            key: index,
            item: item
          }
        }) : []
        return (
          <Dropdown menu={{ items, onClick: (e) => onCourseClick(items[e.key].item) }} >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                操作
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        );
      },
    },
  ].map((item) => ({ search: false, ...item }));

const Students = () => {
  const tableRef = useRef();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false)
  const { coursesKV } = useSelector(state => state.courses)
  const { students } = useSelector(state => state.students)
  const onCourseClick = (e) => {
    const { courseId, uniCourseId, phone } = e
    history.push({
      pathname: `/course/member-manage/${courseId}`,
      search: {
        uniCourseId: uniCourseId,
        phone: phone
      }
    })
  }
  const loadData = async (params) => {
    const { name, phone } = params
    if (list.length < 1 || (!name && !phone)) {
      setList(students)
    } else {
      let data =
        (
          await fetchMemberList({
            name: params.name,
            phone: params.phone,
            size: 10000,
          })
        ).data || [];
      let _list = [];
      data.forEach(async (item) => {
        const { id, name, gender, phone, courseId, createdAt, status } = item
        let _index = _list.findIndex((item) => item.phone === phone)
        if (_index < 0) {
          _list.push({ id, name, gender, phone, courseId, createdAt, status, index: _list.length + 1, registers: [item] });
        } else {
          _list[_index].registers.push(item)
        }
      });
      setList([..._list]);
    }
  };
  useEffect(() => {
    list.length < 1 && setList(students)
  }, [students])
  const studentsExport = () => {
    setLoading(true)
    data2Excel(`学生信息表-${U.date.format(new Date(), "yyyy-MM-dd")}`, [
      {
        sheetData: students,  //excel文件中的数据源
        sheetName: "表1",  //excel文件中sheet页名称
        sheetFilter: ["index", "name", "gender", "phone", "createdAt", "courseIds", "age", "tag"],  //excel文件中需显示的列数据
        sheetHeader: ["序号", "姓名", "性别", "联系方式", "报名时间", "报名课程号", "年级", "备注"], //excel文件中每列的表头名称
        columnWidths: [4, 5, 5, 5, 10, 10, 15, 10]
      }
    ])
    setLoading(false)
  }

  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        rowKey="id"
        columns={columns(coursesKV, onCourseClick)}
        search={true}
        request={async (params) => loadData(params)}
        dataSource={list}
        toolBarRender={() => {
          return <Button type="primary" loading={loading} icon={<ExportOutlined />} onClick={() => { studentsExport() }} >导出学生信息</Button>
        }}
      />
    </PageContainer>
  );
};

export default Students;

// {
//   title: '使用设备数',
//   dataIndex: 'equipments',
//   align: 'left',
//   render: (_, row) => {
//     let { equipments = [] } = row;
//     let _length = equipments.length;
//     return (
//       <div>
//         设备数:{_length}
//         <span>
//           {_length > 0 &&
//             equipments.map((item, index) => {
//               let { device, system } = item;
//               return (
//                 <div style={{ textAlign: 'left' }} key={index}>
//                   {index + 1 + '.' + device + ' ' + system}
//                 </div>
//               );
//             })}
//         </span>
//       </div>
//     );
//   },
// },
// {
//   title: '登录记录',
//   dataIndex: 'loginActions',
//   align: 'center',
//   render: (loginActions, row) => {
//     return <Button type="link">{loginActions.length}次</Button>;
//   },
// },


// const loadActions = () => {
//   // console.log("开始");
//   students.forEach((item, index) => {
//     let { phone } = item;
//     getAllActions({ userId: phone, actionType: 'LOGIN' }).then((res) => {
//       let equipments = [];
//       // eslint-disable-next-line array-callback-return
//       res.length > 0 &&
//         res.forEach((item) => {
//           let { description } = item;
//           let equipment = {};
//           let m1;
//           console.log(description);
//           if (
//             description.includes('iPhone') ||
//             description.includes('iPad')
//           ) {
//             // 获取设备名
//             if (description.includes('iPad')) {
//               equipment.device = 'iPad';
//             } else {
//               equipment.device = 'iPhone';
//             }
//             // 获取操作系统版本
//             m1 =
//               description.match(/iPhone OS .*?(?= )/) ||
//               description.match(/OS .*?(?= )/);
//             if (m1 && m1.length > 0) {
//               equipment.system = m1[0];
//             }
//           }
//           // 安卓手机
//           if (description.includes('Android')) {
//             // 获取设备名
//             m1 = description.match(/Android.*; ?(.*(?= Build))/);
//             if (m1 && m1.length > 1) {
//               equipment.device = m1[1];
//             }
//             // 获取操作系统版本
//             m1 = description.match(/Android.*?(?=;)/);
//             if (m1 && m1.length > 0) {
//               equipment.system = m1[0];
//             }
//           }
//           //window
//           if (description.includes('Windows')) {
//             equipment.device = 'Windows';

//             m1 = description.match(/Windows.*?(?=AppleWebKit)/);
//             if (m1 && m1.length > 0) {
//               equipment.system = m1[0];
//             }
//           }
//           if (
//             equipments.findIndex(
//               (item) =>
//                 item.device === equipment.device &&
//                 item.system === equipment.system,
//             ) < 0
//           ) {
//             (equipment.device || equipment.system) &&
//               equipments.push(equipment);
//           }
//         });
//       equipments.length > 0 && console.log(equipments);
//       students[index] = { ...item, loginActions: res, equipments };
//       setStudents([...students]);
//     });
//   });
// };

// useEffect(() => students.length > 0 && loadActions(), [students.length]);
