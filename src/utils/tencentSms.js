import { UConfig } from '@/common/UConfig';
import tencentcloud from 'tencentcloud-sdk-nodejs';

// 导入对应产品模块的client models。
const smsClient = tencentcloud.sms.v20210111.Client;

/* 实例化要请求产品(以sms为例)的client对象 */
const client = new smsClient({
  credential: {
    secretId: UConfig.sms.secretId,
    secretKey: UConfig.sms.secretKey,
  },
  region: 'ap-beijing',
  profile: {
    /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
    signMethod: 'HmacSHA256',
    httpProfile: {
      reqMethod: 'POST',
      reqTimeout: 30,
      endpoint: 'sms.tencentcloudapi.com',
    },
  },
});

/* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
 * 属性可能是基本类型，也可能引用了另一个数据结构
 * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */

/* 帮助链接：
 * 短信控制台: https://console.cloud.tencent.com/smsv2
 * 腾讯云短信小助手: https://cloud.tencent.com/document/product/382/3773#.E6.8A.80.E6.9C.AF.E4.BA.A4.E6.B5.81 */
const commonParams = {
  /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
  // 应用 ID 可前往 [短信控制台](https://console.cloud.tencent.com/smsv2/app-manage) 查看
  SmsSdkAppId: '1400590254',
  /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名 */
  // 签名信息可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-sign) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-sign) 的签名管理查看
  SignName: '毛豆课堂',
  /* 模板 ID: 必须填写已审核通过的模板 ID */
  // 模板 ID 可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-template) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-template) 的正文模板管理查看
  TemplateId: '1641392',
  /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
  TemplateParamSet: ['1234'],
  /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
   * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
  PhoneNumberSet: ['+8618639008827'],
  /* 用户的 session 内容（无需要可忽略）: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
  SessionContext: '',
  /* 短信码号扩展号（无需要可忽略）: 默认未开通，如需开通请联系 [腾讯云短信小助手] */
  ExtendCode: '',
  /* 国际/港澳台短信 senderid（无需要可忽略）: 国内短信填空，默认未开通，如需开通请联系 [腾讯云短信小助手] */
  SenderId: '',
};
// 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数

const sendSms = (params) => {
  let _params = { ...commonParams, params };
  client
    .SendSms(_params, function (err, response) {
      // 请求异常返回，打印异常信息
      if (err) {
        console.log(err);
        return;
      }
      // 请求正常返回，打印response对象
      console.log(response);
    })
    .then((res) => {
      console.log('发送成功');
      console.log({ ...res });
    });
};
// export const mySms = {
export const noticeSms = (params) => {
  let _params = {
    ...params,
    TemplateId: '1641392',
  };
  sendSms(params);
};
export const verCodeSms = (params) => {
  let _params = {
    ...params,
    TemplateId: '1647674',
  };
  sendSms(params);
};

/* 当出现以下错误码时，快速解决方案参考
 * [FailedOperation.SignatureIncorrectOrUnapproved](https://cloud.tencent.com/document/product/382/9558#.E7.9F.AD.E4.BF.A1.E5.8F.91.E9.80.81.E6.8F.90.E7.A4.BA.EF.BC.9Afailedoperation.signatureincorrectorunapproved-.E5.A6.82.E4.BD.95.E5.A4.84.E7.90.86.EF.BC.9F)
 * [FailedOperation.TemplateIncorrectOrUnapproved](https://cloud.tencent.com/document/product/382/9558#.E7.9F.AD.E4.BF.A1.E5.8F.91.E9.80.81.E6.8F.90.E7.A4.BA.EF.BC.9Afailedoperation.templateincorrectorunapproved-.E5.A6.82.E4.BD.95.E5.A4.84.E7.90.86.EF.BC.9F)
 * [UnauthorizedOperation.SmsSdkAppIdVerifyFail](https://cloud.tencent.com/document/product/382/9558#.E7.9F.AD.E4.BF.A1.E5.8F.91.E9.80.81.E6.8F.90.E7.A4.BA.EF.BC.9Aunauthorizedoperation.smssdkappidverifyfail-.E5.A6.82.E4.BD.95.E5.A4.84.E7.90.86.EF.BC.9F)
 * [UnsupportedOperation.ContainDomesticAndInternationalPhoneNumber](https://cloud.tencent.com/document/product/382/9558#.E7.9F.AD.E4.BF.A1.E5.8F.91.E9.80.81.E6.8F.90.E7.A4.BA.EF.BC.9Aunsupportedoperation.containdomesticandinternationalphonenumber-.E5.A6.82.E4.BD.95.E5.A4.84.E7.90.86.EF.BC.9F)
 * 更多错误，可咨询[腾讯云助手](https://tccc.qcloud.com/web/im/index.html#/chat?webAppId=8fa15978f85cb41f7e2ea36920cb3ae1&title=Sms)
 */
