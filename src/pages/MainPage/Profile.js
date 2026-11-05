import React, { useState, useRef, useEffect } from 'react';
import profile from "../../assets/img/profile.jpg";

import { get, put, uploadProfile} from "../../Api";
import config from "../../Config";

function Profile() {
    const fileInputRef = useRef(null);

    const[nickname, setNickname] = useState("Likelion#1253");
    const[intro,setIntro] = useState("안녕하세요");
    const[song, setSong] = useState("내꺼하자 - 인피니트");

    const[profileImageUrl, setProfileImageUrl] = useState(null);
    const[previewUrl, setPreviewUrl] = useState(null); 

    useEffect(() => {
        fetchProfileDeta();
    }, []);


        const fetchProfileDeta = async() => {
        try {
            const response = await get(config.PROFILE.GET);

            const result = response?.result;

            console.log("프로필 데이터:", result);

            if(!result) return;

            setNickname(result.username ?? "");
            setIntro(result.intro ?? "");
            setProfileImageUrl(result.profileImageUrl ?? null);

            const songResponse = await get(config.YUTUBE.ME);

            if(
                songResponse?.isSuccess === false ||
                !Array.isArray(songResponse?.result)
            ) {
                throw new Error("유효하지 않은 노래 데이터 형식");
            }

            const songs = [...songResponse.result].sort(
                (a,b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            const latest = songs[0];

            setSong(latest? `${latest.title}` - `${latest.artist}` : "");
        } catch(error){
            console.error("프로필 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    const handleClickEditIcon = () => fileInputRef.current?.click();
    
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setPreviewUrl(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        sessionStorage.setItem('intro', intro);
        sessionStorage.setItem('song', song);
        sessionStorage.setItem('previewUrl', previewUrl);
        
        alert("저장되었습니다!");
    };

    const displayImageSrc = previewUrl || profileImageUrl || profile;

    return (
        <section className="profile-section">
            <div className="profile-header">
                <div className="profile-img-wrapper">
                    <img src={displayImageSrc} alt="프로필" className="profile-img" />
                    <button className="edit-icon" onClick={handleClickEditIcon}>✎</button>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
                <h2 className="profile-nickname">{nickname}</h2>
                <button className="profile-save-btn" onClick={handleSave}>프로필 저장</button>
            </div>

            <div className="profile-input-container">
                <div className="profile-input-group">
                    <label>한 줄 소개</label>
                    <input type="text" value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="안녕하세요" />
                </div>

                <div className="profile-input-group">
                    <label>좋아하는 노래</label>
                    <div className="song-input-wrapper">
                        <span className="song-icon-left">🎵</span>
                        <input type="text" value={song} onChange={(e) => setSong(e.target.value)} placeholder="내꺼하자 - 인피니트" className="song-input" />
                        <span className="song-icon-right">🔍</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;