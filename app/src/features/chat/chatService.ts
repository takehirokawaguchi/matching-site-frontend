import axios, { AxiosRequestConfig } from "axios";

interface FormData {
  user: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
}

const BACKEND_DOMAIN = "http://localhost:8000"

// ユーザー情報を取得
const fetchMessageList = async (accessToken: string, user_id: number) => {

  const CHATROOM_URL = `${BACKEND_DOMAIN}/api/messages/${user_id}`
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const response = await axios.get(CHATROOM_URL, config)

  return response.data
}

// 特定ユーザーとのチャット一覧を取得
const fetchMessageDetail = async (accessToken: string, user_id: number, uidString: string) => {

  const CHAT_URL = `http://127.0.0.1:8000/api/get-messages/${user_id}/${uidString}`
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const response = await axios.get(CHAT_URL, config)

  return response.data
}

// チャット相手のデータを取得
const fetchUserData = async (accessToken: string, uidString: string) => {

  const USERDATA_URL = `http://127.0.0.1:8000/api/profile/${uidString}`
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const response = await axios.get(USERDATA_URL, config)

  return response.data
}

// チャットの内容を送信
const sendMessage = async (accessToken: string, formData: FormData) => {

  const SENDMESSAGE_URL = 'http://127.0.0.1:8000/api/send-message/'
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const response = await axios.post(SENDMESSAGE_URL, formData, config)

  return response.data
}

const chatService = { fetchMessageList, fetchMessageDetail, fetchUserData, sendMessage }

export default chatService;