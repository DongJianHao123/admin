import { connect } from "@umijs/max"
import { useEffect } from 'react'

const useInit = ({ dispatch }: any) => {
  useEffect(() => {
    dispatch({ type: 'courses/getAll' })
    dispatch({ type: 'students/getAll' })
  }, [])
  return <></>
}

export default connect(({ }) => ({}))(useInit)
