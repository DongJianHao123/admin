import { message } from "antd";
import ExportJsonExcel from "js-export-excel"

export const data2Excel = (fileName, optionDatas) => {
  try {
    let option = {};  //option代表的就是excel文件
    option.fileName = fileName;  //excel文件名称
    option.datas = optionDatas
    let toExcel = new ExportJsonExcel(option);  //生成excel文件
    toExcel.saveExcel();  //下载excel文件
    message.success("数据导出成功")
  } catch (err) {
    message.error("导出出错,请刷新重试")
    console.log(err);
  }
}
