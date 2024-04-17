// 後々ProfileViewに統合
import React from 'react'

interface AuthInfo {
  access: string;
  refresh: string;
}

const MyPage = () => {

  const authInfoString = localStorage.getItem("user");
  const authInfo: AuthInfo | null = authInfoString ? JSON.parse(authInfoString): null; 
  const accessToken = authInfo?.access;
  
  

  

    return (
        <div>
            <h1>accessToken: {accessToken} </h1>
        </div>
    )
}

export default MyPage