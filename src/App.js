import React from 'react';
import './App.css';
import Header from "./components/Header";
import MainPage from './pages/MainPage/MainPage';
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import MyPage from './pages/MainPage/MyPage';

function App() {
  return (
    <div className="app">
      <Header />

      <div className="content">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
