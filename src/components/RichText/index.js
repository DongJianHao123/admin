import { useRef, useMemo } from 'react';
import { message } from 'antd';
import { fileUpload } from '@/utils';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import imageResize from 'quill-image-resize-module-zzone';

Quill.register('modules/imageResize', imageResize);

const Editor = (props) => {
  let quillRef = useRef(null);

  // 自定义上传图片到七牛云
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      const hide = message.loading('上传中...', 0);
      fileUpload(file).then((res) => {
        const url = `https://ssl.cdn.maodouketang.com/${res.key}`;
        let quill = quillRef?.current?.getEditor(); //获取到编辑器本身
        const cursorPosition = quill.getSelection().index; //获取当前光标位置
        quill.insertEmbed(cursorPosition, 'image', url); //插入图片
        quill.setSelection(cursorPosition + 1); //光标位置加1
        hide();
      });
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
          [{ align: [] }],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image', 'video'],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [
            {
              background: [
                'rgb(  0,   0,   0)',
                'rgb(230,   0,   0)',
                'rgb(255, 153,   0)',
                'rgb(255, 255,   0)',
                'rgb(  0, 138,   0)',
                'rgb(  0, 102, 204)',
                'rgb(153,  51, 255)',
                'rgb(255, 255, 255)',
                'rgb(250, 204, 204)',
                'rgb(255, 235, 204)',
                'rgb(255, 255, 204)',
                'rgb(204, 232, 204)',
                'rgb(204, 224, 245)',
                'rgb(235, 214, 255)',
                'rgb(187, 187, 187)',
                'rgb(240, 102, 102)',
                'rgb(255, 194, 102)',
                'rgb(255, 255, 102)',
                'rgb(102, 185, 102)',
                'rgb(102, 163, 224)',
                'rgb(194, 133, 255)',
                'rgb(136, 136, 136)',
                'rgb(161,   0,   0)',
                'rgb(178, 107,   0)',
                'rgb(178, 178,   0)',
                'rgb(  0,  97,   0)',
                'rgb(  0,  71, 178)',
                'rgb(107,  36, 178)',
                'rgb( 68,  68,  68)',
                'rgb( 92,   0,   0)',
                'rgb(102,  61,   0)',
                'rgb(102, 102,   0)',
                'rgb(  0,  55,   0)',
                'rgb(  0,  41, 102)',
                'rgb( 61,  20,  10)',
              ],
            },
          ],
          [
            {
              color: [
                'rgb(  0,   0,   0)',
                'rgb(230,   0,   0)',
                'rgb(255, 153,   0)',
                'rgb(255, 255,   0)',
                'rgb(  0, 138,   0)',
                'rgb(  0, 102, 204)',
                'rgb(153,  51, 255)',
                'rgb(255, 255, 255)',
                'rgb(250, 204, 204)',
                'rgb(255, 235, 204)',
                'rgb(255, 255, 204)',
                'rgb(204, 232, 204)',
                'rgb(204, 224, 245)',
                'rgb(235, 214, 255)',
                'rgb(187, 187, 187)',
                'rgb(240, 102, 102)',
                'rgb(255, 194, 102)',
                'rgb(255, 255, 102)',
                'rgb(102, 185, 102)',
                'rgb(102, 163, 224)',
                'rgb(194, 133, 255)',
                'rgb(136, 136, 136)',
                'rgb(161,   0,   0)',
                'rgb(178, 107,   0)',
                'rgb(178, 178,   0)',
                'rgb(  0,  97,   0)',
                'rgb(  0,  71, 178)',
                'rgb(107,  36, 178)',
                'rgb( 68,  68,  68)',
                'rgb( 92,   0,   0)',
                'rgb(102,  61,   0)',
                'rgb(102, 102,   0)',
                'rgb(  0,  55,   0)',
                'rgb(  0,  41, 102)',
                'rgb( 61,  20,  10)',
              ],
            },
          ],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
        history: {
          delay: 500,
          maxStack: 100,
          userOnly: true,
        },
      },
      imageResize: {
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white',
        },
        modules: ['Resize', 'DisplaySize'],
      },
    }),
    [],
  );

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        placeholder="请输入"
        modules={modules}
        style={{ height: props.height }}
        {...props}
      />
    </>
  );
};

export default Editor;
