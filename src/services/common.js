
import { request } from '@umijs/max';
import axios from 'axios';

export async function postSms(smsInfo) {
    let res = await axios(
      `http://101.201.249.16:4000/api/v1/msms/inform`,{
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ ...smsInfo }),
      }
    );
    console.log("请求结果", res);
    return res.data;
  }