import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { toast } from 'react-toastify';
import { reset, update } from '../../features/auth/authSlice';
import Spinner from '../Spinner';

interface Profile {
  affiliation: string;
  company: string;
  industry: string;
  bio: string;
  profile_image: File | null;
}

interface UpdateData {
  username: string;
  email: string;
  role: string;
  profile: Profile;
}

const ProfileEdit: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    profile: {
      affiliation: '',
      company: '',
      industry: '',
      bio: '',
      profile_image: null as File | null,
    }
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const { uid: uidString } = useParams<{ uid: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const {isLoading, isError, isSuccess, message} = useAppSelector(
    (state) => state.auth
  );

  // ユーザーデータのフェッチ処理を記述
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/profile/${uidString}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setFormData(response.data);
      // 既存の画像データのURLを取得
      setProfileImageUrl(response.data.profile_image);
    } catch (error) {
      toast.error('ユーザーの取得に失敗しました');
    }
  };

  // 即時実行される方
  useEffect(() => {
    fetchUserData();
  }, []);

  // Redux絡みの方
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success('ユーザー情報を更新しました。')
      navigate("/mypage")
      dispatch(reset())
    }

  }, [isError, isSuccess, navigate, dispatch, message])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      // 画像をアップロードしようとしてキャンセルした際のエラー防止
      if (files && files.length > 0) {
        setFormData({
          ...formData,
          profile: {
            ...formData.profile,
            profile_image: files[0]
          }
        });
        setProfileImage(files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      } else {
        setProfileImage(null);
        // setProfileImagePreview('');
      }
    } else {
      if (name in formData) {
        // ネストされていない部分の更新
        setFormData({ ...formData, [name]: value });
      } else {
        // ネスト部分の更新
        setFormData({
          ...formData,
          profile: {
            ...formData.profile,
            [name]: value
          }
        });
      }
    }
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 画像がファイルにアップロードされた場合
    console.log(formData);
    const { username, email, role, profile } = formData;

    const userData: UpdateData = {
      username,
      email,
      role,
      profile
    };

    // 新しくアップロードされた画像がある場合
    if (profileImagePreview) {
      userData.profile.profile_image = formData.profile.profile_image;
    }

    // uidStringが存在する場合（厳密な型定義）
    if(uidString) {
      dispatch(update({userData, uidString}))
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-center mb-6">プロフィール編集</h1>
      { isLoading && <Spinner/> }
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            名前
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      {formData.role === 'student' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="affiliation">
              学校名
            </label>
            <input
              type="text"
              id="affiliation"
              name="affiliation"
              value={formData.profile.affiliation}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        {formData.role === 'recruiter' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
              会社名
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.profile.company}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            プロフィール文
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.profile.bio}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_image">
            プロフィール画像
          </label>
          <input
            type="file"
            id="profile_image"
            name="profile_image"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* アップロード後の画像 */}
        {profileImagePreview && (
          <div className="mb-4">
            <img src={profileImagePreview} alt="Profile Preview" className="w-full h-auto max-h-[200px] object-contain" />
          </div>
        )}

        {/* 既存の画像データ */}
        {profileImageUrl && !profileImagePreview && (
          <div className="mb-4">
            <img src={profileImageUrl} alt="Profile Preview" className="w-full h-auto max-h-[200px] object-contain" />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};



export default ProfileEdit;
