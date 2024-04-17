import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import type { RootState } from "../../app/store";


interface FormData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  role: 'student' | 'recruiter';
  access?: string;
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

interface UserInfo {
  username: string;
  role: string;
  id: number;
  email: string;
}

// スライスの初期ステートの型
interface AuthState {
  user?: FormData | null;
  userInfo: UserInfo | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const user = localStorage.getItem("user")

const initialState: AuthState = {
  user: 
    user?
    JSON.parse(user) : null,
  userInfo: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

export const register = createAsyncThunk(
  "auth/register",
  async (userData: FormData, thunkAPI) => {
    try {
      return await authService.register(userData)
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

export const login = createAsyncThunk(
  "auth/login",
  async (userData: Partial<FormData>, thunkAPI) => {
    try {
      return await authService.login(userData)
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message: string = (error.message || error.toString())
        return thunkAPI.rejectWithValue(message)
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    authService.logout();
  }
)

export const activate = createAsyncThunk(
  "auth/activate",
  async (userData: ActivateData, thunkAPI) => {
    try {
      return await authService.activate(userData)
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

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData: Partial<FormData>, thunkAPI) => {
    try {
      return await authService.resetPassword(userData)
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

export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (userData: ResetPasswordConfirmData, thunkAPI) => {
    try {
      return await authService.resetPasswordConfirm(userData)
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

export const getUserInfo = createAsyncThunk
<
  UserInfo,
  void,
  { rejectValue: string; state: RootState }
>(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await authService.getUserInfo(accessToken);
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

export const update = createAsyncThunk
<
  UserInfo,
  { userData: UpdateData, uidString: string },
  { rejectValue: string; state: RootState }
>(
  "auth/update",
  async ({ userData, uidString } , thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.user?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await authService.update(userData, accessToken, uidString);
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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {
      state.isLoading = true
    })
    .addCase(register.fulfilled, (state) => {
      state.isLoading = false
      state.isSuccess = true
    })
    .addCase(register.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
      state.user = null
    })
    .addCase(login.pending, (state) => {
      state.isLoading = true
    })
    .addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.user = action.payload
    })
    .addCase(login.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
      state.user = null
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null
      state.userInfo = null
    })
    .addCase(activate.pending, (state) => {
      state.isLoading = true
    })
    .addCase(activate.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.user = action.payload
    })
    .addCase(activate.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
      state.user = null
    })
    .addCase(resetPassword.pending, (state) => {
      state.isLoading = true
    })
    .addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false
      state.isSuccess = true
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
      state.user = null
    })
    .addCase(resetPasswordConfirm.pending, (state) => {
      state.isLoading = true
    })
    .addCase(resetPasswordConfirm.fulfilled, (state) => {
      state.isLoading = false
      state.isSuccess = true
    })
    .addCase(resetPasswordConfirm.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
      state.user = null
    })
    .addCase(getUserInfo.pending, (state) => {
      state.isLoading = true
    })
    .addCase(getUserInfo.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.userInfo = action.payload
    })
    .addCase(getUserInfo.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
    })
    .addCase(update.pending, (state) => {
      state.isLoading = true
    })
    .addCase(update.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.userInfo = action.payload
    })
    .addCase(update.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = action.payload as string
    })
  },
});

export const {reset} = authSlice.actions

export default authSlice.reducer