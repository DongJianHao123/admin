import { Button } from 'antd';
import styles from './index.less';
import { ArrowRightOutlined } from '@ant-design/icons'
import { Link } from '@umijs/max';


const Transfer = () => {

  return <div className={styles.container} >
    <img className={styles.qrcode} src="https://ssl.cdn.maodouketang.com/FmsFloPHOyjeeRY3YVW3E2U2yotw" alt="" />
    <div className={styles.title}>网址迁移提醒</div>
    <div className={styles.descWrap}>
      <p>此网址已停止更新，请访问新网址（<a target='_blank' href='https://admin.opencamp.cn' rel="noreferrer">admin.opencamp.cn</a>）</p>
      <p>如需了解更多信息，请添加上方“阿图教育”微信。</p>
    </div>
    <a target='_blank' href={'https://admin.opencamp.cn'} rel="noreferrer"><Button type='primary'>前往新后台 <ArrowRightOutlined /></Button></a>

  </div>
}

export default Transfer
