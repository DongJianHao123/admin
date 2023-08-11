import { Radio } from 'antd';
import LiveTable from './tables/LiveTable';
import PlayBackTable from './tables/PlayBackTable';
import { useState } from 'react'

const typeList = {
  LIVE: "live",
  PlAY_BACK: "playback"
}

const StudentClassHourStatistics = () => {
  const [staticType, setStaticType] = useState(typeList.LIVE)
  return <div>
    <Radio.Group style={{ margin: "20px 0" }} value={staticType} onChange={(e) => setStaticType(e.target.value)} buttonStyle="solid">
      <Radio.Button value={typeList.LIVE}>直播课时统计</Radio.Button>
      <Radio.Button value={typeList.PlAY_BACK}>回放课时统计</Radio.Button>
    </Radio.Group>
    {
      staticType === typeList.LIVE && <LiveTable />
    }
    {
      staticType === typeList.PlAY_BACK && <PlayBackTable />
    }
  </div>;
};

export default StudentClassHourStatistics
