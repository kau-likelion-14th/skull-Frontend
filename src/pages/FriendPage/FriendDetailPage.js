import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 친구 상세 페이지 내부에서 사용하는 컴포넌트 import
import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

// Todo 카테고리별 스타일 객체

// FriendTodo 컴포넌트에 props로 전달되어
// 카테고리에 따라 배경색과 글자색이 달라진다.
const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// Date 객체를 문자열 key 형태로 변환하는 함수

// 예:
// new Date("2026-05-04")
// ↓
// "2026-05-04"

// 날짜별 todo 데이터를 찾을 때 사용된다.
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 상세 페이지로 전달된 데이터가 없을 경우 사용하는 기본 친구 데이터
const dummyFriend = {
  followId: "1",
  name: "나나",
  tag: "1234",
  bio: "안녕하세요! 저는 나나입니다.",
  profileImage: null,
};

// 친구가 저장한 음악 더미 데이터
const dummySavedSongs = [
  {
    id: 1,
    title: "Ditto",
    artist: "NewJeans",
    imageUrl: null,
  },
];

// 날짜별 Todo 데이터
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
    { id: 2, text: "FriendDetailPage 주석 달기", category: "공부", completed: false },
  ],
  "2026-05-06": [
    { id: 3, text: "친구 페이지 과제 제출", category: "동아리", completed: true },
  ],
  "2026-05-10": [
    { id: 4, text: "React 복습하기", category: "공부", completed: false },
    { id: 5, text: "동아리 회의", category: "동아리", completed: false },
    { id: 6, text: "산책하기", category: "일상", completed: true },
  ],
};

// 날짜별 남은 todo 개수 데이터
const dummyRemainingByDate = {
  "2026-05-04": { hasTodo: true, remaining: 1 },
  "2026-05-06": { hasTodo: true, remaining: 0 },
  "2026-05-10": { hasTodo: true, remaining: 2 },
};

function FriendDetailPage() {

  // 페이지 이동 함수
  const navigate = useNavigate();

  // 이전 페이지에서 전달한 state 접근
  const location = useLocation();

  // FriendList 또는 FriendSearch에서
  // navigate(..., { state: { friend } })
  // 형태로 전달한 friend 데이터 가져오기

  // 데이터가 없으면 null
  const passedFriend = location.state?.friend ?? null;

  // 친구 정보 state

  // 전달받은 friend가 있으면 사용
  // 없으면 dummyFriend 사용
  const [friend] = useState(passedFriend ?? dummyFriend);

  // 저장된 음악 state
  const [savedSongs] = useState(dummySavedSongs);

  // 현재 선택된 날짜 state

  // 달력에서 날짜 클릭 시 변경된다.
  // state가 변경되면:
  // → todos useMemo 재실행
  // → 해당 날짜 todo 목록으로 화면 변경
  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-04"));

  // 현재 달력에서 보고 있는 월 state
  const [viewDate, setViewDate] = useState(new Date("2026-05-04"));

  // 날짜별 todo 데이터 state
  const [todosByDate] = useState(dummyTodosByDate);

  // 날짜별 남은 todo 개수 state
  const [remainingByDate] = useState(dummyRemainingByDate);

  // 가장 최근 저장된 음악 계산

  // savedSongs가 변경될 때만 다시 계산된다.
  const latestSong = useMemo(() => {

    // 배열이 아니거나 비어있으면 null
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;

    // 첫 번째 곡 반환
    return savedSongs[0];

  }, [savedSongs]);

  // 현재 선택된 날짜의 todo 목록 계산
  const todos = useMemo(() => {

    // selectedDate를 문자열 key로 변환
    const key = toDateKey(selectedDate);

    // 해당 날짜의 todo 배열 반환
    // 없으면 빈 배열
    return todosByDate[key] ?? [];

  }, [selectedDate, todosByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">

        {/* 상단 프로필 영역 */}
        <div className="friend-detail-page__top">

          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"

            // 이전 페이지로 이동
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          {/* 친구 프로필 영역 */}
          <div className="friend-detail-page__profile">

            <div className="friend-detail-page__avatar" aria-hidden="true">

              {/* 
                프로필 이미지가 있으면 이미지 출력
                없으면 기본 UserIcon 출력

                데이터 상태에 따라 UI가 달라진다.
              */}
              {friend?.profileImage ? (
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">

              {/* 이름 영역 */}
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">

                  {/* 친구 이름 출력 */}
                  {friend?.name || " "}
                </span>
              </div>

              {/* 소개글 출력 */}
              <div className="friend-detail-page__bio">

                {/* 소개글이 없으면 기본 문구 출력 */}
                {friend?.bio || "한 줄 소개"}
              </div>
            </div>
          </div>

          {/* 저장한 음악 영역 */}
          <div className="friend-detail-page__songs-inline">

            {/* 저장된 곡이 존재할 경우 */}
            {latestSong ? (

              <div className="friend-detail-page__song-inline-item">

                <div className="friend-detail-page__song-inline-cover">

                  {/* 앨범 이미지 존재 시 출력 */}
                  {latestSong?.imageUrl ? (
                    <img
                      src={latestSong.imageUrl}
                      alt={latestSong.title || "album"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : null}
                </div>

                <div className="friend-detail-page__song-inline-info">

                  {/* 노래 제목 */}
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>

                  {/* 아티스트 이름 */}
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>

            ) : (

              // 저장된 음악이 없을 경우
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 하단 캘린더 + Todo 영역 */}
        <div className="friend-detail-page__grid">

          {/* 캘린더 컴포넌트 */}
          <div className="friend-detail-page__calendar">

            <FriendCalendar

              // 초기 날짜 전달
              initialDate={selectedDate}

              // 날짜 클릭 시 실행되는 함수 전달
              onDateChange={(date) =>

                // 날짜가 존재할 경우 selectedDate state 변경
                // → todos useMemo 재실행
                // → Todo 목록 화면 변경
                date && setSelectedDate(date)
              }

              // 달 이동 시 실행
              onMonthChange={(date) => {
                if (!date) return;

                // 현재 보고 있는 달 state 변경
                setViewDate(date);
              }}

              // 날짜별 todo 데이터 전달
              todosByDate={todosByDate}

              // 날짜별 남은 todo 데이터 전달
              remainingByDate={remainingByDate}
            />
          </div>

          {/* Todo 리스트 영역 */}
          <div className="friend-detail-page__todo">

            <FriendTodo

              // Todo 제목
              title="To do List"

              // 현재 선택 날짜의 todo 배열 전달
              // selectedDate 변경 시 자동 변경됨
              todos={todos}

              // 카테고리 스타일 정보 전달
              categories={Categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {

  // 프로필 이미지가 없을 경우 출력되는 기본 SVG 아이콘
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 다른 파일에서 FriendDetailPage를 사용할 수 있도록 export
export default FriendDetailPage;