import React, { useEffect } from 'react';
import { activate, reset } from '../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';

interface ActivateData {
  uid: string;
  token: string;
}

const ActivatePage: React.FC = () => {

  const { uid: uidString, token: tokenString } = useParams<{ uid: string; token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const {isLoading, isError, isSuccess, message} = useAppSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData: ActivateData = {
      uid: uidString as string,
      token: tokenString as string,
    };
    dispatch(activate(userData));
    toast.success('アカウントが有効化されました！ログインが可能です。');
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    };

    if (isSuccess) {
      navigate("/login");
    };

    dispatch(reset());
  }, [isError, isSuccess, navigate, dispatch, message]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mx-auto mt-8">
        <div className="mb-6">
          <h1 className="text-center font-bold text-xl">アカウントを有効化しますか？</h1>
        </div>
        { isLoading && <Spinner/> }

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              有効化する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivatePage;
