import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { reset, post } from '../../features/product/productSlice';
import Spinner from '../Spinner';

interface PostData {
  title: string;
  detail: string;
  thumbnail: File | null;
  detail_url: string;
}

const ProductPost: React.FC = () => {
  const [formData, setFormData] = useState<PostData>({
    title: '',
    detail: '',
    thumbnail: null,
    detail_url: '',
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {user, isLoading, isError, isSuccess, message} = useAppSelector(
    (state) => state.product
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFormData({
          ...formData,
          thumbnail: files[0]
        });
        setThumbnail(files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      } else {
        setThumbnail(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, detail, thumbnail, detail_url } = formData;
    const postData: PostData = {
      title,
      detail,
      thumbnail,
      detail_url
    };

    dispatch(post(postData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      navigate("/");
      toast.success('投稿が完了しました！');
      dispatch(reset());
    }

  }, [isError, isSuccess, user, navigate, dispatch, message])

  return (
    <div className="container mx-auto mt-10 w-full md:w-3/5">
      <h1 className="text-2xl font-bold mb-5 flex justify-center">プロダクトを投稿</h1>
      { isLoading && <Spinner/> }
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">タイトル</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-6">
          <label htmlFor="detail" className="block text-gray-700 text-sm font-bold mb-2">詳細</label>
          <textarea id="detail" name="detail" value={formData.detail} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={5}/>
        </div>
        <div className="mb-6">
          <label htmlFor="thumbnail" className="block text-gray-700 text-sm font-bold mb-2">サムネイル</label>
          <input type="file" id="thumbnail" name="thumbnail" onChange={handleChange} className="w-full"/>
        </div>
        {thumbnailPreview && (
          <div className="mb-6">
            <img src={thumbnailPreview} alt="Profile Preview" className="w-full h-auto max-h-[200px] object-contain" />
          </div>
        )}
        <div className="mb-6">
          <label htmlFor="detail_url" className="block text-gray-700 text-sm font-bold mb-2">詳細URL</label>
          <input type="text" id="detail_url" name="detail_url" value={formData.detail_url} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform focus:outline-none focus:shadow-outline">投稿</button>
        </div>
      </form>
    </div>
  );
};

export default ProductPost;
