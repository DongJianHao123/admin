import { PageContainer } from "@ant-design/pro-components";
import OperateSms from "./components/OperateSms";

const Operate = () => {
  return <>
    <PageContainer
    className="operate-container"
    tabList={[
      {
        tab: '短信通知',
        key: 'sms',
        children: <OperateSms />,
      },
      {
        tab: '邮件通知',
        key: 'email',
        children: <></>,
      },
      {
        tab: '统计信息',
        key: 'statistics',
        children: <></>,
      }
    ]}>
      {/* this is operate page! */}
    </PageContainer>
  </>
}

export default Operate;
