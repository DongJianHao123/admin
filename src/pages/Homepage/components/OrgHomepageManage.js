import { fetchHomePageConf, updateHomePageConf } from '@/services/homepage';
import { fileUpload, requiredRule } from '@/utils';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';

export default () => {
  const [form] = Form.useForm();
  const handleImgUpload = (file, field) => {
    console.log(file);
    fileUpload(file).then((res) => {
      console.log(res);
      form.setFieldsValue({
        [field]: [
          Object.assign(file, {
            url: `https://ssl.cdn.maodouketang.com/${res.key}`,
          }),
        ],
      });
    });
  };

  return (
    <ProForm
      form={form}
      onFinish={(values) => {
        return updateHomePageConf({
          ...values,
          aboutUsImgUrl: values.aboutUsImgUrl[0].url,
          consultUrl: values.consultUrl[0].url,
          coverUrl: values.coverUrl[0].url,
        }).then(() => {
          message.success('保存成功');
        });
      }}
      request={fetchHomePageConf}
      labelCol={8}
      layout="horizontal"
      style={{ marginTop: 20 }}
      grid
    >
      <ProFormTextArea
        name="aboutUsInfo"
        label="机构介绍"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        labelCol={{ span: 4}}
        fieldProps={{ maxLength: 300, showCount: true, rows: 10}}
        rules={requiredRule}
      />
      <ProFormUploadButton
        name="aboutUsImgUrl"
        label="机构介绍图片"
        max={1}
        required
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        labelCol={{ span: 2 }}
        rules={requiredRule}
        action={(file) => handleImgUpload(file, 'aboutUsImgUrl')}
        extra="建议图片比例为16:9"
      />
      <ProFormUploadButton
        name="consultUrl"
        label="机构Logo"
        max={1}
        required
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        labelCol={{ span: 2 }}
        rules={requiredRule}
        action={(file) => handleImgUpload(file, 'consultUrl')}
        extra="建议图片比例为1:1"
      />
      <ProFormUploadButton
        name="coverUrl"
        label="封面图"
        max={1}
        required
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        labelCol={{ span: 2 }}
        rules={requiredRule}
        action={(file) => handleImgUpload(file, 'coverUrl')}
        extra="建议图片比例为16:9"
      />
      <ProFormText
        name="icpInfo"
        label="一句话简介"
        labelCol={{ span: 2 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <Form.Item name="id" noStyle />
    </ProForm>
  );
};
