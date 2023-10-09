import { useRef, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { fileUpload } from '@/utils';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import imageResize from 'quill-image-resize-module-zzone';
import { base64ToFile, isHTML } from './useCopyImg';

Quill.register('modules/imageResize', imageResize);

const base64ImgRegx = /<img [^>]*src=['"]data:image([^'"]+)[^>]*>/;

const Editor = (props) => {
  let quillRef = useRef(null);

  // 自定义上传图片到七牛云
  const handleClickUploadImg = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      imageReplace(file);
    };
  };

  const imageUpload = async (file) => {
    const hide = message.loading('图片上传中...', 0);
    try {
      const res = await fileUpload(file);
      hide();
      const url = `https://ssl.cdn.maodouketang.com/${res.key}`;
      return url;
    } catch (err) {
      hide();
      message.error('图片上传失败，请重试');
    }
  };

  const imageReplace = async (file) => {
    const url = await imageUpload(file);
    let quill = quillRef?.current?.getEditor(); //获取到编辑器本身
    const cursorPosition = quill.getSelection().index; //获取当前光标位置
    quill.insertEmbed(cursorPosition, 'image', url); //插入图片
    quill.setSelection(cursorPosition + 1); //光标位置加1
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
          image: handleClickUploadImg,
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

  const handlePaste = async (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    if (clipboardData) {
      const items = clipboardData.items;

      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          // 检查是否是文本类型
          if (item.type.indexOf('text') !== -1) {
            item.getAsString(async (text) => {
              let _text = await uploadImgInPasteText(text);
              setTimeout(() => {
                let quill = quillRef?.current?.getEditor(); //获取到编辑器本身
                const cursorPosition = quill.getSelection().index; //获取当前光标位置
                console.log(quill);
                quill.clipboard.dangerouslyPasteHTML(cursorPosition, _text);
              }, 0);
            });
          }

          // 如果还需要处理其他类型，比如图片，可以类似地添加逻辑
          else if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            await imageReplace(file);
          }
        }
      }
    }
  };

  const uploadImgInPasteText = async (text) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const imgElements = doc.getElementsByTagName('img');

      for (let i = 0; i < imgElements.length; i++) {
        const imgElement = imgElements[i];

        // 检查图片是否为 base64
        if (imgElement.src.startsWith('data:image')) {
          const base64Data = imgElement.src.split(',')[1];
          const imgFile = base64ToFile(base64Data);
          const uploadedURL = await imageUpload(imgFile);
          imgElement.src = uploadedURL;
        }
      }
      return doc.documentElement.outerHTML;
    } catch (error) {
      console.log('uploadImgInPasteText出错了', error);
      return text;
    }
  };

  useEffect(() => {
    quillRef.current.editor.container.addEventListener('paste', handlePaste);
  }, []);

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
