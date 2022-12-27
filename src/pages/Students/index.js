import { getAllActions } from '@/services/client';
import { fetchMemberList } from '@/services/course';
import { history } from '@/utils';
import { DownOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Menu, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';

const columns = (registInfos = []) =>
  // eslint-disable-next-line array-callback-return
  [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      // search: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '使用设备数',
      dataIndex: 'equipments',
      align: 'left',
      render: (_, row) => {
        let { equipments = [] } = row;
        let _length = equipments.length;
        return (
          <div>
            设备数:{_length}
            <span>
              {_length > 0 &&
                equipments.map((item, index) => {
                  let { device, system } = item;
                  return (
                    <div style={{ textAlign: 'left' }} key={index}>
                      {index + 1 + '.' + device + ' ' + system}
                    </div>
                  );
                })}
            </span>
          </div>
        );
      },
    },
    {
      title: '登录记录',
      dataIndex: 'loginActions',
      align: 'center',
      render: (loginActions, row) => {
        return <Button type="link">{loginActions.length}次</Button>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (status, row) => {
        let { phone } = row;
        let openNum = registInfos.filter(
          (item) => item.phone === phone && item.verify === '1',
        ).length;
        let closeNum = registInfos.filter(
          (item) => item.phone === phone && item.verify === '0',
        ).length;
        return (
          <div>
            <Tag color={'success'}>已启用 : {openNum}</Tag>
            <div />
            <Tag style={{ marginTop: '5px' }}>已禁用 : {closeNum}</Tag>
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'phone',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (phone, row) => {
        let myRegist = registInfos.filter((item) => item.phone === phone);
        let menus = (
          <Menu>
            {myRegist.map((item, index) => {
              let { courseId, verify, uniCourseId } = item;
              return (
                <Menu.Item
                  key={index}
                  onClick={() => {
                    history.push({
                      pathname: `/course/member-manage/${courseId}`,
                      search: {
                        uniCourseId: uniCourseId,
                      },
                    });
                  }}
                >
                  课程号:{courseId}--状态:{' '}
                  {verify === '1' ? (
                    <Tag color={'success'}>启用</Tag>
                  ) : (
                    <Tag>禁用</Tag>
                  )}
                </Menu.Item>
              );
            })}
          </Menu>
        );

        return (
          <Dropdown overlay={menus}>
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
    // eslint-disable-next-line array-callback-return
  ].map((item) => ({ search: false, ...item }));

export default () => {
  const tableRef = useRef();
  let [students, setStudents] = useState([]);
  let [registInfos, setRegistInfos] = useState([]);

  const loadData = async () => {
    let students =
      (
        await fetchMemberList({
          size: 2000,
        })
      ).data || [];
    setRegistInfos([...students]);
    let _students = [];
    students.forEach(async (item, index) => {
      let { phone } = item;
      if (_students.findIndex((item) => item.phone === phone) < 0) {
        _students.push({ ...item, index: _students.length + 1 });
      }
    });
    setStudents([..._students]);
  };

  const loadActions = () => {
    // console.log("开始");
    students.forEach((item, index) => {
      let { phone } = item;
      getAllActions({ userId: phone, actionType: 'LOGIN' }).then((res) => {
        let equipments = [];
        // eslint-disable-next-line array-callback-return
        res.length > 0 &&
          res.forEach((item) => {
            let { description } = item;
            let equipment = {};
            let m1;
            console.log(description);
            if (
              description.includes('iPhone') ||
              description.includes('iPad')
            ) {
              // 获取设备名
              if (description.includes('iPad')) {
                equipment.device = 'iPad';
              } else {
                equipment.device = 'iPhone';
              }
              // 获取操作系统版本
              m1 =
                description.match(/iPhone OS .*?(?= )/) ||
                description.match(/OS .*?(?= )/);
              if (m1 && m1.length > 0) {
                equipment.system = m1[0];
              }
            }
            // 安卓手机
            if (description.includes('Android')) {
              // 获取设备名
              m1 = description.match(/Android.*; ?(.*(?= Build))/);
              if (m1 && m1.length > 1) {
                equipment.device = m1[1];
              }
              // 获取操作系统版本
              m1 = description.match(/Android.*?(?=;)/);
              if (m1 && m1.length > 0) {
                equipment.system = m1[0];
              }
            }
            //window
            if (description.includes('Windows')) {
              equipment.device = 'Windows';

              m1 = description.match(/Windows.*?(?=AppleWebKit)/);
              if (m1 && m1.length > 0) {
                equipment.system = m1[0];
              }
            }
            if (
              equipments.findIndex(
                (item) =>
                  item.device === equipment.device &&
                  item.system === equipment.system,
              ) < 0
            ) {
              (equipment.device || equipment.system) &&
                equipments.push(equipment);
            }
          });
        equipments.length > 0 && console.log(equipments);
        students[index] = { ...item, loginActions: res, equipments };
        setStudents([...students]);
      });
    });
  };

  useEffect(() => students.length > 0 && loadActions(), [students.length]);

  return (
    <PageContainer>
      <ProTable
        actionRef={tableRef}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
        columns={columns(registInfos)}
        search={false}
        request={async () => loadData()}
        dataSource={students}
        scroll={{ y: 458 }}
        options={{
          reload: false,
        }}
        // options={false}
        // toolBarRender={() => <Button type="primary">短信通知</Button>}
      />
    </PageContainer>
  );
};
