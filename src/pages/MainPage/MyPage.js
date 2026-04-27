import React from "react";
import "../../styles/MyPage.css";
import Profile from "./Profile";
import { FaSearch } from "react-icons/fa";

function MyPage() {
  return (
    <div className="mypage-container">

      
      <div className="profile-section">
        <div className="profile-left">
          <Profile />

          <div className="profile-info">
            <h2>Likelion#1253</h2>
          </div>
        </div>

        <button className="save-btn">프로필 저장</button>
      </div>

  
<div className="input-section">
  <label>한 줄 소개</label>
  <input type="text" placeholder="안녕하세요" />

  <label>좋아하는 노래</label>

  <div className="input-with-icon">
    <span className="left-icon">🎵</span>

    <input
      type="text"
      placeholder="내꺼하자 - 인피니트"
    />

    <FaSearch className="right-icon" />
  </div>
</div>

      
      <div className="card-section">
        <div className="card">
          🔥
          <p>연속 달성일</p>
          <h2>0일</h2>
        </div>

        <div className="card">
          🎯
          <p>최근 30일 달성률</p>
          <h2>0%</h2>
        </div>

        <div className="card">
          ⭐
          <p>가장 많이 완료한 요일</p>
          <h2>토요일</h2>
        </div>
      </div>

    </div>
  );
}

export default MyPage;