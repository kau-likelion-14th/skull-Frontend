import React from 'react';
import './App.css';

// 공통 레이아웃 컴포넌트
import Header from "./components/Header";
import Footer from "./components/Footer";

// 페이지 컴포넌트 import
import MainPage from './pages/MainPage/MainPage';
import MyPage from './pages/MainPage/MyPage';
import LoginPage from './pages/LoginPage/LoginPage';
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';

// react-router-dom 기능 import
import { Route, Routes, useLocation } from "react-router-dom";

function App() {

  // 현재 URL 정보 가져오기

  // 예:
  // "/login"
  // "/mypage"
  // "/friends/1"

  // 현재 어떤 페이지에 있는지 확인할 때 사용된다.
  const location = useLocation();

  // 현재 경로가 로그인 페이지인지 확인

  // true:
  // → 로그인 페이지

  // false:
  // → 일반 페이지
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app">

      {/* 
        로그인 페이지에서는 Header 숨김

        이유:
        로그인 화면은 일반 레이아웃과 다르게
        깔끔한 단독 페이지 형태로 보여주기 위함

        현재 URL이 /login 이 아니면 Header 렌더링
      */}
      {!isLoginPage && <Header />}

      <div className="content">

        {/* 
          Routes 내부에서 현재 URL과 일치하는 Route를 찾아
          해당 컴포넌트를 화면에 렌더링한다.

          즉,
          URL 변경 → 렌더링되는 페이지 변경
        */}
        <Routes>

          {/* 메인 페이지 */}
          <Route

            // URL:
            // /
            path="/"

            // 렌더링 컴포넌트:
            // MainPage
            element={<MainPage />}
          />

          {/* 마이페이지 */}
          <Route
            path="/mypage"
            element={<MyPage />}
          />

          {/* 로그인 페이지 */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* 친구 목록 페이지 */}
          <Route
            path="/friends"
            element={<FriendPage/>}
          />

          {/* 
            친구 상세 페이지

            :id 는 URL 파라미터

            예:
            /friends/1
            /friends/2

            상세 페이지 내부에서는
            useParams()를 사용해 id 값 접근 가능
          */}
          <Route
            path="/friends/:id"
            element={<FriendDetailPage />}
          />
        </Routes>
      </div>

      {/* 
        로그인 페이지에서는 Footer 숨김

        즉:
        /login 에서는
        Header/Footer 없이 로그인 화면만 표시된다.

        다른 페이지에서는 Footer 출력
      */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

// 다른 파일(main.jsx 등)에서 App 컴포넌트를 사용할 수 있도록 export
export default App;