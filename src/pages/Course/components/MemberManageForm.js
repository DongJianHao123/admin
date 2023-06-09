import { grade, roles, tags, verify_rules } from '@/common/constants';
import { addMember, fetchMemberInfo, updateMember } from '@/services/course';
import { requiredRule } from '@/utils';
import {
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useParams, useRequest, useSearchParams } from '@umijs/max';
import { Button, Form, message } from 'antd';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';


export default ({ id, handleClose, tableReload, ...props }) => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const { run } = useRequest(fetchMemberInfo, { manual: true });
  const [verify, setVerify] = useState("");

  const handleSubmit = async (values) => {
    return (isUndefined(id) ? addMember : updateMember)({
      ...values,
      verify: verify
    }).then(() => {
      message.success('保存成功');
      tableReload();
      handleClose();
    });
  };

  const onVerifyChage = () => {
    const verify_room = form.getFieldValue("verify_room");
    const verify_playback = form.getFieldValue("verify_playback");
    console.log("room", verify_room);
    console.log("playback", verify_playback);
    let _verify = "0"
    if (verify_room && !verify_playback) _verify = verify_rules.ONLY_ROOM;
    if (!verify_room && verify_playback) _verify = verify_rules.ONLY_PLAYBACK;
    if (verify_playback && verify_room) _verify = verify_rules.ALL_RIGNHT;
    setVerify(_verify)
    console.log(_verify);
  }

  useEffect(() => {
    if (isUndefined(id) || !props.visible) return;
    run(id).then((res) => {
      form.setFieldsValue(res);
      setVerify(res.verify);
    });

  }, [id, props.visible]);

  useEffect(() => {
    if (!verify) return;
    const isTrue = true;
    console.log("verify", verify);
    if (verify === verify_rules.NONE) {
      setFormVerifys(!isTrue, !isTrue)
    } else if (verify === verify_rules.ONLY_ROOM) {
      setFormVerifys(isTrue, !isTrue)
    } else if (verify === verify_rules.ONLY_PLAYBACK) {
      setFormVerifys(!isTrue, isTrue)
    } else if (verify === verify_rules.ALL_RIGNHT) {
      setFormVerifys(isTrue, isTrue)
    }
  }, [props.visible, verify]);

  const setFormVerifys = (room, playback) => {
    form.setFieldValue("verify_playback", playback);
    form.setFieldValue("verify_room", room);
  }

  return (
    <DrawerForm
      {...props}
      form={form}
      drawerProps={{
        maskClosable: false,
        onClose: handleClose,
        destroyOnClose: true,
      }}
      title={isUndefined(id) ? '添加成员' : '编辑成员'}
      grid
      onFinish={handleSubmit}
      initialValues={{
        courseId,
        uniCourseId: searchParams.get('uniCourseId'),
        clientId: '385',
      }}
    >
      <ProFormText
        name="name"
        label="昵称"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormText
        name="phone"
        label="手机号"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        rules={requiredRule}
      />
      <ProFormSelect
        name="status"
        label="角色"
        colProps={{ md: 24, xl: 12 }}
        required
        placeholder="请输入"
        rules={requiredRule}
        options={roles}
      />
      <ProFormRadio.Group
        name="gender"
        label="性别"
        colProps={{ md: 24, xl: 12 }}
        options={["男", "女"]}
      />
      <ProFormSelect
        label="年级"
        name="age"
        colProps={{ md: 24, xl: 12 }}
        placeholder="请选择"
        options={grade}
      />
      <ProFormSwitch
        name="verify_room"
        label="是否允许进入课堂"
        checkedChildren="允许"
        unCheckedChildren="不允许"
        fieldProps={{
          onChange: onVerifyChage
        }}
        colProps={{ md: 24, xl: 12 }}
      />
      <ProFormSelect
        label="备注"
        name="tag"
        colProps={{ md: 24, xl: 12 }}
        placeholder="请选择"
        options={tags}
      />
      <ProFormSwitch
        name="verify_playback"
        label="是否允许观看回放"
        checkedChildren="允许"
        unCheckedChildren="不允许"
        fieldProps={{
          onChange: onVerifyChage
        }}
        colProps={{ md: 24, xl: 12 }}
      />
      <Form.Item name="uniCourseId" noStyle />
      <Form.Item name="verify" noStyle />
      <Form.Item name="courseId" noStyle />
      <Form.Item name="clientId" noStyle />
      <Form.Item name="id" noStyle />
    </DrawerForm>
  );
};
