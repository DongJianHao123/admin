import { request } from '@umijs/max';
import axios from 'axios';

/** Returns pet inventories by status Returns a map of status codes to quantities GET /store/inventory */
export async function sendEmails(body: Api.EmailParams) {
  return request<any>('/base/api/email/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    data: body,
  });
}
// const BASE_URL = 'http://localhost:4000';
const BASE_URL = 'http://101.200.208.215:4000';

export async function sendEmailGroup(data: Api.GroupEmailParams, onDownloadProgress: (progressEvent: any) => void) {
  return axios.post(BASE_URL + `/api/v1/email/send_email_group`, data, { onDownloadProgress })
}

export async function postSms(smsInfo: any) {
  let res = await axios(BASE_URL + `/api/v1/msms/inform`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ ...smsInfo }),
  });
  console.log('请求结果', res);
  return res.data;
}

export async function getSignature(clientId: string) {
  let res = await axios.get(BASE_URL + `/api/v1/msms/get_signature/?clientId=${clientId}`);
  if (res.data.errcode === 200) {
    return res.data.data;
  } else {
    return '';
  }
}
