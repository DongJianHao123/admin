import {
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormField,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useParams, useSearchParams } from '@umijs/max';
import { Button, Col, Form, Input, Progress, Row, Select, Space, Switch, Upload, message } from 'antd';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { fileUpload, fileUpload2, requiredRule } from '@/utils';
import { useRequest } from 'ahooks';
import {
  createClassroom,
  fetchClassroomInfo,
  updateClassroom,
} from '@/services/course';
import {
  CloseOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  LinkOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { eventbus } from '@/common/eventbus';

const VideoTypes = {
  UPLOAD: 1,
  INPUT: 2,
}

const ClassroomEdit = () => {
  const params = useParams();
  const { classroomId, courseId } = params;
  const isAdd = classroomId === '0' || !classroomId;
  const [video, setVideo] = useState({});
  const [videoType, setVideoType] = useState(VideoTypes.UPLOAD)
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { data = {}, run } = useRequest(fetchClassroomInfo, { manual: true });
  const [searchParams] = useSearchParams();

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

  let observable;
  const handleVideoUpload = (file, field) => {
    setVideo({ percent: 0, _status: 'active', url: '' });
    setLoading(true);
    observable = fileUpload2(file);
    const subscribe = observable.subscribe({
      error: (err) => {
        console.log(err);
      },
      complete: (res) => {
        setVideo({
          ...video,
          percent: 100,
          _status: 'success',
          url: `https://ssl.cdn.maodouketang.com/${res.key}`,
        });
        setLoading(false)
        message.success('上传成功');
      },
      next: (res) => {
        let progress = res.total.percent.toFixed(0);
        setVideo({ ...video, url: '', percent: progress, _status: 'active' });
      },
    });
    eventbus.on('unsubscribe', () => subscribe.unsubscribe());
  };

  const handleSubmit = async (values) => {
    const { coverUrl } = values;
    if (loading) {
      message.warn('请等待上传完成')
      return
    }
    (isAdd
      ? createClassroom({
        courseId: searchParams.get('courseId'),
        roomId: searchParams.get('roomId'),
        ...values,
        coverUrl: coverUrl ? coverUrl[0].url : "",
        choseUrl: video.url,
      })
      : updateClassroom({
        ...values,
        coverUrl: coverUrl ? coverUrl[0].url : "",
        choseUrl: video.url,
      })
    ).then((res) => {
      message.success(`${isAdd ? '新增' : '编辑'}课堂成功`);
      history.back();
    });
  };

  const handleCancelUpload = () => {
    if (!!video.url) {
      setLoading(false);
      setVideo({});
    } else {
      eventbus.emit('unsubscribe');
      setVideo({
        ...video,
        _status: 'cancel',
        url: '-',
      });
    }
  };
  const updateVideo = (e) => {
    if (loading && video._status === 'active') {
      message.warn('正在上传');
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  const handleChangeValueType = () => {
    loading && !video.url && handleCancelUpload();
    setLoading(false);
    setVideoType(videoType === VideoTypes.UPLOAD ? VideoTypes.INPUT : VideoTypes.UPLOAD)
  }

  useEffect(() => {
    if (!isAdd)
      fetchClassroomInfo(classroomId).then((res) => {
        form.setFieldsValue(res);
        setVideo({ ...video, url: res.choseUrl });
      });
  }, [classroomId]);

  useEffect(() => {
    form.setFieldValue('courseId', courseId);
  }, [courseId]);

  useEffect(() => {
    return () => {
      eventbus.emit('unsubscribe');
    };
  }, []);

  return (
    <PageContainer
      header={{
        title: `${isAdd ? '新建' : '编辑'}课堂`,
        onBack: () => history.back(),
      }}
      style={{ paddingBottom: '100px' }}
      content={`课程号：${courseId}`}
    >
      <ProForm
        form={form}
        // grid
        onFinish={handleSubmit}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        submitter={{
          render: (props, doms) => {
            return (
              <Row>
                <Col span={14} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            );
          },
        }}
        onReset={(e) => {
          setLoading(false);
          setVideo({});
        }}
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
          colProps={{ md: 24, xl: 12 }}
          action={(file) => handleImgUpload(file, 'coverUrl')}
          extra="建议图片比例为16:9"
        />
        <ProFormField
          name="choseUrl"
          label="课程视频"
          colProps={{ md: 24, xl: 12 }}
        ><>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {videoType === VideoTypes.UPLOAD && <Upload
                maxCount={1}
                fileList={[]}
                action={(e) => handleVideoUpload(e, 'choseUrl')}
              >
                <Button onClick={updateVideo} icon={<UploadOutlined />}>
                  上传
                </Button>
              </Upload>
              }
              {videoType === VideoTypes.INPUT && <><Input value={video.url} onChange={(e) => { setVideo({ ...video, url: e.target.value }) }} placeholder='请输入视频链接' /></>}
              <Button type='link' onClick={handleChangeValueType}>
                {videoType === VideoTypes.UPLOAD ? '填写视频链接' : '上传视频'}
              </Button>
            </div>
            {loading && (
              <div
                style={{ display: 'flex', alignItems: 'center', width: '360px' }}
              >
                <Progress percent={video.percent} status={video._status} />
                <a
                  style={{ width: '80px', marginLeft: '10px' }}
                  onClick={handleCancelUpload}
                >
                  {!!video.url ? (
                    <>
                      <DeleteOutlined style={{ marginRight: '3px' }} />
                      清空
                    </>
                  ) : (
                    <>
                      <DisconnectOutlined style={{ marginRight: '3px' }} /> 取消
                    </>
                  )}
                </a>
              </div>
            )}
            {!video.url && video._status === 'active' && <span>正在上传</span>}
            {!!video.url && video.url !== '-' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '400px',
                  gap: '30px',
                  marginTop: '10px',
                }}
              >
                <a
                  href={video.url}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkOutlined style={{ marginRight: '10px' }} />
                  {video.url}
                </a>
                {!loading && (
                  <a
                    style={{ width: '150px' }}
                    onClick={() => {
                      setLoading(false);
                      setVideo({});
                      console.log(video);
                    }}
                  >
                    <DeleteOutlined style={{ marginRight: '3px' }} />
                    清空
                  </a>
                )}
              </div>
            )}
          </>
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
      </ProForm>
    </PageContainer>
  );
};

export default ClassroomEdit;
