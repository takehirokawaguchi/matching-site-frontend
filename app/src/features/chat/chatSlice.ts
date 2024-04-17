import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "./chatService";
import type { RootState } from "../../app/store";

// スライスの初期ステートの型
interface AuthState {
  user?: FormData | null;
  userData: UserData | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  messageList: MessageData[];
  messageDetail: MessageData[];
  sendMessage: FormData | null;
}

interface ProfileData {
  affiliation: string;
  company: string;
  industry: string;
  bio: string;
  profile_image: string;
}

interface UserData {
  username: string;
  email: string;
  role: string;
  profile: ProfileData | null;
}

interface MessageData {
  id: number;
  sender: number;
  sender_user: UserData;
  receiver: number;
  receiver_user: UserData;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface FormData {
  user: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
}

// 各ユーザーの最新のメッセージリストを取得
export const fetchMessageList = createAsyncThunk
<
  MessageData[],
  number,
  { rejectValue: string; state: RootState }
>(
  "chat/fetchMessageList",
  async (user_id: number, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await chatService.fetchMessageList(accessToken ,user_id);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString())
        return thunkAPI.rejectWithValue(message)
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)

// 特定ユーザーとのチャット一覧を取得
export const fetchMessageDetail = createAsyncThunk
<
  MessageData[],
  { user_id: number, uidString: string },
  { rejectValue: string; state: RootState }
>(
  "chat/fetchMessageDetail",
  async ({user_id, uidString}, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await chatService.fetchMessageDetail(accessToken, user_id, uidString);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString())
        return thunkAPI.rejectWithValue(message)
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)

// チャット相手のユーザー情報を取得
export const fetchUserData = createAsyncThunk
<
  UserData,
  string,
  { rejectValue: string; state: RootState }
>(
  "chat/fetchUserData",
  async (uidString, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await chatService.fetchUserData(accessToken, uidString);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString())
        return thunkAPI.rejectWithValue(message)
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)


// チャット相手のユーザー情報を取得
export const sendMessage = createAsyncThunk
<
  FormData,
  FormData,
  { rejectValue: string; state: RootState }
>(
  "chat/sendMessage",
  async (formData, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await chatService.sendMessage(accessToken, formData);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString())
        return thunkAPI.rejectWithValue(message)
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)

const user = localStorage.getItem("user")

const initialState: AuthState = {
  user: 
    user?
    JSON.parse(user) : null,
  userData: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  messageList: [],
  messageDetail: [],
  sendMessage: null
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.messageList = [];
      state.messageDetail = [];
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchMessageList.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchMessageList.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.messageList = action.payload
    })
    .addCase(fetchMessageList.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(fetchMessageDetail.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchMessageDetail.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.messageDetail = action.payload
    })
    .addCase(fetchMessageDetail.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(fetchUserData.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchUserData.fulfilled, (state, action) => {
      state.userData = action.payload
      state.isLoading = false
      state.isSuccess = true
    })
    .addCase(fetchUserData.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(sendMessage.pending, (state) => {
      state.isLoading = true
    })
    .addCase(sendMessage.fulfilled, (state, action) => {
      state.sendMessage = action.payload
      state.isLoading = false
      state.isSuccess = true
    })
    .addCase(sendMessage.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
  },
});

export const { reset } = chatSlice.actions

export default chatSlice.reducer