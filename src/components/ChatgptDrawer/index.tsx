import U from "@/common/U"
import { getChatGptProcess, getHunyuanChat } from "@/services/common"
import { DeleteOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons"
import { Avatar, Button, Drawer, Input, Modal, Popover, message } from "antd"
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
const HUNYUAN_KET = "hunyuan_history";

const ChatgptDrawer = ({ open, handleClose, prompt }: IProps) => {
  const ulRef = useRef<HTMLUListElement>(null)

  let [history, setHistory] = useState<IChatgptHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>(prompt);
  const [type, setType] = useState(CHAT_KET);

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
    localStorage.setItem(type, JSON.stringify(history))
  }


  const handleAnswer = (chunk: string) => {
    const data = JSON.parse(chunk);
    history[history.length - 1].answer = data.text;

    if (data.detail.choices[0].finish_reason === 'stop') {
      history[history.length - 1].id = data.id;
      history[history.length - 1].parentMessageId = data.parentMessageId;
      history[history.length - 1].isEnd = true;
      setChatStorage();
      setLoading(false)
    }
    setHistory([...history])
    scrollToBottom()
  }

  const handleHunyuanAnswer = (responseText: string) => {
    let data = ''
    const answerArr = responseText.split('\n').map(item => {
      try {
        const obj = JSON.parse(item)
        data += obj.Choices[0].Delta.Content
        return obj
      } catch (error) {
        console.log('parse Error', item);
        return {}
      }
    })

    history[history.length - 1].answer = data;
    const lastOne = answerArr[answerArr.length - 1]
    if (lastOne && lastOne.Choices[0].FinishReason === 'stop') {
      history[history.length - 1].id = lastOne.id;
      history[history.length - 1].parentMessageId = lastOne.id;
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
          console.log(JSON.parse(chunk));
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
  const hunyuanSend = () => {
    if (U.str.isEmpty(question) || loading) return
    setLoading(true)
    addHistory();

    let _question = question
    setQuestion("");
    getHunyuanChat(_question, (event: any) => {
      const xhr = event.target
      const { responseText }: { responseText: string } = xhr
      handleHunyuanAnswer(responseText)
    }).catch(() => {
      let obj = { Choices: [{ FinishReason: 'stop', Delta: { Content: '网络好像出错了，请重试！' } }] };
      handleHunyuanAnswer(JSON.stringify(obj))
    })
  }

  const send = () => {
    if (type === CHAT_KET) chatGptSend()
    if (type === HUNYUAN_KET) hunyuanSend()
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !loading) send()
  }

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
      setHistory(JSON.parse(localStorage.getItem(type) || ""));
    } catch (error) {
      localStorage.removeItem(type)
      setHistory([])
    }
  }, [type])

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, history, history.length])

  const checkModelContent = <ul className="model-list">
    <li onClick={() => setType(CHAT_KET)}> <span className={type === CHAT_KET ? "action point" : 'point'}></span>chatgpt3.5</li>
    <li onClick={() => setType(HUNYUAN_KET)}><span className={type === HUNYUAN_KET ? "action point" : 'point'}></span>腾讯云混元大模型3.0</li>
  </ul>

  return <>
    {contextHolder}
    <Drawer
      className="chatgpt-container"
      title={
        <div className="title">
          <div>
            {type === CHAT_KET && "ChatGPT小助手"}
            {type === HUNYUAN_KET && "混元小助手"}
          </div>
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
              <Avatar size={40} style={{ minWidth: "40px", backgroundColor: '#00A8C5', verticalAlign: 'middle' }} gap={1}>
                {"admin"}
              </Avatar>

              <div className={"content"}>
                <div className="time">{createdAt}</div>
                <p>{question}</p>
              </div>
            </div>
            <div className="answer">
              {type === CHAT_KET && <img className="avatar" src={"/icons/chatgpt-logo.jpg"} />}
              {type === HUNYUAN_KET && <Avatar size={40} style={{ fontSize:14, minWidth: "40px", backgroundColor: '#1890FF', verticalAlign: 'middle' }} gap={1}>
                {"混元"}
              </Avatar>}
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
        <Button className="btn" disabled={loading || !history || history?.length < 1} onClick={() => handlerClear()} ><DeleteOutlined /></Button>
        <Popover placement="top" title={'切换模型'} content={checkModelContent} trigger="click">
          <Button className="btn" disabled={loading} >切换</Button>
        </Popover>
        <Input autoFocus onFocus={() => scrollToBottom()} onKeyDown={(e) => handleOnKeyDown(e)} value={question} onChange={(e) => setQuestion(e.target.value)} className="input" placeholder="请输入您的问题" />
        <Button className="send-btn" disabled={loading} onClick={() => send()} icon={<SendOutlined />} type="primary">发送</Button>
      </div>
    </Drawer >
  </>
}

export default ChatgptDrawer
