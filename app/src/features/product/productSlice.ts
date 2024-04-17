import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";


interface FormData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  role: 'student' | 'recruiter';
  access?: string;
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

// スライスの初期ステートの型
interface AuthState {
  user?: FormData | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  myInfo: UserData | null;
  productList: Product[];
  productUser: UserData | null;
  productData: Product | null;
}

interface PostData {
  title: string;
  detail: string;
  thumbnail: File | null;
  detail_url: string;
}

interface AuthInfo {
  access: string;
  refresh: string;
}

interface Product {
  id: number;
  title: string;
  detail: string;
  thumbnail: string;
  detail_url: string;
  created_at: string;
  updated_at: string;
  user: number;
}

const user = localStorage.getItem("user")

const initialState: AuthState = {
  user: 
    user?
    JSON.parse(user) : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  myInfo: null,
  productList: [],
  productUser: null,
  productData: null
}

export const post = createAsyncThunk(
  "product/post",
  async (postData: PostData, thunkAPI) => {
    try {
      const authInfoString = localStorage.getItem("user");
      const authInfo: AuthInfo | null = authInfoString ? JSON.parse(authInfoString): null; 
      const accessToken = authInfo?.access;
      if (!accessToken) {
        return thunkAPI.rejectWithValue('アクセストークンがありません。');
      } else {
        return await productService.post(postData, accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString());
        return thunkAPI.rejectWithValue(message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)

export const fetchProductList = createAsyncThunk(
  "product/fetchProductList",
  async (_, thunkAPI) => {
    try {
        return await productService.fetchProductList();
      }
    catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString());
        return thunkAPI.rejectWithValue(message);
      } else {
        console.error(error);
        throw error;
      }
    }
  }
)

export const fetchUser = createAsyncThunk(
  "product/fetchUser",
  async (user_id: number, thunkAPI) => {
    try {
      return await productService.fetchUser(user_id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString());
        return thunkAPI.rejectWithValue(message);
      } else {
        console.error(error);
        throw error;
      }
    }
  } 
)

export const fetchMyData = createAsyncThunk(
  "product/fetchMyData",
  async (user_id: number, thunkAPI) => {
    try {
      return await productService.fetchMyData(user_id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString());
        return thunkAPI.rejectWithValue(message);
      } else {
        console.error(error);
        throw error;
      }
    }
  } 
)

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (uidString: string, thunkAPI) => {
    try {
      return await productService.fetchProduct(uidString);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error.message || error.toString());
        return thunkAPI.rejectWithValue(message);
      } else {
        console.error(error);
        throw error;
      }
    }
  } 
)

export const productSlice = createSlice({
  name: "product",
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
    .addCase(post.pending, (state) => {
      state.isLoading = true
    })
    .addCase(post.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.user = action.payload
      state.message = action.payload
    })
    .addCase(post.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(fetchProductList.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchProductList.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.productList = action.payload
    })
    .addCase(fetchProductList.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(fetchUser.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.productUser = action.payload
    })
    .addCase(fetchUser.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(fetchMyData.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchMyData.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.myInfo = action.payload
    })
    .addCase(fetchMyData.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
    .addCase(fetchProduct.pending, (state) => {
      state.isLoading = true
    })
    .addCase(fetchProduct.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.productData = action.payload
    })
    .addCase(fetchProduct.rejected, (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
    })
  },
});

export const {reset} = productSlice.actions

export default productSlice.reducer