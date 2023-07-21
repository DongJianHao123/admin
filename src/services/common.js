import axios from 'axios';

const BASE_URL = "http://101.201.249.16:4000"

export async function postSms(smsInfo) {
  let res = await axios(
    BASE_URL + `/api/v1/msms/inform`, {
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

export async function getSignature(clientId) {
  let res = await axios.get(BASE_URL + `/api/v1/msms/get_signature/?clientId=${clientId}`);
  if (res.data.errcode === 200) {
    return res.data.data
  } else {
    return ""
  }
}
