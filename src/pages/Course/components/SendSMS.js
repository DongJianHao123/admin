import U from '@/common/U';
import { fetchMemberList } from '@/services/course';
// import { noticeSms } from '@/utils/tencentSms';
// import { mySms } from '@/utils/tencentSms';
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
import { Button, Form, message } from 'antd';
import { size } from 'lodash';
import { useEffect, useState } from 'react';
import '../../../style/Course/sendSms.less';

const formItemLayOut = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
export default (props) => {
  let { courseId, roomId, title } = props;
  const [form] = Form.useForm();

  const [students, setStudents] = useState([]);

  // const loadData = async () => {
  //   let allStudents = (await fetchMemberList({ courseId, size: 1000 })).data || [];
  //   let studentsSet = studentFilter(allStudents)
  //   setStudents(studentsSet)
  //   return studentsSet;
  // }
  // useEffect(()=>loadData(),)
  const studentFilter = (items) => {
    let _student = [];
    // eslint-disable-next-line array-callback-return
    items.map((item) => {
      let { id, name, phone } = item;
      console.log(_student);
      console.log(phone);
      if (_student.findIndex((item) => item.value.phone === phone) < 0) {
        _student.push({
          key: id,
          value: phone,
          label: name + '<' + phone + '>',
        });
        students.push(item);
      }
    });
    setStudents([...students]);
    // console.log(students);
    return _student;
  };

  const onSubmit = (values) => {
    let { phones = [], notes, date, time } = values;
    // console.log(values);
    phones.forEach((phone) => {
      let student = students.find((item) => item.phone === phone);
      let { name } = student;
      let param_1 = '尊敬的' + name;
      let param_2 = `《${title}》`;
      let param_3 = date + ' ' + time;
      let param_4 = notes;

      let params = {
        PhoneNumberSet: ['+86' + phone],
        TemplateParamSet: [param_1, param_2, param_3, param_4],
      };
      console.log(params);
      // noticeSms(params);
    });
    // let smsInfo = {
    //   index: 0,
    //   location: roomId,
    //   notes: values.notes,
    //   phone: values.phones,
    //   start_time: new Date(),
    //   title,
    // };
    // console.log(smsInfo);

    // fetch('https://api.maodouketang.com/api/v1/msms/inform', {
    //   method: 'posT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ ...smsInfo }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.errcode === 200) {
    //       console.log('send msms succeed.');
    //     } else {
    //       console.log('Failed to send msms:', res);
    //     }
    //   })
    //   .catch((err) => console.log('Failed to send msms:', err));
  };
  // useEffect(()=>console.log(form.getFieldsValue()),[form.getFieldsValue()])
  return (
    <ModalForm
      title="发送短信通知"
      trigger={<Button type="link">上课通知</Button>}
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
          let allStudents =
            (await fetchMemberList({ courseId, size: 1000 })).data || [];
          let studentsSet = studentFilter(allStudents);
          return studentsSet;
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

      <ProFormDatePicker
        width="sm"
        name="date"
        label="上课日期"
        rules={[{ required: true, message: '请选择上课日期' }]}
        // fieldProps={{
        //   onChange: (e) => console.log(form.getFieldValue("date").$d),
        // }
        // }
        // colProps={{ md: 12, xl: 8 }}
      />
      <ProFormTimePicker
        width="sm"
        name="time"
        label="上课时间"
        rules={[{ required: true, message: '请输入上课时间' }]}
        // fieldProps={{
        //   onChange: (e) => console.log(U.date.format(e._d, "HH:mm")),
        // }
        // }
        // colProps={{ md: 12, xl: 8 }}
      />
      <ProFormTextArea
        width="xl"
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
