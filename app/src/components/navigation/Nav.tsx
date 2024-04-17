import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { reset, logout } from '../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

interface AuthInfo {
  access: string;
  refresh: string;
}

interface DecodedToken {
  user_id: number
}


const Nav: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(
    (state) => state.auth
  );

  const [myUserId, setMyUserId] = useState<number>();

  const handleLogout = async () => {

    try {
      await dispatch(logout());
      toast.success('ログアウトしました。');
      await dispatch(reset());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // accessTokenからuser_idを取得
    const authInfoString = localStorage.getItem("user");
    if (authInfoString) {
    const authInfo: AuthInfo = authInfoString ? JSON.parse(authInfoString): null; 
    const accessToken: string = authInfo.access;
      if (accessToken) {
        const decoded = jwtDecode<DecodedToken>(accessToken);
        // 自分のID
        const user_id: number = decoded?.user_id
        setMyUserId(user_id);
      }
    }
  }, [user])

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-blue-500 text-white">
      <div className="flex items-center">
        <NavLink className="text-lg font-semibold" to="/">Career Product</NavLink>
      </div>
      {user && myUserId ?
      <>
        <div>
          <NavLink className="text-white mr-4" to="/messages">メッセージ</NavLink>
          <NavLink className="text-white mr-4" to="/products/post">プロダクトを投稿</NavLink>
          <NavLink className="text-white mr-4" to={`/profile/${myUserId}/edit`}>プロフィール編集</NavLink>
          <NavLink className="text-white" to="/" onClick={handleLogout}>ログアウト</NavLink>
        </div>
      </>
      :
      <>
        <div>
          <NavLink className="text-white mr-4" to="/login" >ログイン</NavLink>
          <NavLink className="text-white" to="/register">新規登録</NavLink>
        </div>
      </>
      }
    </header>
  );
};

export default Nav;