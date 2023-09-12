import axios from 'axios';

export const getChatGptProcess = (
  prompt,
  parentMessageId,
  onDownloadProgress,
) => {
  axios({
    method: 'post',
    url: 'https://api.os2edu.cn/api/chat-process',
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
