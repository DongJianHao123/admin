import { fileUpload } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  DatePicker,
  Form,
  message,
  Space,
  Switch,
  Table,
  Upload,
} from 'antd';
import { useState } from 'react';

const { RangePicker } = DatePicker;
const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

const ProcessMap = {
  close: 'normal',
  running: 'active',
  online: 'success',
  error: 'exception',
};

const tableListDataSource = [];

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    callNumber: Math.floor(Math.random() * 2000),
    progress: Math.ceil(Math.random() * 100) + 1,
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    memo:
      i % 2 === 1
        ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴'
        : '简短备注文案',
  });
}
const index = 0;
const columns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'index',
    align: 'center',
    render: (txt, item, index) => {
      return <div>{index + 1}</div>;
    },
  },
  {
    title: '课堂名称',
    width: 120,
    align: 'center',
    dataIndex: 'name',
    render: (txt = '', item, index) => {
      let _txt = txt.replace('.mp4', '');
      return <div>{_txt}</div>;
    },
  },
  {
    title: '时长',
    width: 120,
    align: 'center',
    // dataIndex: 'callNumber',
    render: () => '未知',
  },
  {
    title: '大小',
    width: 120,
    align: 'center',
    dataIndex: 'size',
    // dataIndex: 'callNumber',
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
    render: (val, row) => (
      <Switch
        // onChange={(checked) => handleStatusChange(row, checked ? '1' : '0')}
        defaultChecked={val === '1'}
      />
    ),
  },
  {
    title: '预览',
    dataIndex: 'videoUrl',
    width: 60,
    align: 'center',
    render: (url) => {
      return <div>预览</div>;
    },
  },
  {
    title: '执行进度',
    dataIndex: 'progress',
    width: 150,
    align: 'center',
    valueType: (item) => ({
      type: 'progress',
      // status: ProcessMap['running'],
    }),
  },
  {
    title: ' ',
    width: 80,
    key: 'option',
    align: 'center',
    valueType: 'option',
    fixed: 'right',
    render: () => [<a key="link">复制链接</a>],
  },
];

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
let fileData = [];

const fileinputChange = (event) => {
  fileData = event.target.files;
  console.log(fileData);
  // 获取到的文件 fileData
  // if(fileData){
  //   this.setState({ fileData, })
  //   const formdata = new FormData();
  //   formdata.append("wordType",3);
  //   formdata.append("file",fileData);
  //   this.send(formdata)
  // }
};

export default (props) => {
  const [videos, setVideos] = useState([]);
  const [fileList, setFileList] = useState([]);
  let { handleStatusChange } = props;
  const btnClick = () => {
    let btn = document.getElementById('upload-btn');
    // console.log(btn);
    btn.click();
  };
  const handleUploadAction = (e) => {
    console.log(e);
    videos.push(e);
    setVideos(videos);
    let { name, size, type } = e;
    fileList.push({
      name,
      size,
      type,
      status: '0',
      videoUrl: '',
      progress: 20,
    });
    setFileList([...fileList]);
    console.log(fileList);
  };
  // { uid: 'rc-upload-1669827373266-4', name: '公告.mp4', lastModified: 1654328912363, lastModifiedDate: Sat Jun 04 2022 15: 48: 32 GMT + 0800(GMT + 08: 00), webkitRelativePath: '', … }
  return (
    <div>
      <Upload
        name="file"
        multiple
        action={handleUploadAction}
        className="upload"
      >
        <Button id="upload-btn">点击上传</Button>
      </Upload>
      <ModalForm
        title="批量导入"
        trigger={<Button onClick={btnClick}>批量导入</Button>}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          await waitTime(2000);
          console.log(values.name);
          message.success('提交成功');
          return true;
        }}
        width={1200}
      >
        <ProTable
          columns={columns}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            defaultSelectedRowKeys: [1],
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
              </span>
              {/* <span>{`容器数量: ${selectedRows.reduce(
                            (pre, item) => pre + item.containers,
                            0,
                        )} 个`}</span>
                        <span>{`调用量: ${selectedRows.reduce(
                            (pre, item) => pre + item.callNumber,
                            0,
                        )} 次`}</span> */}
            </Space>
          )}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a>一键上架</a>
                <a>一键下架</a>
                <a style={{ color: 'red' }}>删除</a>
              </Space>
            );
          }}
          dataSource={fileList}
          scroll={{ x: 1300 }}
          options={false}
          search={false}
          rowKey="key"
          // headerTitle="批量操作"
          // toolBarRender={() => [<Button key="show">查看日志</Button>]}
        />
      </ModalForm>
    </div>
  );
};
