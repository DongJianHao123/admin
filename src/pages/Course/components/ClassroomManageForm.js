import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormField,
  ProFormItem,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest, useSearchParams } from '@umijs/max';
import { Button, Form, Progress, Upload, message } from 'antd';
import { isUndefined } from 'lodash';
import { createClassroom, fetchClassroomInfo, updateClassroom } from '@/services/course';
import { fileUpload, fileUpload2, requiredRule } from '@/utils';

const ClassroomManageForm = ({ id, course, handleClose, tableReload, ...props }) => {

  const [video, setVideo] = useState({});
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const { data = {}, run } = useRequest(fetchClassroomInfo, { manual: true });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isUndefined(id)) run(id).then((res) => {
      form.setFieldsValue(res)
      setVideo({ ...video, url: res.choseUrl })
    })
  }, [id]);

  const handleImgUpload = (file, field) => {
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

  const handleVideoUpload = (file, field) => {
    setVideo({ percent: 0, _status: "active" })
    setLoading(true)
    const observable = fileUpload2(file)
    observable.subscribe({
      error: (err) => { console.log(err) },
      complete: (res) => {
        setVideo({ ...video, percent: 100, _status: 'success', url: `https://ssl.cdn.maodouketang.com/${res.key}` })
        message.success("上传成功")
      },
      next: (res) => {
        let progress = res.total.percent.toFixed(0);
        setVideo({ ...video, percent: progress, _status: 'active' })
      },
    })
  }

  const handleSubmit = async (values) => {
    return (
      isUndefined(id)
        ? createClassroom({
          courseId: searchParams.get('courseId'),
          roomId: searchParams.get('roomId'),
          ...values,
          coverUrl: values.coverUrl[0].url,
          choseUrl: video.url
        })
        : updateClassroom({ ...values, coverUrl: values.coverUrl[0].url, choseUrl: video.url })
    ).then(() => {
      tableReload();
      handleClose();
    });
  };

  useEffect(() => {
    !props.visible && setLoading(false) && setVideo({})
  }, [props.visible])

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
      <ProFormText
        name="courseId"
        label="课程号"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormUploadButton
        name="coverUrl"
        label="封面图"
        max={1}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
        }}
        labelCol={{ span: 2 }}
        action={(file) => handleImgUpload(file, 'coverUrl')}
        extra="建议图片比例为16:9"
      />
      <ProFormField
        name='choseUrl'
        label='课程视频'
        required
        rules={requiredRule}
      >
        <Upload
          maxCount={1}
          fileList={[]}
          action={(e) => handleVideoUpload(e, "choseUrl")}
        >
          <Button icon={<UploadOutlined />}>上传</Button>
        </Upload>
        {loading && <Progress percent={video.percent} status={video._status} />}
        {!!video.url && (video._status === "active" ? <span>正在上传</span> : <a href={video.url} target='_blank' rel="noreferrer">{video.url}</a>)}
      </ProFormField>

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
        label="上课时间"
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
    </DrawerForm >
  );
};

export default ClassroomManageForm
