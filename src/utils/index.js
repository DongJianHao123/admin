import { eventbus } from '@/common/eventbus';
import { history as umiHistory } from '@umijs/max';
import { isObject, isString } from 'lodash';
import * as qiNiu from 'qiniu-js';
import { stringify } from 'querystring';
import { genUpToken } from './qiNiuTokenUtil';

/**
 * 表单必填规则配置项
 */
export const requiredRule = [{ required: true, message: '请填写此项' }];

/**
 * 为表格数据添加“序号”列
 */
export function addListIndex(list, params, key = 'index') {
  const { current = 1, pageSize = 20 } = params || {};
  return (
    list &&
    list.map?.((item, index) => ({
      ...item,
      [key]: (current - 1) * pageSize + index + 1,
    }))
  );
}

/**
 * 七牛云文件上传token生成
 */
export function getFileUploadToken(bucketName) {
  const policy = {
    scope: bucketName,
    deadline: Math.round(new Date().getTime() / 1000) + 3600,
  };

  return genUpToken(policy);
}

/**
 * 文件上传到七牛云
 */
export async function fileUpload(
  file,
  progressCallback,
  bucketName = 'maodouketang',
) {
  return new Promise((resolve, reject) => {
    const token = getFileUploadToken(bucketName);
    const config = {
      useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
      region: qiNiu.region.z3, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
    };

    const observable = qiNiu.upload(file, null, token, {}, config);
    const subscription = observable.subscribe({
      error: (err) => reject(err),
      complete: (res) => resolve(res),
      next: (res) => {
        let progress = res.total.percent.toFixed(0);
        progressCallback && progressCallback(progress);
        progress === '100' &&
          eventbus.removeListener('stop-upload', cancleUpload);
      },
    });
    //取消上传触发方法 'stop-upload'
    const cancleUpload = () => subscription.unsubscribe();
    eventbus.on('stop-upload', cancleUpload);
  });
}

/**
 * antd 框架分页参数转为api分页参数
 */
export function pageAntdToApi(params) {
  if (!params) return;
  const { pageSize, current, ...others } = params;
  const size = pageSize ? { size: pageSize } : {};
  const page = current ? { page: current - 1 } : {};
  return {
    params: {
      ...others,
      ...size,
      ...page,
    },
  };
}

export const history = {
  ...umiHistory,
  push: (to, state) => {
    !isString(to) && isObject(to?.search)
      ? umiHistory.push(
          {
            ...to,
            search: stringify(to.search),
          },
          state,
        )
      : umiHistory.push(to, state);
  },
};

export const secondsParse = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 3600) % 60;
  return [
    (hours && `${hours}时`) || '',
    (mins && `${mins}分`) || '',
    (secs && `${secs}秒`) || '',
  ].join('');
};

//节流
export const throttled = (fn, delay) => {
  let timer = null;
  let starttime = Date.now();
  return function () {
    let curTime = Date.now(); // 当前时间
    let remaining = delay - (curTime - starttime); // 从上一次到现在，还剩下多少多余时间
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(context, args);
      starttime = Date.now();
    } else {
      timer = setTimeout(fn, remaining);
    }
  };
};
