import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Nav from './components/navigation/Nav';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';
import ResetPasswordConfirmPage from './components/Auth/ResetPasswordConfirmPage';
import ActivatePage from './components/Auth/ActivatePage';
import ProductList from './components/Product/ProductList';
import ProductPost from './components/Product/ProductPost';
import ProductDetail from './components/Product/ProductDetail';
// import ProfileView from './components/Profile/ProfileView';
import ProfileEdit from './components/Profile/ProfileEdit';
import NotFoundPage from './components/Auth/NotFoundPage';
import Messages from './components/Chatroom/Messages';
import MessageDetail from './components/Chatroom/MessageDetail';
import PrivateLayout from './layout/privateLayout';
import PublicLayout from './layout/publicLayout';

function App() {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<ProductList />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
            <Route path="/activate/:uid/:token" element={<ActivatePage />} />
            {/* <Route path="/profile" element={<ProfileView />} /> */}
          </Route>
          <Route element={<PrivateLayout />}>
            {/* ログインしていない場合、/loginにリダイレクトする */}
            <Route path="/profile/:uid/edit" element={<ProfileEdit />} />
            <Route path="/products/post" element={<ProductPost />} />
            <Route path="/products/:uid" element={<ProductDetail />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:uid" element={<MessageDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
    </>
  );
}

export default App;
