import React from 'react';
import Profile from './Profile';
import Status from './Status';
import '../../styles/MyPage.css';

function MyPage() {
    return (
        <div className="mypage-container">
            <div className="mypage-content">
                <Profile />
                <Status />
            </div>
        </div>
    );
}

export default MyPage;