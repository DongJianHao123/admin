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

export const getChatGptProcess = (prompt, parentMessageId, onDownloadProgress) => {
  axios({
    method: "post",
    url: "https://api.os2edu.cn/api/chat-process",
    data: {
      prompt: prompt,
      options: {
        parentMessageId: parentMessageId,
      },
      systemMessage: "你现在是一个教育工作者，你需要辅助我管理好一个教育机构的后台，简化我们的工作",
      temperature: 0.8,
      top_p: 1
    },
    onDownloadProgress: onDownloadProgress,
  }).then(() => {
    // console.log('接口请求完成', data);
  })
}
