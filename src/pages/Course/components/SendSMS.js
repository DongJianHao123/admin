import { fetchMemberList } from '@/services/course';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { size } from 'lodash';
import { useEffect } from 'react';
import '../../../style/Course/sendSms.less';

const formItemLayOut = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
export default (props) => {
  let { courseId, roomId, title } = props;
  const [form] = Form.useForm();
  const onSubmit = (params) => {
    let smsInfo = {
      index: 0,
      location: roomId,
      notes: params.notes,
      phone: params.phones,
      start_time: new Date(),
      title: title,
    };
    console.log(smsInfo);

    fetch('https://api.maodouketang.com/api/v1/msms/inform', {
      method: 'posT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...smsInfo }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errcode === 200) {
          console.log('send msms succeed.');
        } else {
          console.log('Failed to send msms:', res);
        }
      })
      .catch((err) => console.log('Failed to send msms:', err));
  };
  return (
    <ModalForm
      title="发送短信通知"
      trigger={<Button type="link">短信通知</Button>}
      form={form}
      {...formItemLayOut}
      autoFocusFirstInput
      layout="horizontal"
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      className="send-sms"
      submitTimeout={2000}
      onFinish={async (values) => {
        await onSubmit(values);
        message.success('提交成功');
        return true;
      }}
    >
      {/* <ProFormGroup> */}
      {/* <Button className='select-all'>全选</Button> */}
      <ProFormSelect
        request={async () => {
          let students = (await fetchMemberList({ size: 1000 })).data || [];
          let _student = [];
          // eslint-disable-next-line array-callback-return
          students.map((item) => {
            let { id, name, phone } = item;
            console.log(_student);
            console.log(phone);
            if (_student.findIndex((item) => item.value === phone) < 0) {
              _student.push({
                key: id,
                value: phone,
                label: name + '<' + phone + '>',
              });
            }
          });
          console.log(students);
          return _student;
        }}
        fieldProps={{
          mode: 'multiple',
          // onChange: (e) => console.log(e)
        }}
        rules={[
          { required: true, message: '请选择至少一名学生', type: 'array' },
        ]}
        width="xl"
        name="phones"
        label="联系人"
        placeholder={'请选择联系人'}
      />
      {/* </ProFormGroup> */}
      <ProFormTextArea
        width="xl"
        name="notes"
        label="短信内容"
        rules={[{ required: true, message: '请输入短信内容' }]}
        fieldProps={{
          showCount: true,
          maxLength: 100,
        }}
        placeholder="请输入内容"
      />
    </ModalForm>
  );
};
