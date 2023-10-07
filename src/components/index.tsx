import { ImportOutlined } from "@ant-design/icons"
import { Button, Upload } from "antd"
import { RcFile } from "antd/lib/upload"
import { useState } from "react"
import * as XLSX from 'xlsx';

type IProps = {
  onChange: (res: string[]) => void
  regex: RegExp
}

export const Excel2Data = (props: IProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const fileReaderOnload = (e: ProgressEvent<FileReader>) => {
    const emails: string[] = [];
    let allRow: any[] = [];
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    for (let sheetName in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheetName)) {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        allRow = [...allRow, ...jsonData]
      }
    }
    allRow.forEach((row: any) => {
      row.forEach((content: any) => {
        if (props.regex.test(content)) {
          emails.push(content);
        }
      });
    })
    props.onChange(emails)
    setLoading(false)
  }

  const handleFileUpload = async (event: RcFile) => {
    setLoading(true)
    const file = event;
    if (file) {
      const reader = new FileReader();
      reader.onload = fileReaderOnload
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false)
    }
    return ""
  }

  return <Upload
    name="file"
    action={handleFileUpload}
    className="upload"
    fileList={[]}
    accept=".xlsx"
  >
    <Button icon={<ImportOutlined />} type='primary' loading={loading} id="upload-btn">导入</Button>
  </Upload>
}
