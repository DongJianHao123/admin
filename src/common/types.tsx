export interface IChatgptHistory {
  id?: string
  index:number
  answer?: string
  createdAt: string
  parentMessageId?: string
  question?: string
  user: string
  isEnd: boolean
}
