import { eventbus } from '@/common/eventbus';
import U from '@/common/U';
import { createClassroom } from '@/services/course';
import { fileUpload } from '@/utils';
import {
  CheckCircleOutlined,
  EditOutlined,
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
  Modal,
  notification,
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
      align: 'center',
      render: (txt, item, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: '课堂名称',
      width: 120,
      align: 'center',
      dataIndex: 'className',
      editable: true,
      render: (txt, item, index) => {
        return (
          <Input
            onBlur={() => console.log('失去焦点')}
            required
            onChange={(e) => {
              modClassRoomList('className', e.target.value, index);
              console.log(e);
            }}
            value={txt}
            style={{ border: 'none' }}
            suffix={<EditOutlined />}
          />
        );
      },
    },
    {
      title: '时长',
      width: 60,
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
          <span style={{ color: 'grey' }}>
            <PlaySquareOutlined type="primary" style={{ fontSize: '28px' }} />
          </span>
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
        return (
          <a
            key="link"
            onClick={
              videoUrl !== '-'
                ? () => {
                    copy(videoUrl);
                    message.success('已复制到剪贴板');
                  }
                : () => message.warn('该视频还未上传完成')
            }
          >
            复制链接
          </a>
        );
      },
    },
  ];

  let [classRoomList, setClassRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  let [uploadIndex, setUploadIndex] = useState(0);
  let [uploadProgress, setUploadProgress] = useState('0');
  let [uploadedItem, setUploadedItem] = useState({});
  let [summary, setSummary] = useState({ success: 0, err: 0 });
  let [isUploading, setIsUploading] = useState(false);
  const [searchParams] = useSearchParams();
  // useEffect(() => setClassRoomList(classRoomList), [classRoomList]);

  const modClassRoomList = (filed, value, index) => {
    classRoomList[index][filed] = value;
    setClassRoomList([...classRoomList]);
  };

  const btnClick = (id) => {
    console.log(isUploading);
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

  /**
   *
   * @param {Array<Number>} selectedRowKeys
   */
  const handleTableDelete = (selectedRowKeys) => {
    console.log(selectedRowKeys);
    //获得删除的文件中比当前正在上传的文件的数量
    let beforeIndexUploading = selectedRowKeys.filter(
      (item) => item < uploadIndex,
    ).length;
    if (selectedRowKeys.includes(uploadIndex)) {
      setIsUploading(false);
      console.log('捕获到删除正在上传的文件');
      stopUpload();
      startUpload(uploadIndex);
    }
    console.log('需要减去' + beforeIndexUploading);
    setUploadIndex(uploadIndex - beforeIndexUploading);

    // eslint-disable-next-line array-callback-return

    let _classRoomList = classRoomList.filter(
      (item, index) => !selectedRowKeys.includes(index),
    );
    setClassRoomList(_classRoomList);
    message.success(`成功删除${selectedRowKeys.length}条数据`);
  };

  const progressCallback = (progress) => {
    setUploadProgress(progress);
    console.log(progress);
  };

  const handleUploadAction = (e) => {
    console.log(e);
    let { name, size, type } = e;
    if (classRoomList.length < 10) {
      classRoomList.push({
        className: name.substring(0, name.lastIndexOf('.')),
        clientId: '',
        size,
        type,
        status: '0',
        video: e,
        videoUrl: '',
        progress: '0',
        uploadStatus: 0, //0代表未上传，1代表正在上传，2代表上传完成,3代表上传失败
      });
      setClassRoomList([...classRoomList]);
      console.log(classRoomList);
    }
  };

  //开始上传
  const startUpload = (index) => {
    console.log('开始上传');
    console.log(classRoomList);
    setIsUploading(true);
    if (classRoomList[index]) {
      //判断视频上传的状态
      if (classRoomList[index].uploadStatus < 2) {
        //修改正在上传文件的索引
        setUploadIndex(index);
        //状态设为正在上传
        classRoomList[index].uploadStatus = 1;
        setClassRoomList([...classRoomList]);
        fileUpload(classRoomList[index].video, progressCallback)
          .then((res) => {
            console.log(`第${index + 1}个文件上传成功`);
            console.log(res);
            setUploadedItem({
              videoUrl: `https://ssl.cdn.maodouketang.com/${res.key}`,
              uploadStatus: 2,
            });
            setIsUploading(false);
            btnClick('start-upload');
            console.log(classRoomList);
          })
          .catch((err) => {
            console.log('上传失败');
            classRoomList[index].uploadStatus = 3;
            setClassRoomList([...classRoomList]);
            btnClick('start-upload');
            console.log(err);
          });
      } else {
        startUpload(index + 1);
      }
    } else {
      message.success('上传任务执行完毕');
      setIsUploading(false);
    }
  };

  //导入课堂
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
            reloadData();
            clearList();
            setLoading(false);
            return true;
          }
        });
      });

      return true;
    }
  };

  useEffect(() => {
    if (classRoomList.length > 0 && classRoomList[uploadIndex]) {
      classRoomList[uploadIndex].progress = uploadProgress;
      setClassRoomList([...classRoomList]);
    }
  }, [uploadProgress]);

  useEffect(() => {
    if (classRoomList.length > 0) {
      classRoomList[uploadIndex] = {
        ...classRoomList[uploadIndex],
        ...uploadedItem,
      };
      setClassRoomList([...classRoomList]);
    }
  }, [uploadedItem]);

  useEffect(() => {
    summary.success = classRoomList.filter(
      (item) => item.uploadStatus === 2,
    ).length;
    summary.err = classRoomList.filter(
      (item) => item.uploadStatus === 3,
    ).length;
    setSummary({ ...summary });
  }, [classRoomList.length, uploadedItem]);

  const clearList = () => setClassRoomList([]);

  const stopUpload = () => eventbus.emit('stop-upload');

  return (
    <div className="batch-import-modal">
      <Upload
        name="file"
        multiple
        action={handleUploadAction}
        className="upload"
        accept="video/*"
      >
        <Button id="upload-btn">点击上传</Button>
      </Upload>
      <ModalForm
        title={
          <div>
            <span> 批量导入</span>
            <Button
              style={{ marginLeft: '20px', borderRadius: '4px' }}
              type="primary"
              onClick={() => btnClick('upload-btn')}
            >
              选择视频
            </Button>
            {classRoomList.length > 0 && (
              <Button
                id="start-upload"
                style={{ marginLeft: '20px', borderRadius: '4px' }}
                type="primary"
                onClick={() => !isUploading && startUpload(0)}
              >
                开始上传
              </Button>
            )}
            {/* <Button
              style={{ marginLeft: '20px', borderRadius: '4px' }}
              type="primary"
              onClick={() => stopUpload()}
            >
              停止上传
            </Button> */}
          </div>
        }
        trigger={
          <Button onClick={() => btnClick('upload-btn')}>批量导入</Button>
        }
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setLoading(false);
            if (classRoomList.length > 0) {
              Modal.confirm({
                title: `是否清空导入数据?`,
                onOk: () => {
                  stopUpload();
                  clearList();
                },
              });
            }
          },
          cancelText: '取消',
          okText: '确认导入',
        }}
        can
        onFinish={() => {
          return handleTableSubmit();
        }}
        width={1500}
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
                  上传成功： {summary.success}
                </span>
                <span style={{ color: 'red', marginInlineStart: 8 }}>
                  上传失败： {summary.err}
                </span>
                <span style={{ marginInlineStart: 10 }}>
                  每次只能导入10个文件
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
                  onConfirm={() => {
                    selectedRowKeys.length > 0 &&
                      handleTableDelete(selectedRowKeys);
                    onCleanSelected();
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button danger>删除</Button>
                </Popconfirm>
              </Space>
            );
          }}
          dataSource={classRoomList}
          scroll={{ x: 1300 }}
          options={false}
          search={false}
          rowKey={(item, index) => index}
          pagination={false}

          // headerTitle="批量操作"
          // toolBarRender={() => [<Button key="show">查看日志</Button>]}
        />
      </ModalForm>
    </div>
  );
};
