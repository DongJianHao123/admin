import axios from 'axios';

export const getChatGptProcess = (
  prompt,
  parentMessageId,
  onDownloadProgress,
) => {
  axios({
    method: 'post',
    url: 'http://chatgpt4.maodouketang.com/api/chat-process',
    data: {
      prompt: prompt,
      options: {
        parentMessageId: parentMessageId,
      },
      systemMessage:
        '你现在是一个教育工作者，你需要辅助我管理好一个教育机构的后台，简化我们的工作',
      temperature: 0.8,
      top_p: 1,
    },
    onDownloadProgress: onDownloadProgress,
  }).then(() => {
    // console.log('接口请求完成', data);
  });
};

export const getHunyuanChat = (question, onDownloadProgress) => {
  return axios({
    method: "post",
    url: "http://101.200.208.215:8055/hunyuan/chat",
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      question
    },
    onDownloadProgress: onDownloadProgress,
  }).catch((err) => {
    throw err
  })
}
