
import React, { useState, useRef, useEffect } from "react";
import profile from "../../assets/img/profile.jpg";
import { get, put, uploadProfile, post } from "../../Api";
import config from "../../Config";

function Profile() {
    const fileInputRef = useRef(null);

    // 프로필 상태
    const [nickname, setNickname] = useState("Likelion#1253");
    const [intro, setIntro] = useState("안녕하세요");

    // 노래 검색 상태
    const [song, setSong] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    // 프로필 이미지 상태
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // 프로필 데이터 및 저장된 노래 조회
    const fetchProfileDeta = async () => {
        try {
            // 프로필 정보 조회
            const response = await get(config.PROFILE.GET);
            const result = response?.result;

            console.log("프로필 데이터:", result);

            if (result) {
                setNickname(result.username ?? "");
                setIntro(result.introduction ?? "");
                setProfileImageUrl(result.profileImageUrl ?? null);
            }

            // 저장된 노래 조회
            const songResponse = await get(config.YOUTUBE.ME);

            console.log("저장된 노래 데이터:", songResponse);

            if (
                songResponse?.isSuccess === false ||
                !Array.isArray(songResponse?.result)
            ) {
                throw new Error("저장된 노래 조회 실패");
            }

            // 저장된 날짜 기준 최신순 정렬
            const songs = [...songResponse.result].sort(
                (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt)
            );

            // 가장 최근에 저장한 노래 표시
            const latest = songs[0];

            setSong(
                latest ? `${latest.title} - ${latest.artist}` : ""
            );

        } catch (error) {
            console.error(
                "프로필 또는 노래 데이터를 가져오는 중 오류 발생:",
                error
            );
        }
    };

    // 페이지 처음 실행될 때 프로필 및 노래 조회
    useEffect(() => {
        fetchProfileDeta();
    }, []);

    // 프로필 이미지 선택 버튼
    const handleClickEditIcon = () => {
        fileInputRef.current?.click();
    };

    // 이미지 미리보기 및 파일 저장
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setSelectedImageFile(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };

        reader.readAsDataURL(file);
    };

    // 프로필 저장
    const handleSave = async () => {
        try {
            // 한 줄 소개 저장
            await put(config.PROFILE.INTRO, {
                introduce: intro,
            });

            // 프로필 이미지 저장
            if (selectedImageFile) {
                await uploadProfile(
                    config.PROFILE.PUT,
                    {
                        imageFile: selectedImageFile,
                    },
                    {
                        imageField: "image",
                    }
                );
            }

            // 저장 후 최신 프로필 데이터 조회
            await fetchProfileDeta();

            setPreviewUrl(null);
            setSelectedImageFile(null);

            // 같은 파일을 다시 선택할 수 있도록 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            alert("프로필이 저장되었습니다!");

        } catch (error) {
            console.error("프로필 저장 오류:", error);
            console.error("서버 응답:", error?.response?.data);

            const message =
                error?.response?.data?.message ??
                "프로필 저장 중 오류가 발생했습니다.";

            alert(message);
        }
    };

    // 노래 검색
    const handleSearchSong = async () => {
        if (!song.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }

        try {
            const response = await get(
                config.YOUTUBE.SEARCH,
                { q: song.trim() }
            );

            console.log("노래 검색 결과:", response);

            const results = response?.result ?? [];

            setSearchResults(results);
            setShowSearchResults(true);

        } catch (error) {
            console.error("노래 검색 중 오류 발생:", error);
            alert("노래 검색 중 오류가 발생했습니다.");
        }
    };

    // 검색 결과에서 노래 선택
    const handleSelectSong = (picked) => {
        setSelectedSong(picked);

        setSong(`${picked.title} - ${picked.artist}`);

        setShowSearchResults(false);
    };

    // 선택한 노래 저장
    const handleSaveSong = async () => {
        if (!selectedSong) {
            alert("먼저 저장할 노래를 선택해주세요.");
            return;
        }

        try {
            await post(config.YOUTUBE.SAVE, {
                songId: selectedSong.songId,
                title: selectedSong.title,
                artist: selectedSong.artist,
            });

            console.log("노래 저장 성공");

            // 저장 후 서버에서 최신 노래 정보 다시 조회
            await fetchProfileDeta();

            setSelectedSong(null);

            alert("좋아하는 노래가 저장되었습니다!");

        } catch (error) {
            console.error("노래 저장 중 오류 발생:", error);

            const message =
                error?.response?.data?.message ??
                "노래 저장 중 오류가 발생했습니다.";

            alert(message);
        }
    };

    // 프로필 이미지 표시 우선순위
    const displayImageSrc =
        previewUrl || profileImageUrl || profile;

    return (
        <section className="profile-section">

            {/* 프로필 헤더 */}
            <div className="profile-header">

                <div className="profile-img-wrapper">

                    <img
                        src={displayImageSrc}
                        alt="프로필"
                        className="profile-img"
                    />

                    <button
                        type="button"
                        className="edit-icon"
                        onClick={handleClickEditIcon}
                    >
                        ✎
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                </div>

                <h2 className="profile-nickname">
                    {nickname}
                </h2>

                <button
                    type="button"
                    className="profile-save-btn"
                    onClick={handleSave}
                >
                    프로필 저장
                </button>

            </div>

            {/* 프로필 입력 영역 */}
            <div className="profile-input-container">

                {/* 한 줄 소개 */}
                <div className="profile-input-group">

                    <label>한 줄 소개</label>

                    <input
                        type="text"
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder="안녕하세요"
                    />

                </div>

                {/* 좋아하는 노래 */}
                <div className="profile-input-group">

                    <label>좋아하는 노래</label>

                    <div className="song-input-wrapper">

                        <span className="song-icon-left">
                            🎵
                        </span>

                        <input
                            type="text"
                            value={song}
                            placeholder="좋아하는 노래를 검색해보세요"
                            className="song-input"
                            onChange={(e) => {
                                setSong(e.target.value);
                                setSelectedSong(null);
                                setShowSearchResults(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearchSong();
                                }
                            }}
                        />

                        <button
                            type="button"
                            className="song-icon-right"
                            onClick={handleSearchSong}
                        >
                            🔍
                        </button>

                    </div>

                    {/* 노래 검색 결과 */}
                    {showSearchResults && (
                        <div className="song-search-results">

                            {searchResults.length === 0 ? (
                                <p>검색 결과가 없습니다.</p>
                            ) : (
                                searchResults.map((item) => (
                                    <div
                                        key={item.songId}
                                        className="song-search-item"
                                        onClick={() => handleSelectSong(item)}
                                    >
                                        {item.title} - {item.artist}
                                    </div>
                                ))
                            )}

                        </div>
                    )}

                    {/* 선택한 노래 저장 */}
                    {selectedSong && (
                        <button
                            type="button"
                            className="song-save-btn"
                            onClick={handleSaveSong}
                        >
                            선택한 노래 저장
                        </button>
                    )}

                </div>

            </div>

        </section>
    );
}

export default Profile;
