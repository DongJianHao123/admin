import { ProTable } from '@ant-design/pro-components';
import { Radio } from 'antd';
import { useState } from 'react';

const StudentClassHourStatistics = () => {
  const [staticType, setStaticType] = useState("a")
  return <div>
    <Radio.Group style={{ margin: "20px 0" }} value={staticType} onChange={(e) => setStaticType(e.target.value)} buttonStyle="solid">
      <Radio.Button value="a">直播课时统计</Radio.Button>
      <Radio.Button value="b">回放课时统计</Radio.Button>
    </Radio.Group>
    <ProTable />
  </div>;
};

export default StudentClassHourStatistics
