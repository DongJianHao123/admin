import {
  createClassroom,
  fetchClassroomInfo,
  updateClassroom,
} from '@/services/course';
import { requiredRule } from '@/utils';
import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest, useSearchParams } from '@umijs/max';
import { Form } from 'antd';
import { isUndefined } from 'lodash';
import { useEffect } from 'react';

export default ({ id, course, handleClose, tableReload, ...props }) => {
  const [form] = Form.useForm();
  const { data = {}, run } = useRequest(fetchClassroomInfo, { manual: true });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isUndefined(id)) run(id).then(form.setFieldsValue);
  }, [id]);

  const handleSubmit = async (values) => {
    return (
      isUndefined(id)
        ? createClassroom({
            courseId: searchParams.get('courseId'),
            roomId: searchParams.get('roomId'),
            ...values,
          })
        : updateClassroom(values)
    ).then(() => {
      tableReload();
      handleClose();
    });
  };

  return (
    <DrawerForm
      {...props}
      form={form}
      drawerProps={{
        maskClosable: false,
        onClose: handleClose,
        destroyOnClose: true,
      }}
      title={isUndefined(id) ? '创建课程' : '编辑课程'}
      grid
      initialValues={{
        type: 2,
      }}
      values={data}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="className"
        label="课堂名称"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormSelect
        name="type"
        label="课堂类型"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请选择"
        rules={requiredRule}
        request={async () => [
          { label: '互动直播课', value: 2 },
          { label: '视屏上传课', value: 1 },
        ]}
      />
      <ProFormText
        name="location"
        label="上课地点"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormDateTimePicker
        name="startAt"
        label="开课时间"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请选择"
        rules={requiredRule}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        colProps={{ md: 24, xl: 24 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <Form.Item name="id" noStyle />
    </DrawerForm>
  );
};
