import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom';
import zhCN from 'antd/lib/locale/zh_CN';

export const Utils = {
  common: {
    renderReactDOM: (child: any, options = {}) => {
      const div = document.createElement('div');
      const { id }: any = options;
      if (id) {
        const e = document.getElementById(id);
        if (e) {
          document.body.removeChild(e);
        }
        div.setAttribute('id', id);
      }

      document.body.appendChild(div);

      ReactDOM.render(
        <ConfigProvider locale={zhCN}>{child}</ConfigProvider>,
        div,
      );
    },

    closeModalContainer: (id: string) => {
      const e = document.getElementById(id);
      if (e) {
        document.body.removeChild(e);
      }
    },

    createModalContainer: (id: string) => {
      //强制清理同名div，render会重复创建modal
      Utils.common.closeModalContainer(id);
      const div = document.createElement('div');
      div.setAttribute('id', id);
      document.body.appendChild(div);
      return div;
    },
  },
};
