import { SMS_template } from '@/common/constants';
import U from '@/common/U';
import { postSms } from '@/services/common';
import { fetchMemberList } from '@/services/course';
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
import { Button, Card, Checkbox, Form, message } from 'antd';
import { size } from 'lodash';
import { useEffect, useState } from 'react';
import '../../../style/Course/sendSms.less';
import { login } from "../../../services/ant-design-pro/api"


const SendSMS = (props) => {
  const { users, course } = props;
  const [form] = Form.useForm();

  const [phones, setPhones] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [students, setStudents] = useState([]);
  const [smsData, setSmsData] = useState({});

  const formItemLayOut = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const phonesChanges = () => {
    const selected = form.getFieldValue("phones");
    if (!selected) return;
    setCheckAll(selected.length === phones.length);
    setIndeterminate(selected.length > 0 && selected.length < phones.length)
  }

  const changeData = (field, value) => {
    smsData[field] = value;
    setSmsData({ ...smsData })
    console.log(smsData);
  }

  const onCheck = (e) => {
    form.setFieldValue("phones", (e.target.checked ? phones : []));
    changeData("phones", e.target.checked ? phones : [])
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
          name: name
        })
      }
    });
    setPhones(_student.map(({ value }) => value))
    setStudents(_student)
    // console.log(students);
    return _student;
  };

  const onSubmit = async (values) => {
    const { phones = [], notes, date, time } = values;
    const { title, roomId } = course;

    let smsInfo = {
      index: 0,
      name: "同学您好",
      notes: notes,
      phone: phones,
      date: date,
      title: "《" + title + "》",
    };
    try {
      const res = await postSms(smsInfo);
      setCheckAll(false);
      setIndeterminate(false);
      if (res.errcode === 200) {
        message.success('发送成功');
        return true;
      } else {
        message.error('发送失败,请重试');
        return false
      }
    } catch (error) {
      message.error("发送失败")
      console.log("发送错误", error);
      return false
    }
  };


  const onFormCancle = () => {
    setCheckAll(false)
    setIndeterminate(false);
    setSmsData({ phones: [] })
  }

  return (
    <ModalForm
      title="发送短信通知"
      width={1300}
      trigger={<Button type="primary" >短信通知</Button>}
      form={form}
      {...formItemLayOut}
      autoFocusFirstInput
      layout="horizontal"
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onFormCancle(),
      }}
      className="send-sms"
      submitTimeout={2000}
      onFinish={async (values) => {
        return onSubmit(values);
      }}
      onFieldsChange={(e) => {
        changeData(e[0].name[0], e[0].value)
      }}
    >
      <div className='preview'>
        <Card title="短信预览" style={{ width: "100%" }}>
          <p>
            {SMS_template[0].getContent("同学您好", `《${course ? course.title : ""}》`, smsData["date"], smsData.notes)}
          </p>
        </Card>
      </div>
      <div className='form'>
        <ProFormSelect
          request={async () => {
            return studentFilter(users);
          }}
          fieldProps={{
            mode: 'multiple',
            onChange: phonesChanges,
            maxTagCount: 10,
          }}
          rules={[
            { required: true, message: '请选择至少一名学生', type: 'array' },
          ]}
          width="lg"
          name="phones"
          label="联系人"
          placeholder={'请选择联系人'}
          allowClear
          addonAfter={<>
            <Checkbox onChange={onCheck} indeterminate={indeterminate} checked={checkAll}>全选</Checkbox>
            <span>{`${smsData.phones?.length || 0}/${students.length}`}</span>
          </>}
        />

        <ProFormText
          width="sm"
          name="date"
          label="上课日期"
          rules={[{ required: true, message: '请输入上课时间' }]}
        />

        <ProFormTextArea
          width="lg"
          name="notes"
          label="备注"
          rules={[{ required: true, message: '请输入备注内容' }]}
          fieldProps={{
            showCount: true,
            maxLength: 300,
            defaultValue: "上课链接："
          }}
          placeholder="请输入内容"
        />
      </div>


    </ModalForm>
  );
};

export default SendSMS;
