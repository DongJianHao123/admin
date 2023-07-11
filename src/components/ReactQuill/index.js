import { useState } from "react";
import ReactQuill from "react-quill";
import { debounce } from "lodash";

import "./index.less";

const ReactQuillEditor = (_value) => {
  const [value, setValue] = useState(_value);

  // 自定义工具栏
  const modules = {
    // 方式1: 可以是简单的一维数组配置
    // toolbar: ["bold", "italic", "underline", "strike", "blockquote"]
    // 方式2: 可以配置二维数组，进行多个选项的配置
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      // 或者针对某一个配置项的key值，进行配置
      [{ header: [1, 2, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }]
    ]
    // 方式3: 可以自己指定工具栏的容器
    // toolbar: "#rq-toolbar"
  };

  // 剩下参数 delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor
  const handleChangeValue = debounce((value) => {
    console.log("富文本的值：", value);
    setValue(value);
  }, 500);

  return (
    <div className="react-quill-wrap">
      {/* <h2 className="title">富文本编辑器</h2> */}
      <div className="quill-editor-wrap">
        {/* 自定义的工具栏 */}
        {/* <div className="quill-editor-toolbar" id="rq-toolbar">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
        </div> */}
        <ReactQuill theme="snow" modules={modules}  onChange={handleChangeValue} />
      </div>
    </div>
  );
};

export default ReactQuillEditor;
