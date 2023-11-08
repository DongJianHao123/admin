import { useEffect, useState } from 'react';
import { ProForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Form, message, Modal } from 'antd';
import Card from 'antd/lib/card/Card';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { getCourseList } from '@/services/classHourStatistics';
import { fetchMemberList } from '@/services/course';
import './index.less'

import { PhoneRegex, SMS_PARAMS, SMS_template } from '@/common/constants';
import { getSignature, postSms } from '@/services/operate/api';
import { Excel2Data } from '@/components';
const { confirm } = Modal;

const ALL_STUDENTS_SIZE = 3000;
const OperateSms = () => {
  const [form] = Form.useForm();
  const [phones, setPhones] = useState<Array<string>>([]);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [students, setStudents] = useState(new Map());
  const [smsData, setSmsData] = useState<any>({});
  const [signature, setSignature] = useState<string>("");
  const [template, setTemplate] = useState<any>();
  const [studentsLoading] = useState<boolean>(false)
  const [courses, setCourse] = useState<any[]>([])

  const formItemLayOut = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const getClient = () => {
    const _clientJson = localStorage.getItem("client");
    if (!_clientJson) return { clientId: "1" };
    const client = JSON.parse(_clientJson);
    return client
  }

  const phonesChanges = () => {
    const selected = form.getFieldValue("phones");
    if (!selected) return;
    setCheckAll(selected.length === phones.length);
    setIndeterminate(selected.length > 0 && selected.length < phones.length)
  }

  const clearPhones = () => {
    setCheckAll(false);
    setIndeterminate(false);
    form.setFieldValue("phones", [])
    form.setFieldValue("inputPhones", [])
    setSmsData({ ...smsData, phones: [], inputPhones: [] })
  }

  const changeData = (field: string, value: any) => {
    smsData[field] = value;
    setSmsData({ ...smsData })
    if (field === "template") {
      setTemplate(SMS_template.find((item) => item.value === value))
    }
  }

  const onCheck = (e: any) => {
    form.setFieldValue("phones", (e.target.checked ? phones : []));
    changeData("phones", e.target.checked ? phones : [])
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  const changeStudentsByCourseId = async (courseId?: string) => {
    let data = (await fetchMemberList({ size: ALL_STUDENTS_SIZE, courseId })).data || [];
    let _students: any[] = [];
    let _phones: string[] = []
    data.forEach(async (item: any) => {
      let { phone, name } = item;
      if (_students.findIndex((item) => item.includes(phone)) < 0) {
        _students.push([phone, `${name}<${phone}>`]);
        _phones.push(phone)
      }
    });
    clearPhones()
    setPhones([..._phones])
    setStudents(new Map([..._students]));
  }

  const onSendToChange = async (e: string) => {
    const label = `《${courses.find((item) => item.value === e)?.label}》`;
    form.setFieldValue('title', label);
    smsData["title"] = label;
    setSmsData({ ...smsData })
    await (e === "1" ? changeStudentsByCourseId() : changeStudentsByCourseId(e.slice(-3)))
  }

  const sendSms = async (values: any) => {
    let smsInfo = {
      templateId: template.value,
      signature: signature,
      data: template?.params.map((item: string) => values[item]),
      phones: values["phones"]
    };
    try {
      const res = await postSms(smsInfo);
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
  }


  const onSubmit = async (values: any) => {
    const { phones, inputPhones = '' } = values
    let _inputPhones: string[] = [];

    if (!!inputPhones && typeof inputPhones === 'string') {
      _inputPhones = inputPhones.split(';')
    }

    let _phones = [...phones, ..._inputPhones].filter(phone => PhoneRegex.test(phone))
    if (!_phones || _phones.length < 1) {
      message.warn('请选择联系人或者添加手机号')
    } else {
      confirm({
        title: '您确定要发送信息吗？',
        onOk() {
          sendSms({ ...values, phones: _phones });
          clearPhones()
        },
      })
    }
  };

  useEffect(() => {
    getSignature(getClient().clientId).then((res) => {
      setSignature(res)
    })
  }, [])

  const paramArr = [signature].concat(template?.params.map((item: string) => smsData[item]))

  return <div className='sms-container'>
    <div className='preview'>
      <Card title="预览">
        <p style={{ width: "200px" }}>
          {template ? template.getContent(paramArr) : "请选择一个短信模板"}
        </p>
      </Card>
    </div>
    <ProForm<{
      phones: string[];
    }>
      className="form"
      form={form}
      {...formItemLayOut}
      autoFocusFirstInput
      onFieldsChange={(e) => changeData(e[0].name[0], e[0].value)}
      onFinish={async (values) => { onSubmit(values) }}
    >
      <ProFormSelect
        request={async () => {
          const courseList: any[] = await getCourseList();
          setCourse([...courseList])
          courseList.unshift({ label: "全部", value: "1" })
          return courseList;
        }}
        fieldProps={{
          onChange: (e: string) => onSendToChange(e)
        }}
        rules={[
          { required: true, message: '请选择需要发送的课程' },
        ]}
        width="lg"
        name="sendTo"
        label="课程"
        placeholder={'请选择课程'}
      />
      <ProFormSelect
        request={async () => {
          return SMS_template;
        }}
        rules={[
          { required: true, message: '请选择一个短信模板' },
        ]}
        width="lg"
        name="template"
        label="短信模板"
        placeholder={'请选择短信模板'}
        allowClear
      />
      <ProFormSelect
        valueEnum={students}
        fieldProps={{
          mode: 'multiple',
          onChange: phonesChanges,
          maxTagCount: 10,
          loading: studentsLoading
        }}
        width="lg"
        name="phones"
        label="联系人"
        placeholder={'请选择联系人'}
        allowClear
        addonAfter={<>
          <Checkbox onChange={onCheck} indeterminate={indeterminate} checked={checkAll}>全选</Checkbox>
          <span>{`${smsData.phones?.length || 0}/${students.size}`}</span>
        </>}

      />
      <ProFormTextArea
        width="lg"
        name="inputPhones"
        label="添加手机号"
        placeholder={'手动输入手机号,用英文逗号隔开'}
        addonAfter={<Excel2Data regex={PhoneRegex} onChange={(e) => form.setFieldValue('inputPhones', e.join(';'))} />}
      />

      <ProForm.Group>
        {template?.params.map((param: string, index: number) => {
          if (param === SMS_PARAMS.NAME) {
            return <ProFormText
              key={index}
              width="lg"
              name="call"
              label="称呼"
              rules={[{ required: true, message: '请输入称呼' }]}
            />
          } else if (param === SMS_PARAMS.TITLE) {
            return <ProFormText
              key={index}
              width="lg"
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            />
          } else if (param === SMS_PARAMS.DATE) {
            return <ProFormText
              key={index}
              width="lg"
              name="date"
              label="日期"
              rules={[{ required: true, message: '请输入时间' }]}
            />
          } else if (param === SMS_PARAMS.ROLE) {
            return <ProFormText
              key={index}
              width="lg"
              name="role"
              label="角色"
              rules={[{ required: true, message: '请输入角色' }]}
            />
          }else if (param === SMS_PARAMS.CONTENT) {
            return <ProFormText
              key={index}
              width="lg"
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            />
          } else if (param === SMS_PARAMS.NOTE) {
            return <ProFormTextArea
              key={index}
              width="lg"
              name="note"
              label="备注"
              rules={[{ required: true, message: '请输入备注内容' }]}
              fieldProps={{
                showCount: true,
                maxLength: 300,
                defaultValue: "上课链接："
              }}
              placeholder="请输入内容"
            />
          } else {
            return <></>
          }
        })}
      </ProForm.Group>
    </ProForm>
  </div >
}
export default OperateSms
