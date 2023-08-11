import Base64 from 'base64-js';
import { Buffer } from 'buffer';
const U = {
  str: {
    rn2br: (str: string): string => {
      return str.replace(/(\r\n)|(\n)/g, '<br>');
    },
    isNull: (s: any): boolean => {
      return s === null || typeof s === 'undefined';
    },
    isEmpty: (s: any): boolean => {
      if (U.str.isNull(s)) {
        return true;
      }
      if (typeof s !== 'string') {
        return false;
      }
      return s.length === 0;
    },
    isNotEmpty: (s: string | null | undefined): boolean => {
      return !U.str.isEmpty(s);
    },
    trim: (x: string): string => {
      return x.replace(/^\s+|\s+$/gm, '');
    },
    isChinaMobile: (mobile: string = ''): boolean => {
      return mobile.length === 11;
    },
    passwordLengthValid: (password: string = ''): boolean => {
      return password.length <= 18 && password.length >= 6;
    },
    randomString: (len: number) => {
      const chars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const maxIndex = chars.length;
      let s = '';
      for (let i = 0; i < len; i++) {
        s += chars.charAt(Math.floor(Math.random() * maxIndex));
      }
      return s;
    },
  },

  obj: {
    isEmptyObj: (obj: object) => {
      return Object.keys(obj).length === 0;
    },
    RemoveNulls: (obj: object) => {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          if (element === null || element === "") {
            delete obj[key];
          }
        }
      }
      return obj;
    }
  },

  date: {
    remainingTime: (remainTime: number) => {
      let day: number = parseInt((remainTime / (24 * 3600 * 1000)).toString())

      let hour = parseInt(((remainTime % (24 * 3600 * 1000)) / 3600000).toString());

      let minute = parseInt(((remainTime % 3600000) / 60000).toString());

      let second = parseInt(((remainTime % 60000) / 1000).toString());

      let res = '';
      if (day > 0) {
        res = day + '天';
      } if (hour > 0) {
        res = res + (hour + '时')
      } if (minute > 0) {
        res = res + (minute + '分')
      }
      res = res + (second + '秒')
      return res;
    },
    format: (date: Date, _fmt: string): string | null => {
      if (!date || !_fmt) {
        return null;
      }

      let fmt = _fmt;

      const o: any = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(),
      };
      const week: any = {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d',
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length),
        );
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (RegExp.$1.length > 1
            ? RegExp.$1.length > 2
              ? '\u661f\u671f'
              : '\u5468'
            : '') + week[date.getDay() + ''],
        );
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length),
          );
        }
      }
      return fmt;
    },
  },
  htmlstr: {
    html2dom: (html: string) => {
      const dom = document.createElement('div');
      dom.innerHTML = html;
      return dom;
    },
  },

  url: {
    getDomainFromUrl: (url: string) => {
      const offset = url.indexOf('//');
      const offset2 = url.indexOf('/', offset + 2);
      if (offset2 === -1) {
        return url.substring(offset + 2);
      }
      return url.substring(offset + 2, offset2);
    },
  },
  base64: {
    getBlobBydataURI: (dataURI: string, type: string) => {
      const binary = atob((dataURI || '').split(',')[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type });
    },
    encode: (str: string) => {
      return Base64.fromByteArray(Buffer.from(str));
    },
  },
  array: {
    swap: (arr: any[], index1: number, index2: number) => {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },

    remove: (arr: any[], index: number) => {
      if (isNaN(index) || index > arr.length) {
        return [];
      }
      arr.splice(index, 1);
      return arr;
    },

    insert: (arr: any[], index: number, item: any) => {
      arr.splice(index, 0, item);
      return arr;
    },

    insertLast: (arr: any[], item: any) => {
      arr.splice(arr.length, 0, item);
      return arr;
    },
  },
};

export default U;
