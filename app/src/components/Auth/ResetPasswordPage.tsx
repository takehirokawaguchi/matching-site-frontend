// frontend/app/src/components/RegisterPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { reset, resetPassword } from '../../features/auth/authSlice';
import Spinner from '../Spinner';

interface FormData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  role: 'student' | 'recruiter';
}

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    email: '',
  });

  const { email } = formData;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: Partial<FormData> = {
      email
    };
    dispatch(resetPassword(userData));
  };

  useEffect( () => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      navigate("/")
      toast.success("パスワードをリセットするメールを送信しました。")
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mx-auto mt-8">
        <div className="mb-4">
          <h1 className="text-center font-bold text-xl">パスワードをリセット</h1>
        </div>
        { isLoading && <Spinner/> }
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-6">
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

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              パスワードをリセット
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
