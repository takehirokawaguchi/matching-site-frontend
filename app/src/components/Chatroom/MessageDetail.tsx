import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchMessageList, fetchMessageDetail, fetchUserData, sendMessage } from '../../features/chat/chatSlice';
import defaultAvatarUrl from '../../assets/images/default.png'

interface DecodedToken {
  user_id: number
}

interface AuthInfo {
  access: string;
  refresh: string;
}

interface ProfileData {
  affiliation: string;
  company: string;
  industry: string;
  bio: string;
  profile_image: string;
}

interface UserData {
  username: string;
  email: string;
  role: string;
  profile: ProfileData | null;
}

interface MessageData {
  id: number;
  sender: number;
  sender_user: UserData;
  receiver: number;
  receiver_user: UserData;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface FormData {
  user: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
}

const MessageDetail: React.FC = () => {

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [userData, setUserData] = useState<UserData>();
  // const [newSearch, setNewSearch] = useState<string>('');
  const { uid: uidString } = useParams<{ uid: string }>();
  const authInfoString = localStorage.getItem("user");
  const authInfo: AuthInfo = authInfoString ? JSON.parse(authInfoString): null; 
  const accessToken: string = authInfo.access;
  const decoded = jwtDecode<DecodedToken>(accessToken);
  const user_id: number = decoded?.user_id

  const dispatch = useAppDispatch();

  // Reduxに送信
  useEffect(() => {
    dispatch(fetchMessageList(user_id));
  }, [dispatch, user_id]);

  const messageListFromRedux = useAppSelector(
    (state) => state.chat.messageList
  ); 

  useEffect(() => {
    setMessages(messageListFromRedux)
  }, [messageListFromRedux]);

  // 初期ロード時にメッセージリストとユーザーデータを取得
  useEffect(() => {
    if(user_id && uidString) {
      dispatch(fetchMessageDetail({user_id, uidString}));
      dispatch(fetchUserData(uidString));
    }
  }, [dispatch, user_id, uidString]);

  const messageDetailFromRedux = useAppSelector(
    (state) => state.chat.messageDetail
  );

  useEffect(() => {
    setMessage(messageDetailFromRedux)
  }, [messageDetailFromRedux]);

  const userDataFromRedux = useAppSelector(
    (state) => state.chat.userData
  );

  useEffect(() => {
    if(userDataFromRedux) {
      setUserData(userDataFromRedux);
    }
  }, [userDataFromRedux]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewMessage(value);
  };

  // メッセージ送信
  const handleSendMessage = async () => {

      // uidString を数値に変換
    const receiverId = Number(uidString);

    // 数値変換が有効かチェック
    if (isNaN(receiverId)) {
      console.error("無効なIDです。");
      return;
    }
    
    const formData: FormData = {
      "user": user_id,
      "sender": user_id,
      "receiver": receiverId,
      "message": newMessage,
      "is_read": false
    };

    try {
      await dispatch(sendMessage(formData));
      setNewMessage("");
      if(uidString) {
        await dispatch(fetchMessageDetail({user_id, uidString}));
      }
      await dispatch(fetchMessageList(user_id));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="container mx-auto">
        <div className="py-6" style={{ height: '92vh' }}>
          <div className="flex border border-grey rounded shadow-lg h-full">

            {/* Left */}
            <div className="w-1/3 border flex flex-col">

              {/* Contacts */}
              <div className="bg-grey-lighter flex-1 overflow-auto">
                {messages.map((message, index) => (
                  <Link
                    key={index}
                    to={`/messages/${message.sender === user_id ? message.receiver : message.sender }/`}
                    className="px-3 flex items-center bg-grey-light cursor-pointer"
                  >
                    <div>
                      <img 
                      src={message.sender !== user_id && message.sender_user.profile?.profile_image 
                          ? message.sender_user.profile.profile_image 
                          : message.receiver !== user_id && message.receiver_user.profile?.profile_image 
                          ? message.receiver_user.profile.profile_image 
                          : defaultAvatarUrl}
                      className="h-12 w-12 rounded-full"
                      alt="Profile" />
                    </div>
                    <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
                      <div className="flex items-bottom justify-between">
                        <p className="text-grey-darkest">
                          {message.sender === user_id
                          ? message.receiver_user.username
                          : message.sender_user.username}
                        </p>
                        <p className="text-xs text-grey-darkest">
                          {moment.utc(message.created_at).local().startOf('seconds').fromNow()}
                        </p>
                      </div>
                      <p className="text-grey-dark mt-1 text-sm">
                        {message.message}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

            </div>

            {/* Right */}
            {/* Similarly, you can add the right side content as needed */}
            <div className="w-2/3 border flex flex-col">
            <div className="py-2 px-3 bg-gray-200 flex flex-row justify-between items-center">
              <div className="flex items-center">
                <div>
                  <img className="w-10 h-10 rounded-full" src={userData?.profile?.profile_image || defaultAvatarUrl} alt="user"/>
                </div>
                <div className="ml-4">
                  <p className="text-gray-800">
                    { userData?.username }
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    { userData?.role === 'recruiter' ?
                      userData?.profile?.company
                      :userData?.profile?.affiliation
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto bg-gray-300">
              <div className="py-2 px-3">
                {message.map((message, index) => (
                  <>
                    {message.sender === user_id ?
                      <div className="flex justify-end mb-2">
                        <div className="rounded py-2 px-3 bg-green-200">
                          <p className="text-sm mt-1">
                            {message.message}
                          </p>
                          <p className="text-right text-xs text-gray-600 mt-1">
                            {moment.utc(message.created_at).local().startOf('seconds').fromNow()}
                          </p>
                        </div>
                      </div>
                    : 
                      <div className="flex mb-2">
                        <div className="rounded py-2 px-3 bg-gray-200">
                          <p className="text-sm mt-1">
                            {message.message}
                          </p>
                          <p className="text-right text-xs text-gray-600 mt-1">
                            {moment.utc(message.created_at).local().startOf('seconds').fromNow()}
                          </p>
                        </div>
                      </div>
                    }
                  </>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-gray-200 px-4 py-4 flex items-center">
              <div className="flex-1 mx-4">
                <input
                  type="text"
                  className="w-full border rounded px-2 py-2"
                  placeholder="メッセージを入力"
                  value={newMessage} 
                  name="message" 
                  id='message'
                  onChange={handleChange}
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                送信
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default MessageDetail;