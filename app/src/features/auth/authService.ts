import axios, { AxiosRequestConfig } from "axios";

const BACKEND_DOMAIN = "http://localhost:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
const GET_USER_INFO_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`

interface FormData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  role: 'student' | 'recruiter';
}

interface ActivateData {
  uid: string;
  token: string;
}

interface ResetPasswordConfirmData {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

interface Profile {
  affiliation: string;
  company: string;
  industry: string;
  profile_image: File | null;
}

interface UpdateData {
  username: string;
  email: string;
  role: string;
  profile: Profile;
}

// ユーザー登録
const register = async (userData: FormData) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-type": "application/json"
    }
  }

  const response = await axios.post(REGISTER_URL, userData, config)

  return response.data
}

// ログイン
const login = async (userData: Partial<FormData>) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-type": "application/json"
    }
  }

  const response = await axios.post(LOGIN_URL, userData, config)

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data))
  }

  return response.data
}

// ログアウト
const logout = () => {
  return localStorage.removeItem("user")
}

// ユーザー認証
const activate = async (userData: ActivateData) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-type": "application/json"
    }
  }

  const response = await axios.post(ACTIVATE_URL, userData, config)

  return response.data
}

// パスワードのリセット
const resetPassword = async (userData: Partial<FormData>) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-type": "application/json"
    }
  }

  const response = await axios.post(RESET_PASSWORD_URL, userData, config)

  return response.data
}

// リセットの確認
const resetPasswordConfirm = async (userData: ResetPasswordConfirmData) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-type": "application/json"
    }
  }

  const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config)

  return response.data
}

// ユーザー情報を取得
const getUserInfo = async (accessToken: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }

  const response = await axios.get(GET_USER_INFO_URL, config)

  return response.data
}

// ユーザー情報を更新
const update = async (userData: UpdateData, accessToken: string, uidString: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const UPDATE_USER_URL = `${BACKEND_DOMAIN}/api/profile/${uidString}/update/`

  const response = await axios.patch(UPDATE_USER_URL, userData, config)

  return response.data
}



const authService = {register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo, update}

export default authService;