import axios, { AxiosRequestConfig } from "axios";

const BACKEND_DOMAIN = "http://localhost:8000"

const PRODUCT_URL = `${BACKEND_DOMAIN}/api/products/`

interface PostData {
  title: string;
  detail: string;
  thumbnail: File | null;
  detail_url: string;
}

// プロダクトを投稿
const post = async (postData: PostData, accessToken: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const response = await axios.post(PRODUCT_URL, postData, config)

  return response.data
}

// プロダクト一覧を取得
const fetchProductList = async () => {

  const response = await axios.get(PRODUCT_URL)

  return response.data
}

// ユーザー情報を取得
const fetchUser = async (user_id: number) => {

  const USER_URL = `${BACKEND_DOMAIN}/api/profile/${user_id}/`

  const response = await axios.get(USER_URL)

  return response.data
}

// 自身のユーザー情報を取得
const fetchMyData = async (user_id: number) => {

  const USER_URL = `${BACKEND_DOMAIN}/api/profile/${user_id}/`

  const response = await axios.get(USER_URL)

  return response.data
}

// プロダクト情報を取得
const fetchProduct = async (uidString: string) => {

  const PRODUCT_URL = `http://127.0.0.1:8000/api/products/${uidString}/`

  const response = await axios.get(PRODUCT_URL)

  return response.data
}

const productService = { post, fetchProductList, fetchUser, fetchMyData, fetchProduct }

export default productService;