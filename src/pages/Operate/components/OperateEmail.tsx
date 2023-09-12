// import { sendEmails } from "@/services/operate/api"
import { eventbus } from "@/common/eventbus";
import Editor from "@/components/RichText";
import { sendEmailGroup } from "@/services/operate/api";
import { ImportOutlined } from "@ant-design/icons";
import { ProForm, ProFormRadio, ProFormText, ProFormTextArea, ProTable } from "@ant-design/pro-components";
import { Button, Card, Col, Form, Modal, Row, Space, Tag, Upload, message } from "antd"
import { RcFile } from "antd/lib/upload";
import { isEmpty } from "lodash";
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const { confirm } = Modal;

const formItemLayOut = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

type SendRes = {
  email: string
  isOk: boolean
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const OperateEmail = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState<'html' | 'text'>('text');
  const [sendRes, setSendRes] = useState<SendRes[]>([]);
  const [emailNum, setEmailNum] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const addRes = (res: SendRes) => setSendRes([...sendRes, res])

  eventbus.on("newSend", addRes)

  const onDownloadProgress = (progressEvent: any) => {
    const xhr = progressEvent.target
    const { responseText } = xhr
    const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
    let chunk = responseText
    if (lastIndex !== -1)
      chunk = responseText.substring(lastIndex)
    try {
      const res = JSON.parse(chunk);
      eventbus.emit("newSend", res)
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = (values: any) => {
    setSendRes([])
    setEmailNum(0)
    const { content, emails = "", title, type } = values
    let clientName = ""
    try {
      const client = JSON.parse(localStorage.getItem("client") || "{}")
      clientName = client?.clientName
    } catch (error) {
      console.log(error);
    }
    let _emails: string[] = emails.split(";")
    _emails = [...new Set(_emails)]
    setEmailNum(_emails.length)
    sendEmailGroup({
      clientName,
      emails: _emails,
      title,
      content,
      type,
      onDownloadProgress: onDownloadProgress
    }).then(() => {
      form.setFieldValue('emails', "")
      message.success("提交成功")
    }).catch(() => {
      message.error("提交时败，请重试")
    })
  }

  const fileReaderOnload = (e: ProgressEvent<FileReader>) => {
    const emails: string[] = [];
    let allRow: any[] = [];

    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    // eslint-disable-next-line guard-for-in
    for (let sheetName in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheetName)) {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        allRow = [...allRow, ...jsonData]
      }
    }
    allRow.forEach((row: any) => {
      row.forEach((content: any) => {
        if (emailRegex.test(content)) {
          emails.push(content);
        }
      });
    })
    console.log(emails);
    form.setFieldValue('emails', emails.join(";"))
    setLoading(false)
  }

  const handleFileUpload = async (event: RcFile) => {
    setLoading(true)
    const file = event;
    if (file) {
      const reader = new FileReader();
      reader.onload = fileReaderOnload
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false)
    }
    return ""
  }

  const onSubmit = (values: any) => {
    const { emails } = values;
    let _email: string[] = emails.split(";")
    let notEmail = _email.findIndex((email) => !emailRegex.test(email))
    if (notEmail > -1) {
      message.error("邮箱格式有误")
    } else {
      confirm({
        title: '您确定要发送邮件吗？',
        onOk() {
          handleSubmit(values)
        },
      })
    }
  }

  useEffect(() => {
    return () => {
      eventbus.off("newSend", addRes)
    }
  }, [])

  return <div className="email-send-container">
    <Card title="发送邮件" bordered={false} style={{ width: 800 }}>
      <ProForm
        form={form}
        className="form"
        {...formItemLayOut}
        autoFocusFirstInput
        grid
        layout="horizontal"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 14 }}
        initialValues={{
          web_site_name: 'all',
        }}
        onFinish={async (values) => { onSubmit(values) }}
        submitter={{
          render: (props, doms) => {
            return (
              <Row style={{ marginTop: type === 'html' ? '50px' : '' }}>
                <Col span={2} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            );
          },
        }}
      >
        <ProFormText
          fieldProps={{
            maxLength: 50,
            showCount: true,
          }}
          rules={[
            { required: true, message: '请填写邮件标题' },
          ]}
          width="lg"
          name="title"
          label="标题"
          placeholder={'请输入邮件标题'}
          allowClear
        />
        <ProFormTextArea
          fieldProps={{
            showCount: true,
          }}
          rules={[
            { required: true, message: '邮箱不能为空' },
          ]}
          width="lg"
          name="emails"
          label="邮箱"
          placeholder={'请输入邮箱并用英文;隔开'}
          allowClear
          addonAfter={<Upload
            name="file"
            action={handleFileUpload}
            className="upload"
            fileList={[]}
            accept=".xlsx"
          >
            <Button icon={<ImportOutlined />} type='primary' loading={loading} id="upload-btn">导入</Button>
          </Upload>}
        />
        <ProFormRadio.Group
          width="lg"
          name="type"
          required
          label="邮件类型"
          fieldProps={
            {
              value: type,
              onChange: (e) => setType(e.target.value)
            }
          }
          options={[
            { label: '文本', value: 'text' },
            { label: '富文本', value: 'html' }
          ]}
        >
        </ProFormRadio.Group>
        {type === 'html' && <Col span={24}>
          <Form.Item
            label="正文内容"
            name="content"
            required
            className="content"
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
            <Editor height={400} />
          </Form.Item>
        </Col>}
        {type === 'text' && <ProFormTextArea
          fieldProps={{
            showCount: true,
            rows: 20,
            maxLength: 2000
          }}
          rules={[
            { required: true, message: '请输入邮件正文内容' },
          ]}
          width="lg"
          name="content"
          label="正文内容"
          placeholder={'请输入邮件正文内容'}
          allowClear
        />}
      </ProForm>
    </Card>

    {emailNum > 0 && <Card title={`发送结果(${sendRes.length}/${emailNum})`} bordered={false} style={{ overflowY: 'scroll', width: 500 }} >
      <ProTable<SendRes>
        className='email-send-table'
        pagination={false}
        toolBarRender={false}
        search={false}
        dataSource={sendRes}
        columns={[{
          title: '序号',
          dataIndex: 'index',
          align: 'center',
          // width: 80,
          search: false,
          render: (_: any, row: SendRes, index: number) => index + 1
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          align: 'center',
          search: false,
          // width: ,
        },
        {
          title: '发送结果',
          dataIndex: 'isOk',
          align: 'center',
          // width: 80,
          search: false,
          render: (isOk: any) => isOk ? <Tag color="#87d068" >成功</Tag> : <Tag color="#f50">失败</Tag>
        }]}
      />
    </Card>}
  </div>
}

export default OperateEmail
