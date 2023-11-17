import { Button } from 'antd';
// 状态管理
import { connect } from 'umi';

const HomePage = ({ dispatch, count }:any) => {
  // const { name } = useModel('@@initialState');
  // console.log(count);

  return (
      <div style={{ textAlign: 'center' }} className={'test'}>
        {/* <Guide name={trim(name)} /> */}
        <h2>{count.num}</h2>
        <Button
          type="primary"
          onClick={() => {
            dispatch({ type: 'count/add' ,payload: {}});
          }}
        >
          添加
        </Button>
      </div>
  );
};
export default connect(({ count }:any) => ({
  count,
}))(HomePage);


