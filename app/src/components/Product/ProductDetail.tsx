import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchUser, fetchMyData, fetchProduct } from '../../features/product/productSlice';
import { sendMessage } from '../../features/chat/chatSlice';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

interface Product {
  id: number;
  title: string;
  detail: string;
  thumbnail: string;
  detail_url: string;
  created_at: string;
  updated_at: string;
  user: number;
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

interface DecodedToken {
  user_id: number
}


interface AuthInfo {
  access: string;
  refresh: string;
}

// スカウト送信用
interface FormData {
  user: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
}



const ProductDetail: React.FC = () => {

  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [myData, setMyData] = useState<UserData | null>(null);

  const [receiverId, setReceiverID] = useState<number>();

  const [newMessage, setNewMessage] = useState<string>('');

  // accessTokenからuser_idを取得
  const authInfoString = localStorage.getItem("user");
  const authInfo: AuthInfo = authInfoString ? JSON.parse(authInfoString): null; 
  const accessToken: string = authInfo.access;
  const decoded = jwtDecode<DecodedToken>(accessToken);

  // 自分のID(sender_id)
  const my_user_id: number = decoded?.user_id

  // ProductのID
  const { uid: uidString } = useParams<{ uid: string }>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(uidString) {
      dispatch(fetchProduct(uidString));
    }
  }, [dispatch, uidString])

  const productDataFromRedux = useAppSelector(
    (state) => state.product.productData
  ); 

  useEffect(() => {
    if (productDataFromRedux) {
      setProduct(productDataFromRedux);
      dispatch(fetchUser(productDataFromRedux.user));
      setReceiverID(productDataFromRedux.user);
    }
  }, [dispatch, productDataFromRedux]);

  const productUserFromRedux = useAppSelector(
    (state) => state.product.productUser
  ); 

  useEffect(() => {
    setUser(productUserFromRedux)
  }, [productUserFromRedux]);

  // 自分のユーザーデータを取得（role判定の為）
  useEffect(() => {
    dispatch(fetchMyData(my_user_id));
  }, [dispatch, my_user_id])

  const myDataFromRedux = useAppSelector(
    (state) => state.product.myInfo
  ); 

  useEffect(() => {
    setMyData(myDataFromRedux)
  }, [myDataFromRedux]);

  // 人事が学生にチャットを送る画面
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setNewMessage(value);
  };

  // スカウト送信
  const handleSendScout = async () => {

    // 数値変換が有効かチェック
    if (!receiverId) {
      console.error("相手ユーザーが見つかりません。");
      return;
    }

    const formData: FormData = {
      "user": my_user_id,
      "sender": my_user_id,
      "receiver": receiverId,
      "message": newMessage,
      "is_read": false
    };

    try {
      dispatch(sendMessage(formData));
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    toggleModal();
}

  // 状態に応じた処理
  const { isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.chat
  );

  useEffect(() => {
    if (isError) {
      toast.error('スカウトの送信に失敗しました。')
    }

    if (isSuccess) {
      toast.success('スカウトを送信しました。')
    }

  }, [isError, isSuccess, dispatch])

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="container px-4 mt-8">
        <div className="flex flex-col md:flex-row items-start">
          {
            product && (
              <div className="product-card bg-white rounded-lg p-4 shadow-lg flex flex-col items-center w-full md:w-2/3 mb-8 md:mb-0">
                {/* サムネイルとリンク */}
                <a href={product.detail_url} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center hover:scale-105 transition-transform duration-200 ease-in-out">
                  <img src={product.thumbnail} alt={product.title} className="w-3/4" style={{ height: 'auto', maxHeight: '60%' }} />
                </a>
                {/* プロダクトタイトル */}
                <h3 className="mt-4 font-bold text-lg">{product.title}</h3>
                {/* 作成日と更新日 */}
                <div className="text-gray-600 text-sm mt-2 flex">
                  <p className="mr-1">作成日: {new Date(product.created_at).toLocaleDateString()}</p>
                  <p>更新日: {new Date(product.updated_at).toLocaleDateString()}</p>
                </div>
                {/* プロダクトの詳細説明文 */}
                <p className="mt-2 text-gray-800 text-sm">{product.detail}</p>
              </div>
            )
          }
          {
            user && (
              <div className="user-card bg-white rounded-lg p-12 shadow-lg flex flex-col items-center w-full md:w-1/3 md:ml-20">
                {/* ユーザー画像 */}
                <img src={user.profile?.profile_image} alt={user.username} className="w-40 h-40 object-cover rounded-full border-2 border-gray-300" />
                {/* ユーザー名 */}
                <h3 className="mt-4 font-bold text-lg">{user.username}</h3>
                {/* プロフィール文 */}
                <p className="text-gray-600 text-sm text-center mt-2">{user.profile?.bio}</p>
                {/* メッセージを送るボタン */}
                { myData?.role === 'recruiter' &&
                  <button
                    onClick={toggleModal}
                    className="mt-4 py-2 px-6 w-full bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition duration-300"
                  >
                    スカウトを送る
                  </button>
                }
              </div>
            )
          }
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 flex justify-center items-center">
              <div className="bg-white p-8 rounded shadow-lg md:w-2/3 w-full flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold mb-4 flex justify-center">メッセージ送信</h2>
                { isLoading && <Spinner/> }
                <textarea
                  id='message'
                  name="message"
                  value={newMessage} 
                  onChange={handleChange}
                  placeholder='メッセージを入力'
                  className="shadow appearance-none border rounded w-full h-80 px-3 py-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button 
                  onClick={handleSendScout}
                  className="mt-6 py-2 px-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outliner"
                >
                  スカウト送信
                </button>
                <button 
                  onClick={toggleModal}
                  className="mt-4 py-2 px-6 text-blue-500 flex justify-center"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;