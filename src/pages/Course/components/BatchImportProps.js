import U from '@/common/U';
import { createClassroom } from '@/services/course';
import { fileUpload } from '@/utils';
import {
  PlaySquareOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import {
  Button,
  DatePicker,
  Form,
  message,
  Popconfirm,
  Progress,
  Space,
  Switch,
  Table,
  Upload,
} from 'antd';
import Input from 'antd/lib/input/Input';
import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';

export default (props) => {
  let { reloadData } = props;
  const columns = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'index',
      align: 'center',
      render: (txt, item, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: '课堂名称',
      width: 100,
      align: 'center',
      dataIndex: 'className',
      editable: true,
      render: (txt, item, index) => {
        return (
          <Input
            required
            onChange={(e) => {
              modClassRoomList('className', e.target.value, index);
              console.log(e);
            }}
            value={txt}
          />
        );
      },
    },
    {
      title: '时长',
      width: 80,
      dataIndex: 'duration',
      align: 'center',
      render: () => '--',
    },
    {
      title: '大小',
      width: 80,
      align: 'center',
      dataIndex: 'size',
      render: (size) => {
        let res = (size / 1024 / 1024).toFixed(2);
        return (!isNaN(res) ? res : '0') + 'MB';
      },
    },

    {
      title: '上架/下架',
      dataIndex: 'status',
      align: 'center',
      width: 50,
      render: (val, row, index) => (
        <Switch
          onChange={(checked) => handleStatusChange(index, checked ? '1' : '0')}
          checked={val === '1'}
        />
      ),
    },
    {
      title: '预览',
      dataIndex: 'videoUrl',
      width: 60,
      align: 'center',
      render: (url) => {
        return url === '-' ? (
          <span style={{ color: 'grey' }}>预览</span>
        ) : (
          <a href={url} target="_blank" rel="noreferrer">
            <PlaySquareOutlined type="primary" style={{ fontSize: '28px' }} />
          </a>
        );
      },
    },
    {
      title: '执行进度',
      dataIndex: 'progress',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (progress, item) => <Progress percent={item.progress} />,
    },
    {
      title: ' ',
      width: 50,
      dataIndex: 'videoUrl',
      align: 'center',
      fixed: 'right',
      render: (videoUrl, item, index) => {
        console.log(U.str.isEmpty(videoUrl));
        console.log(videoUrl);
        return videoUrl === '-' ? (
          <span style={{ color: 'grey' }}>---</span>
        ) : (
          <a
            key="link"
            onClick={() => {
              copy(videoUrl);
              console.log(videoUrl);
            }}
          >
            复制链接
          </a>
        );
      },
    },
  ];

  let [classRoomList, setClassRoomList] = useState([]);
  let [importSuccess, setImportSuccess] = useState(0);
  let [importErr, setImportErr] = useState(0);
  const [loading, setLoading] = useState(false);
  let [progressObj, setProgressObj] = useState({ index: -1, arr: [] });

  const [searchParams] = useSearchParams();

  useEffect(() => setClassRoomList(classRoomList), [classRoomList]);

  const modClassRoomList = (filed, value, index) => {
    classRoomList[index][filed] = value;
    setClassRoomList([...classRoomList]);
  };

  const btnClick = (id) => {
    let btn = document.getElementById(id);
    btn.click();
  };

  const handleStatusChange = (index, val) => {
    classRoomList[index].status = val;
    setClassRoomList([...classRoomList]);
    console.log(classRoomList);
  };

  const batchStatus = (selectedRowKeys, val) => {
    // eslint-disable-next-line array-callback-return
    selectedRowKeys.map((item) => {
      handleStatusChange(item, val);
    });
  };

  const handleTableDelete = (selectedRowKeys) => {
    // eslint-disable-next-line array-callback-return
    let _classRoomList = classRoomList.filter(
      (item, index) => !selectedRowKeys.includes(index),
    );
    setClassRoomList(_classRoomList);
    message.success(`成功删除${selectedRowKeys.length}条数据`);
  };

  const progressCallback = (progress, index) => {
    progressObj.index = index;
    progressObj.arr[index] = progress;
    setProgressObj({ ...progressObj });
    console.log(progressObj);
    // updateData(classRoomList[index], index)
    // console.log(progress);
  };

  useEffect(() => {
    console.log('有变化');
    console.log(progressObj);
    if (classRoomList.length > 0 && progressObj.index > -1) {
      classRoomList[progressObj.index].progress =
        progressObj.arr[progressObj.index];
      setClassRoomList([...classRoomList]);
    }
  }, [progressObj]);

  const handleUploadAction = (e) => {
    let _index = classRoomList.length;
    console.log(e);
    e.index = _index;
    let { name, size, type } = e;
    classRoomList.push({
      index: _index,
      className: name.substring(0, name.lastIndexOf('.')),
      clientId: '',
      size,
      type,
      status: '0',
      video: e,
      videoUrl: '',
      progress: '0',
      uploadStatus: false,
    });
    setClassRoomList([...classRoomList]);
    console.log(classRoomList);
  };

  //开始上传
  const startUpload = (index) => {
    console.log('开始上传');
    console.log(classRoomList);
    if (classRoomList[index]) {
      if (!classRoomList[index].uploadStatus) {
        fileUpload(classRoomList[index].video, progressCallback)
          .then((res) => {
            console.log(`第${index + 1}个文件上传成功`);
            console.log(res);
            classRoomList[
              index
            ].videoUrl = `https://ssl.cdn.maodouketang.com/${res.key}`;
            classRoomList[index].uploadStatus = true;
            setClassRoomList([...classRoomList]);
            importSuccess = importSuccess + 1;
            setImportSuccess(importSuccess);
            // startUpload(index + 1);
            btnClick('start-upload');
            console.log(classRoomList);
          })
          .catch((err) => {
            console.log('上传失败');
            importErr = importErr + 1;
            setImportSuccess(importErr);
            console.log(err);
          });
      } else {
        startUpload(index + 1);
      }
    }
  };

  const handleTableSubmit = () => {
    let isEmpty = classRoomList.length < 1;
    let isNotReady =
      classRoomList.findIndex((item) => item.progress !== '100') > -1;
    if (isEmpty) {
      message.warn('导入列表为空');
      return false;
    } else if (isNotReady) {
      message.warn('视频未全部上传成功');
      return false;
    } else {
      setLoading(true);
      // eslint-disable-next-line array-callback-return
      classRoomList.map((item, index) => {
        let { videoUrl, className, status = '0' } = item;
        createClassroom({
          courseId: searchParams.get('courseId'),
          roomId: searchParams.get('roomId'),
          type: 1,
          choseUrl: videoUrl,
          className: className,
          status,
          location: '线上',
          remark: '批量导入的课程',
        }).then((res) => {
          //获得结果
          console.log(res);
          if (index === classRoomList.length - 1) {
            message.success('批量导入成功');
            reloadData();
            setImportErr(0);
            setImportSuccess(0);
            setClassRoomList([]);
            setLoading(false);
            return true;
          }
        });
      });

      return true;
    }
  };

  return (
    <div className="batch-import-modal">
      <Upload
        name="file"
        multiple
        action={handleUploadAction}
        className="upload"
        accept="video/*"
        // onChange={()=>startUpload(0)}
      >
        <Button id="upload-btn">点击上传</Button>
      </Upload>
      <ModalForm
        title={
          <div>
            <span> 批量导入</span>
            <Button
              style={{ marginLeft: '20px' }}
              type="primary"
              onClick={() => btnClick('upload-btn')}
            >
              选择视频
            </Button>
            {classRoomList.length > 0 && (
              <Button
                id="start-upload"
                style={{ marginLeft: '20px' }}
                type="primary"
                onClick={() => startUpload(0)}
              >
                开始上传
              </Button>
            )}
          </div>
        }
        trigger={
          <Button
            onClick={() => classRoomList.length < 1 && btnClick('upload-btn')}
          >
            批量导入
          </Button>
        }
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
          okText: '确认导入',
        }}
        onFinish={() => {
          return handleTableSubmit();
        }}
        width={1300}
      >
        <ProTable
          loading={loading}
          columns={columns}
          key="index"
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            alwaysShowAlert: true,
          }}
          tableAlertRender={({
            selectedRowKeys,
            selectedRows,
            onCleanSelected,
          }) => (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
                <span style={{ marginInlineStart: 8 }}>
                  上传成功： {importSuccess}
                </span>
                <span style={{ color: 'red', marginInlineStart: 8 }}>
                  上传失败： {importErr}
                </span>
              </span>
            </Space>
          )}
          tableAlertOptionRender={({
            selectedRowKeys,
            selectedRows,
            onCleanSelected,
          }) => {
            return (
              <Space size={16}>
                <Button
                  type="primary"
                  ghost
                  icon={<VerticalAlignTopOutlined />}
                  onClick={() => batchStatus(selectedRowKeys, '1')}
                >
                  一键上架
                </Button>
                <Button
                  type="primary"
                  ghost
                  icon={<VerticalAlignBottomOutlined />}
                  onClick={() => batchStatus(selectedRowKeys, '0')}
                >
                  一键下架
                </Button>
                <Popconfirm
                  title={
                    selectedRowKeys.length > 0
                      ? `确认要删除这${selectedRowKeys.length}条数据吗`
                      : '您还未选择任何数据'
                  }
                  onConfirm={() =>
                    selectedRowKeys.length > 0 &&
                    handleTableDelete(selectedRowKeys)
                  }
                  okText="确认"
                  cancelText="取消"
                >
                  {' '}
                  <Button danger>删除</Button>
                </Popconfirm>
              </Space>
            );
          }}
          dataSource={classRoomList}
          scroll={{ x: 1300 }}
          options={false}
          search={false}
          rowKey="index"

          // headerTitle="批量操作"
          // toolBarRender={() => [<Button key="show">查看日志</Button>]}
        />
      </ModalForm>
    </div>
  );
};
