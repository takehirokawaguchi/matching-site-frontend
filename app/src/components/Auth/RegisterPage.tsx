import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reset, register } from '../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Spinner from '../Spinner';


interface FormData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  role: 'student' | 'recruiter';
}


const RegisterPage: React.FC = () => {
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    re_password: '',
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
    const { username, email, password, re_password } = formData;

    if (!username || !email || !password || !re_password) {
      toast.error('すべてのフィールドを入力してください');
      return;
    }

    if (password !== re_password) {
      toast.error('パスワードが一致しません');
      return;
    } else {
      const userData: FormData = {
        username,
        email,
        password,
        re_password,
        role: isStudent ? 'student' : 'recruiter'
      }
      dispatch(register(userData));
    }
  }

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate("/")
      dispatch(reset());
      toast.success("確認メールを送信しました。認証を完了してください。")
    }

  }, [isError, isSuccess, user, navigate, dispatch, message])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4">
      { isLoading && <Spinner/> }
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mx-auto mt-8">
        <div className="mb-4">
          <h1 className="text-center font-bold text-xl">
            {isStudent ? '学生新規登録' : '採用担当者新規登録'}
          </h1>
        </div>

        <div className="flex justify-around mb-4">
          <button
            className={`px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out ${
              isStudent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setIsStudent(true)}
          >
            学生
          </button>
          <button
            className={`px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out ${
              isStudent ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
            }`}
            onClick={() => setIsStudent(false)}
          >
            採用担当者
          </button>
        </div>


        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              氏名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700"
              required
            />
          </div>

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
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="re_password">
              パスワード（確認） <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="re_password"
              name="re_password"
              value={formData.re_password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              登録
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-blue-500">登録済みの方はこちら</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
