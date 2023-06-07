import U from '@/common/U';
import { fetchMemberList } from '@/services/course';
// import { noticeSms } from '@/utils/tencentSms';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import { Button, Checkbox, Form, message } from 'antd';
import { size } from 'lodash';
import { useEffect, useState } from 'react';
import '../../../style/Course/sendSms.less';


const SendSMS = (props) => {
  const { users, course } = props;
  const [form] = Form.useForm();

  const [students, setStudents] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  // const [students, setStudents] = useState(users);
  const formItemLayOut = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const phonesChanges = (values) => {
    const selected = form.getFieldValue("phones");
    if (!selected) return;
    setCheckAll(selected.length === students.length);
    setIndeterminate(selected.length > 0 && selected.length < students.length)
  }

  const onCheck = (e) => {
    form.setFieldValue("phones", (e.target.checked ? students : []));
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  const studentFilter = (items) => {
    let _student = [];

    items.forEach((item) => {
      let { id, name, phone } = item;
      if (_student.findIndex((item) => item.value.phone === phone) < 0) {
        _student.push({
          key: id,
          value: phone,
          label: name + '<' + phone + '>',
        })
      }
    });
    setStudents(_student.map(({ value }) => value))
    return _student;
  };

  const onSubmit = (values) => {
    const { phones = [], notes, date, time } = values;
    const { title, roomId } = course;

    let smsInfo = {
      index: 0,
      location: roomId,
      notes: notes,
      phone: phones,
      start_time: new Date(),
      title,
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

    // console.log(values);
    // phones.forEach((phone) => {
    // let student = users.find((item) => item.phone === phone);
    // let { name } = student;
    // let param_1 = '尊敬的' + name;
    // let param_2 = `《${title}》`;
    // let param_3 = date + ' ' + time;
    // let param_4 = notes;

    // let params = {
    //   PhoneNumberSet: ['+86' + phone],
    //   TemplateParamSet: [param_1, param_2, param_3, param_4],
    // };
    // console.log(params);
    // noticeSms(params);
    // });

  };
  // useEffect(()=>console.log(form.getFieldsValue()),[form.getFieldsValue()])
  return (
    <ModalForm
      title="发送短信通知"
      width={950}
      trigger={<Button type="primary" onClick={() => console.log(form)}>短信通知</Button>}
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

      <ProFormSelect
        request={async () => {
          return studentFilter(users);
        }}
        fieldProps={{
          mode: 'multiple',
          onChange: phonesChanges
        }}
        rules={[
          { required: true, message: '请选择至少一名学生', type: 'array' },
        ]}
        width="lg"
        name="phones"
        label="联系人"
        placeholder={'请选择联系人'}
        allowClear
        addonAfter={<Checkbox onChange={onCheck} indeterminate={indeterminate} checked={checkAll}>全选</Checkbox>}
      />
{/* 
      <ProFormDatePicker
        width="sm"
        name="date"
        label="上课日期"
        rules={[{ required: true, message: '请选择上课日期' }]}
      />
      <ProFormTimePicker
        width="sm"
        name="time"
        label="上课时间"
        rules={[{ required: true, message: '请输入上课时间' }]}
      /> */}
      <ProFormTextArea
        width="lg"
        name="notes"
        label="备注"
        rules={[{ required: true, message: '请输入备注内容' }]}
        fieldProps={{
          // defaultValue:,
          showCount: true,
          maxLength: 300,
        }}
        placeholder="请输入内容"
      />
    </ModalForm>
  );
};

export default SendSMS;