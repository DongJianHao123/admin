import U from "@/common/U"
import { getChatGptProcess } from "@/services/common"
import { DeleteOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons"
import { Avatar, Button, Drawer, Input, Modal, message } from "antd"
import { useEffect, useRef, useState } from "react"
import './index.scss'
import copy from "copy-to-clipboard"
import { IChatgptHistory } from "@/common/types"


interface IProps {
  open: boolean
  handleClose: () => void
  prompt: string
}

const CHAT_KET = "chatgpt_history";

const ChatgptDrawer = ({ open, handleClose, prompt }: IProps) => {
  const ulRef = useRef<HTMLUListElement>(null)

  let [history, setHistory] = useState<IChatgptHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>(prompt);

  const [messageApi, contextHolder] = message.useMessage();


  const addHistory = () => {
    history = history ?? []
    let newChat: IChatgptHistory = {
      index: history.length + 1,
      createdAt: U.date.format(new Date(), "yyyy/MM/dd HH:mm:ss")!,
      user: "admin",
      question: question,
      answer: "",
      isEnd: false
    }
    history.push(newChat)
    setHistory([...history])
  }
  const scrollToBottom = () => {
    if (!ulRef.current) return;
    console.log(ulRef);
    ulRef.current.scrollTop = ulRef.current.scrollHeight;
  }


  const setChatStorage = () => {
    localStorage.setItem(CHAT_KET, JSON.stringify(history))
  }


  const handleAnswer = (chunk: string) => {
    const data = JSON.parse(chunk);
    history[history.length - 1].answer = data.text;

    if (!data.delta) {
      history[history.length - 1].id = data.id;
      history[history.length - 1].parentMessageId = data.parentMessageId;
      history[history.length - 1].isEnd = true;
      setChatStorage();
      setLoading(false)
    }

    setHistory([...history])
    scrollToBottom()
  }


  const chatGptSend = () => {
    if (U.str.isEmpty(question) || loading) return

    let parentMessageId = history ? history[history.length - 1]?.id : "";
    setLoading(true)
    addHistory();

    let _question = question
    setQuestion("");
    try {
      getChatGptProcess(_question, parentMessageId, (event: any) => {
        const xhr = event.target
        const { responseText } = xhr
        const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
        let chunk = responseText
        if (lastIndex !== -1)
          chunk = responseText.substring(lastIndex)
        try {
          console.log(chunk);
          handleAnswer(chunk)
        } catch (err) {
          console.log(err);
        }
      })
    } catch (error) {
      handleAnswer(JSON.stringify({
        id: "",
        parentMessageId: "",
        text: "网络好像出错了，请重试！"
      }))
    }
  }



  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !loading) chatGptSend();
  }


  // const setChatgptAction = (question:string) => {
  //   http.setRoomAction({ ...globalParams }, ROOM_ACTION.CAHTGPT.value, question);
  // }

  const handlerClear = () => {
    Modal.confirm({
      style: { zIndex: "1002" },
      open: true,
      title: "清空记录",
      content: "确定清空和ChatGPT的聊天记录吗",
      onOk: async () => {
        localStorage.removeItem(CHAT_KET);
        setHistory([]);
        messageApi.success("已清空记录")
      }
    })
  }
  const handleCopy = (answer: string) => {
    copy(answer)
    message.success('已复制到剪贴板');
  }

  useEffect(() => {
    setQuestion(prompt);
  }, [prompt]);

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem(CHAT_KET) || ""));
    } catch (error) {
      localStorage.removeItem(CHAT_KET)
    }
  }, [])

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, history, history.length])

  return <>
    {contextHolder}
    <Drawer
      className="chatgpt-container"
      title={
        <div className="title">
          ChatGPT小助手
        </div>
      }
      placement={"left"}
      width={600}
      closeIcon={<></>}
      onClose={handleClose}
      maskClosable={true}
      destroyOnClose={true}
      open={open}
      key={"left"}
      style={{ zIndex: "1000" }}
    >
      <ul ref={ulRef} >
        {history?.length > 0 ? history.map((item) => {
          const { index, question, answer, createdAt, isEnd } = item;
          return <li key={index} >
            <div className="question">
              <Avatar size={40} style={{ minWidth: "40px", backgroundColor: '#1890FF', verticalAlign: 'middle' }} gap={1}>
                {"admin"}
              </Avatar>

              <div className={"content"}>
                <div className="time">{createdAt}</div>
                <p>{question}</p>
              </div>
            </div>
            <div className="answer">
              <img className="avatar" src={"/icons/chatgpt-logo.jpg"} />
              <div className="content">
                <div className="time">{createdAt}</div>
                <p>{answer}
                  <br />
                  {isEnd && answer && <Button style={{ float: "right" }} type="link" onClick={() => handleCopy(answer)}>复制</Button>}
                </p>
              </div>
            </div>
          </li>
        }) : <div className="empty-chat">

          <SmileOutlined />
          <span>请向我提问吧~</span>
        </div>}

      </ul>
      <div className="footer">
        <Button className="clear-btn" disabled={loading || !history || history?.length < 1} onClick={() => handlerClear()} ><DeleteOutlined /></Button>
        <Input autoFocus onFocus={() => scrollToBottom()} onKeyDown={(e) => handleOnKeyDown(e)} value={question} onChange={(e) => setQuestion(e.target.value)} className="input" placeholder="请输入您的问题" />
        <Button className="send-btn" disabled={loading} onClick={() => chatGptSend()} icon={<SendOutlined />} type="primary">发送</Button>
      </div>
    </Drawer >
  </>
}

export default ChatgptDrawer
