import { EmailRegex } from '@/common/constants';
import { eventbus } from '@/common/eventbus';
import { Excel2Data } from '@/components';
import Editor from '@/components/RichText';
import { sendEmailGroup } from '@/services/operate/api';
import {
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Card, Col, Form, Modal, Row, Space, Tag, message } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

const { confirm } = Modal;

const formItemLayOut = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

type SendRes = {
  email: string;
  isOk: boolean;
};

type ContentType = 'html' | 'text';
type FormType = {
  title: string;
  emails: string;
  content: string;
  type: ContentType;
};

const OperateEmail = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState<ContentType>('text');
  const [sendRes, setSendRes] = useState<SendRes[]>([]);
  const [emailNum, setEmailNum] = useState<number>(0);

  eventbus.on('newSend', setSendRes);

  const onDownloadProgress = (progressEvent: any) => {
    const xhr = progressEvent.target;
    const { responseText }: { responseText: string } = xhr;
    try {
      const resArr = responseText.split('\n').map((row) => JSON.parse(row));
      console.log(resArr);
      eventbus.emit('newSend', [...resArr]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (values: FormType) => {
    setSendRes([]);
    setEmailNum(0);
    const { content, emails = '', title, type } = values;
    let clientName = '';
    try {
      const client = JSON.parse(localStorage.getItem('client') || '{}');
      clientName = client?.clientName;
    } catch (error) {
      console.log(error);
    }
    let _emails: string[] = [...new Set(emails.split(';'))];
    setEmailNum(_emails.length);
    sendEmailGroup(
      {
        clientName,
        emails: _emails,
        title,
        content,
        type,
      },
      onDownloadProgress,
    )
      .then((res) => {
        let { errcode = 200 } = res.data;
        if (errcode === 100) {
          message.error('邮件内容过长，请减小内容后重试');
          setSendRes([]);
          setEmailNum(0);
        }
        console.log('==>发送完毕', res);
      })
      .catch(() => {
        message.error('发送失败，请重试');
      });
    form.setFieldValue('emails', '');
    message.success('正在发送邮件');
  };

  const onSubmit = (values: any) => {
    const { emails } = values;
    let _email: string[] = emails.split(';');
    let notEmail = _email.findIndex((email) => !EmailRegex.test(email));
    if (notEmail > -1) {
      message.error('邮箱格式有误');
    } else {
      confirm({
        title: '您确定要发送邮件吗？',
        onOk() {
          handleSubmit(values);
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      eventbus.off('newSend', setSendRes);
    };
  }, []);

  return (
    <div className="email-send-container">
      <Card title="发送邮件" bordered={false} style={{ width: 800 }}>
        <ProForm<FormType>
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
          onFinish={async (values) => {
            onSubmit(values);
          }}
          submitter={{
            render: (props, doms) => {
              return (
                <Row style={{ marginTop: type === 'html' ? '50px' : '' }}>
                  <Col span={1} offset={3}>
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
            rules={[{ required: true, message: '请填写邮件标题' }]}
            width="lg"
            name="title"
            label="标题"
            placeholder={'请输入邮件标题'}
            allowClear
          />
          <ProFormTextArea
            fieldProps={{
              showCount: true,
              autoSize: { maxRows: 10, minRows: 6 }
            }}
            rules={[{ required: true, message: '邮箱不能为空' }]}
            width="lg"
            name="emails"
            label="邮箱"
            placeholder={'请输入邮箱并用英文;隔开'}
            allowClear
            addonAfter={
              <Excel2Data
                regex={EmailRegex}
                onChange={(e) => form.setFieldValue('emails', e.join(';'))}
              />
            }
          />
          <ProFormRadio.Group
            width="lg"
            name="type"
            required
            label="邮件类型"
            fieldProps={{
              value: type,
              onChange: (e) => setType(e.target.value),
            }}
            options={[
              { label: '文本', value: 'text' },
              { label: '富文本', value: 'html' },
            ]}
          ></ProFormRadio.Group>
          {type === 'html' && (
            <Col span={24}>
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
            </Col>
          )}
          {type === 'text' && (
            <ProFormTextArea
              fieldProps={{
                showCount: true,
                rows: 20,
                maxLength: 2000,
              }}
              rules={[{ required: true, message: '请输入邮件正文内容' }]}
              width="lg"
              name="content"
              label="正文内容"
              placeholder={'请输入邮件正文内容'}
              allowClear
            />
          )}
        </ProForm>
      </Card>

      {emailNum > 0 && (
        <Card
          title={`发送结果(${sendRes.length}/${emailNum})`}
          bordered={false}
          style={{ overflowY: 'scroll', width: 500 }}
        >
          <ProTable<SendRes>
            className="email-send-table"
            pagination={false}
            toolBarRender={false}
            search={false}
            dataSource={sendRes}
            columns={[
              {
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                search: false,
                render: (_: any, row: SendRes, index: number) => index + 1,
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                align: 'center',
                search: false,
              },
              {
                title: '发送结果',
                dataIndex: 'isOk',
                align: 'center',
                search: false,
                render: (isOk: any) =>
                  isOk ? (
                    <Tag color="#87d068">成功</Tag>
                  ) : (
                    <Tag color="#f50">失败</Tag>
                  ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default OperateEmail;
