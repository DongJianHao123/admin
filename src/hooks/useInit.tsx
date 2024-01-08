import { connect, useModel } from "@umijs/max"
import { useEffect } from 'react'

const useInit = ({ dispatch }: any) => {
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    dispatch({ type: 'courses/getAll' })
    dispatch({ type: 'students/getAll' })
  }, [initialState?.currentClient])
  return <></>
}

export default connect(({ }) => ({}))(useInit)
