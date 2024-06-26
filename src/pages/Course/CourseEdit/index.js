import U from '@/common/U';
import ChatgptDrawer from '@/components/ChatgptDrawer';
import Editor from '@/components/RichText';
import { getChatGptProcess } from '@/services/common';
import {
  createCourse,
  fetchAllCourse,
  fetchCourseInfo,
  updateCourse,
} from '@/services/course';
import { fileUpload, requiredRule } from '@/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormField,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest, useParams } from '@umijs/max';
import {
  Button,
  Col,
  Drawer,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  message,
} from 'antd';
import { isEmpty, isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CourseEdit = () => {
  const { courseId } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [chatgptOpen, setChatgptOpen] = useState(false);
  const [title, setTitle] = useState('');

  const [htmlValue, setHtmlValue] = useState('');

  const isAdd = courseId === '0' || !courseId;

  const handleParams = (e) => {
    setHtmlValue(e);
  };

  const handleImgUpload = (file) => {
    fileUpload(file).then((res) => {
      form.setFieldsValue({
        coverUrl: [
          Object.assign(file, {
            url: `https://ssl.cdn.maodouketang.com/${res.key}`,
          }),
        ],
      });
    });
  };

  const { run: runFac } = useRequest(fetchAllCourse, {
    manual: true,
  });

  const { run: runFci } = useRequest(fetchCourseInfo, {
    manual: true,
  });

  const handleSubmit = async (values) => {
    const {
      coverUrl: [file],
    } = values;
    const data = {
      ...values,
      coverUrl: file.url,
      courseIndex: values.courseIndex.toString()
    };
    return (isAdd ? createCourse(data) : updateCourse(data)).then(() => {
      message.success(`${isAdd ? '添加' : '修改'}成功`);
      history.back();
    });
  };

  const openChatgpt = () => {
    const title = form.getFieldValue('title');
    if (U.str.isEmpty(title)) {
      message.warn('请先输入课程名称');
    } else {
      setChatgptOpen(true);
    }
  };

  const copyCourse = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确定要拷贝本课程吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        runFac().then((courseAmount) => {
          const data = form.getFieldsValue();
          delete data.id;
          data.coverUrl = data.coverUrl[0].url
          data.courseId = 100 + +courseAmount + 1
          console.log(data);
          createCourse(data).then(() => {
            message.success(`拷贝成功`);
            history.back();
          })
        }
        );
      }
    });


  }

  useEffect(() => {
    if (isAdd) {
      runFac().then((courseAmount) =>
        form.setFieldsValue({ courseId: 100 + +courseAmount + 1, showqr: 3, gradeLevel: 0 }),
      );
    } else {
      runFci(courseId).then(form.setFieldsValue);
    }
  }, [courseId]);

  useEffect(() => {
    chatgptOpen && setTitle(form.getFieldValue('title'));
  }, [chatgptOpen]);

  return (
    <PageContainer
      header={{
        title: `${isAdd ? '新建' : '编辑'}课程`,
        onBack: () => history.back(),
      }}
      style={{ paddingBottom: '100px' }}
    >
      <ProForm
        form={form}
        grid
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        initialValues={{
          web_site_name: 'all',
        }}
        onFinish={handleSubmit}
        submitter={{
          render: (props, doms) => {
            return (
              <Row style={{ marginTop: '90px' }}>
                <Col span={14} offset={4}>
                  <Space>
                    {doms}
                  </Space>
                </Col>
                {!isAdd && <Button type='primary' onClick={copyCourse}>拷贝课程</Button>}
              </Row>
            );
          },
        }}
      >
        <ProFormText
          name="title"
          label="课程名称"
          colProps={{ md: 24, xl: 24 }}
          required
          placeholder="请输入"
          rules={requiredRule}
        />
        <ProFormText
          name="summary"
          label="一句话简介"
          colProps={{ md: 24, xl: 24 }}
          required
          placeholder="请输入"
          rules={requiredRule}
        />
        <ProFormGroup>
          <ProFormSelect
            label="课程类型"
            name="type"
            labelCol={{ span: 12 }}
            colProps={{ md: 24, xl: 8 }}
            required
            placeholder="请选择"
            rules={requiredRule}
            request={async () => [
              {
                value: 3,
                label: '小班课(15人以下)',
              },
              {
                value: 6,
                label: '大班课(16人以上)',
              },
            ]}
          />
          <ProFormSelect
            label="热门/非热门"
            name="tag"
            labelCol={{ span: 12 }}
            colProps={{ md: 24, xl: 8 }}
            required
            placeholder="请选择"
            rules={requiredRule}
            request={async () => [
              {
                value: 'hot',
                label: '热门',
              },
              {
                value: 'notHot',
                label: '非热门',
              },
            ]}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormText
            name="teacher"
            label="任课教师"
            labelCol={{ span: 16 }}
            colProps={{ md: 24, xl: 6 }}
            placeholder="请输入"
          />
          <ProFormSelect
            name="gradeLevel"
            label="页面样式"
            labelCol={{ span: 8 }}
            colProps={{ md: 24, xl: 6 }}
            placeholder="请选择"
            required
            request={async () => [
              {
                value: 1,
                label: '新课程页',
              },
              {
                value: 0,
                label: '普通课程页',
              },
            ]}
          />

        </ProFormGroup>
        <ProFormSelect
          name="showqr"
          label="进入教室和观看回放的权限"
          labelCol={{ span: 12 }}
          colProps={{ md: 24, xl: 8 }}
          rules={requiredRule}
          options={[
            {
              value: 0,
              label: '无权限',
            },
            {
              value: 1,
              label: '只能进入教室',
            },
            {
              value: 2,
              label: '只能观看回放',
            },
            {
              value: 3,
              label: '所有权限',
            },
          ]}
        />
        {/* <ProFormTextArea
          name='info'
          label='广告位'
        /> */}
        <ProFormGroup>
          <ProFormDigit
            name="courseIndex"
            label="排序"
            labelCol={{ span: 16 }}
            colProps={{ md: 24, xl: 6 }}
            required
            placeholder="请输入"
            rules={requiredRule}
          />
          <ProFormDigit
            name="oldPrice"
            label="原价"
            labelCol={{ span: 8 }}
            colProps={{ md: 24, xl: 6 }}
            required
            placeholder="请输入"
            rules={requiredRule}
          />
          <ProFormDigit
            name="price"
            label="现价"
            labelCol={{ span: 4 }}
            colProps={{ md: 24, xl: 6 }}
            required
            placeholder="请输入"
            rules={requiredRule}
          />
        </ProFormGroup>
        <ProFormUploadButton
          name="coverUrl"
          label="课程图片"
          max={1}
          required
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
          }}
          rules={requiredRule}
          action={handleImgUpload}
          extra="建议图片比例为16:9"
          accept="image/*"
        />
        <ProFormField
          label="帮助"
          labelCol={{ span: 6 }}
          colProps={{ md: 12, xl: 16 }}
        >
          <Button ghost onClick={() => openChatgpt()} type="primary">
            生成课程介绍
          </Button>
        </ProFormField>
        <Col span={24}>
          <Form.Item
            label="课程介绍"
            name="introduction"
            required
            rules={[
              {
                validator: (_, val) => {
                  if (isEmpty(val.replace('<p><br></p>', ''))) {
                    return Promise.reject(new Error('请填写此项'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Editor height={600} />
          </Form.Item>
        </Col>
        <Form.Item name="courseId" noStyle />
        <Form.Item name="id" noStyle />
      </ProForm>
      <ChatgptDrawer
        open={chatgptOpen}
        handleClose={() => setChatgptOpen(false)}
        prompt={`《${title}》的课程大纲`}
      />
    </PageContainer>
  );
};

export default CourseEdit;
