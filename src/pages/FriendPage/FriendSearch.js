import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

// 실제 서버 데이터 대신 임시로 사용하는 더미 사용자 데이터
// 검색 시 여기 있는 배열을 기준으로 filter()가 동작한다.
const dummyUsers = [
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
];

function FriendSearch({

  // 부모 컴포넌트에서 전달받는 props
  // title : 검색 영역 제목
  // placeholder : input placeholder 문구
  // onFollow : 팔로우 버튼 클릭 시 실행할 함수
  // followingList : 이미 팔로우 중인 친구 목록

  // 기본값 설정
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow,
  followingList = [],
}) {

  // 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // 검색창 입력값을 저장하는 state
  // 사용자가 input에 입력할 때마다 값이 변경된다.
  const [query, setQuery] = useState("");

  // 이미 팔로우 중인 유저 id들을 Set으로 저장
  // 배열.includes()보다 빠르게 팔로우 여부를 확인하기 위해 사용

  // useMemo를 사용했기 때문에
  // followingList가 바뀔 때만 새로 계산된다.
  const followingIdSet = useMemo(() => {

    // followingList 배열에서 id만 추출


    return new Set(followingList.map((x) => x.id));

  }, [followingList]);

  // 검색 결과 계산

  // query가 바뀔 때마다 실행된다.
  // 즉,
  // 사용자가 검색창에 입력할 때마다 filter()가 다시 동작한다.
  const results = useMemo(() => {

    // 앞뒤 공백 제거
    const q = query.trim();

    // 검색어가 비어있으면 결과를 빈 배열로 반환
    // 화면에는 검색 결과 영역이 표시되지 않는다.
    if (!q) return [];

    // dummyUsers 배열을 filter()로 검색
    return dummyUsers.filter((user) => {

      // 이름 포함 여부
      // 태그 포함 여부
      // 이름#태그 형태 포함 여부 검사

      // true를 반환한 데이터만 results 배열에 포함된다.

      return (
        user.name.includes(q) ||
        user.tag.includes(q) ||
        `${user.name}#${user.tag}`.includes(q)
      );
    });

  }, [query]);

  // 친구 클릭 시 상세 페이지 이동
  const goFriendDetail = (friend) => {

    // state로 friend 객체 전달

    // 상세 페이지에서:
    // location.state.friend 로 데이터 사용 가능
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-search">

      {/* 검색 영역 제목 */}
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">

        {/* 검색 아이콘 */}
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        <input
          className="friend-search__input"

          // 현재 input 값
          // query state와 연결되어 있다.
          value={query}

          // 입력값 변경 시 실행
          onChange={(e) =>

            // 입력한 값으로 query state 변경

            // state가 변경되면 컴포넌트가 다시 렌더링되고
            // useMemo(results)가 다시 실행된다.

            // 결과적으로 검색 결과 UI가 실시간으로 변경된다.
            setQuery(e.target.value)
          }

          placeholder={placeholder}
        />
      </div>

      {/* 
        조건부 렌더링 흐름

        1. 검색어가 비어있으면 아무것도 안 보여줌
        2. 검색 결과가 없으면 "검색 결과 없음"
        3. 결과가 있으면 리스트 출력
      */}
      {query.trim() === "" ? null : results.length === 0 ? (

        // 검색 결과가 없을 때
        <div className="friend-search__empty">검색 결과가 없습니다.</div>

      ) : (

        // 검색 결과 리스트 출력
        <ul className="friend-search__list">

          {/* 
            results 배열을 map()으로 순회하면서
            사용자 카드 UI를 생성한다.

            배열 데이터 개수만큼 화면 요소가 생성된다.
          */}
          {results.map((user) => {

            // 현재 유저가 이미 팔로우 상태인지 확인
            // true면 버튼 비활성화
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">

                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}

                  // 클릭 시 상세 페이지 이동
                  onClick={() => goFriendDetail(user)}

                  // 키보드 접근성 지원
                  // Enter 또는 Space 입력 시 상세 페이지 이동
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >

                  <div className="friend-avatar" aria-hidden="true">

                    {/* 
                      프로필 이미지 존재 여부에 따라 UI 변경

                      있으면 실제 이미지 출력
                      없으면 기본 UserIcon 출력
                    */}
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">

                    {/* 이름 + 태그 */}
                    <div className="friend-info__top">

                      {/* user.name 출력 */}
                      <span className="friend-info__name">{user.name}</span>

                      {/* user.tag 출력 */}
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>

                    {/* 소개글 출력 */}
                    <div className="friend-info__bio">

                      {/* bio가 없으면 기본 문구 출력 */}
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"

                  // 이미 팔로우 중이면 is-disabled 클래스 추가
                  // 버튼 스타일이 달라진다.
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : ""
                  }`}

                  onClick={(e) => {

                    // 버튼 클릭 시 부모 클릭 이벤트 방지
                    // 없으면 상세 페이지 이동까지 같이 실행된다.
                    e.stopPropagation();

                    // 부모 컴포넌트의 팔로우 함수 실행

                    // 일반적인 흐름:
                    // 1. followingList state 변경
                    // 2. FriendSearch props 재전달
                    // 3. followingIdSet 재계산
                    // 4. 버튼이 "팔로우" → "팔로잉"으로 변경
                    onFollow?.(user);
                  }}

                  // 이미 팔로우 중이면 버튼 비활성화
                  disabled={isFollowing}
                >

                  {/* 
                    상태에 따라 버튼 텍스트 변경

                    true  → 팔로잉
                    false → 팔로우
                  */}
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function UserIcon() {

  // 프로필 이미지가 없는 경우 출력되는 기본 SVG 아이콘
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

// 다른 파일에서 FriendSearch를 사용할 수 있도록 export
export default FriendSearch;