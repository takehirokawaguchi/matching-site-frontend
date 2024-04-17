// frontend/app/src/components/RegisterPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { reset, resetPasswordConfirm } from '../../features/auth/authSlice';
import Spinner from '../Spinner';

interface ResetPasswordConfirmData {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

const ResetPasswordConfirmPage: React.FC = () => {

  const { uid: uidString, token: tokenString } = useParams<{ uid: string; token: string }>();

  const [formData, setFormData] = useState<ResetPasswordConfirmData>({
    uid: uidString as string,
    token: tokenString as string,
    new_password: '',
    re_new_password: '',
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { new_password, re_new_password } = formData;

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: ResetPasswordConfirmData = {
      uid: uidString as string,
      token: tokenString as string,
      new_password,
      re_new_password
    };
    dispatch(resetPasswordConfirm(userData));
  };

  useEffect( () => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      navigate("/")
      toast.success("パスワードの変更が完了しました。")
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mx-auto mt-8">
        <div className="mb-4">
          <h1 className="text-center font-bold text-xl">パスワードを変更する</h1>
        </div>
        { isLoading && <Spinner/> }
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-6">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="new_password">
              新しいパスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="re_new_password">
              新しいパスワード（確認） <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="re_new_password"
              name="re_new_password"
              value={formData.re_new_password}
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
              変更
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
