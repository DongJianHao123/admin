// import { ReactNode } from "react"

type IProps = {
  lineNum?: number
}

const CustomText: React.FC<IProps> = ({ children, lineNum = 1 }) => {
  return <p style={{
    WebkitLineClamp: lineNum,
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    wordBreak: "break-all",
    overflow: "hidden",
    display: "-webkit-box",
    whiteSpace: "normal",
    width: "100%",
  }}>{children}</p>
}
export default CustomText
