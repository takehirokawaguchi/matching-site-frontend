import { useAppSelector } from "../app/hooks";
import { Outlet, Navigate } from 'react-router-dom';
  
const PrivateLayout = () => {
  // ログインしているとユーザーが非nullとなる
  const { user } = useAppSelector((state) => state.auth);

  if(!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet/>;
};

export default PrivateLayout;