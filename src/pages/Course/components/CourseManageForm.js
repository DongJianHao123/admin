import {
  createCourse,
  fetchAllCourse,
  fetchCourseInfo,
  updateCourse,
} from '@/services/course';
import { fileUpload, requiredRule } from '@/utils';
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Form } from 'antd';
import { isEmpty, isUndefined } from 'lodash';
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default ({ id, handleClose, tableReload, ...props }) => {
  const [form] = Form.useForm();
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

  const { data: courseInfo = {}, run: runFci } = useRequest(fetchCourseInfo, {
    manual: true,
  });

  const handleSubmit = async (values) => {
    const {
      coverUrl: [file],
    } = values;
    const data = {
      ...values,
      coverUrl: file.url,
    };
    return (isUndefined(id) ? createCourse(data) : updateCourse(data)).then(
      () => {
        tableReload();
        handleClose();
      },
    );
  };

  useEffect(() => {
    if (isUndefined(id)) {
      props.visible &&
        runFac().then((courseAmount) =>
          form.setFieldsValue({ courseId: 100 + +courseAmount + 1 }),
        );
    } else {
      runFci(id).then(form.setFieldsValue);
    }
  }, [id, props.visible]);

  return (
    <DrawerForm
      {...props}
      form={form}
      drawerProps={{
        maskClosable: false,
        onClose: handleClose,
        destroyOnClose: true,
      }}
      width="60%"
      title={isUndefined(id) ? '创建课程' : '编辑课程'}
      grid
      initialValues={{
        web_site_name: 'all',
      }}
      values={courseInfo}
      onFinish={handleSubmit}
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
      <ProFormSelect
        label="课程类型"
        name="type"
        colProps={{ md: 12, xl: 8 }}
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
        colProps={{ md: 12, xl: 8 }}
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
      <ProFormDigit
        name="courseIndex"
        label="排序"
        colProps={{ md: 12, xl: 8 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormDigit
        name="oldPrice"
        label="原价"
        colProps={{ md: 12, xl: 8 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormDigit
        name="price"
        label="现价"
        colProps={{ md: 12, xl: 8 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
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
          <ReactQuill theme="snow" style={{ height: 210 }} />
        </Form.Item>
      </Col>
      <Form.Item name="courseId" noStyle />
      <Form.Item name="id" noStyle />
    </DrawerForm>
  );
};
