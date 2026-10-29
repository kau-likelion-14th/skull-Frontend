import { Routes, Route, useLocation,Navigate} from 'react-router-dom';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import MainPage from './pages/MainPage/MainPage';
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage/LoginPage";
import MyPage from "./pages/MainPage/MyPage";
import ProtectedRoute from './routes/ProtectRoute';
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';



function App() {
  const location = useLocation(); // 브라우저의 현재 주소 정보를 가져오고 주소창 값이 바뀔때마다 화면을 재렌더링
  const isLoginPage = 
    location.pathname === '/login'||
    location.pathname === '/login/oauth2/code/kakao'; // 현재 주소가 /login 인지 확인하고 True/False값 저장

  return ( //화면에 띄울 컴포넌트들
    <div className="app-container"> 
      {!isLoginPage && <Header/>} {/* 로그인 페이지면 헤더 안뜨게, isLoginPage가 False(현재주소 login아님)일때만 헤더 뜨게*/}

      <main className="main-content">
        <Routes>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/login/oauth2/code/kakao' element={<LoginPage />}/>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage/>} /> {/* 기본 화면이 로그인화면이 뜨게 */}
            <Route path='/home' element={<MainPage />} /> {/* 주소가 /home이면 mainpage 컴포넌트 렌더링 */}
            <Route path='/mypage' element={<MyPage />}/>
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/friends/:id" element={<FriendDetailPage />} /> 
          </Route>
        </Routes>
      </main>

      {!isLoginPage && <Footer/>} {/* 헤더와 마찬가지로 로그인 페이지면 푸터 안뜨게 함*/}
    </div>
  );
}

export default App;