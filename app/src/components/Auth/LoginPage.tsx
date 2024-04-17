import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { reset, login, getUserInfo } from '../../features/auth/authSlice';
import Spinner from '../Spinner';

interface FormData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  role: 'student' | 'recruiter';
}

const LoginPage: React.FC = () => {
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [formData, setFormData] = useState<Partial<FormData>>({
    email: '',
    password: '',
    role: 'student', // 初期値
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const {user, isLoading, isError, isSuccess, message} = useAppSelector(
    (state) => state.auth
  );


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    const userData: Partial<FormData> = {
      email,
      password,
      // role: isStudent ? 'student' : 'recruiter',
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success('ログインしました。')
      navigate("/")
      dispatch(reset())
      dispatch(getUserInfo())
    }

  }, [isError, isSuccess, user, navigate, dispatch, message])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4">
      { isLoading && <Spinner/> }
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mx-auto mt-8">
        <div className="mb-4">
          <h1 className="text-center font-bold text-xl">
            ログイン
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ログイン
            </button>
          </div>
        </form>
        <div className="text-center py-2 px-4">
          <Link to="/register" className="text-blue-500">新規会員登録はこちら</Link>
        </div>
        <div className="text-center py-2 px-4">
          <Link to="/reset-password" className="text-blue-500">パスワードを忘れましたか？</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
