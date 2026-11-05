import React, { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import api from "../../Api";
import config from "../../Config"
import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const toDateKey = (date) => { // date 객체를 받아서 "YYYY-MM-DD" 형태의 문자열로 변환해주는 함수
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function useFriendResource(url, params, validate, retry){
  const [state, setState] = useState({loading:true, error:"", value:null});
  const query = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setState({loading:true, error: "", value: null});

    api.get(url, {params:JSON.parse(query), signal:controller.signal})
    .then(({data}) => {
      if(data?.isSuccess === false || !validate(data?.result)){
        throw new Error("잘못된 응답");
      }
      if(active){
        setState({loading:false, error:"", value:data?.result});
      }
    })
    .catch(() => {
      if(active){
        setState({loading: false, error:"데이터를 불러오지 못했습니다.", value:null})
      }
    });
    return() => {
      active = false;
      controller.abort();
    };

  }, [url, query, validate, retry]);
  return state;
}

const validProfile = (value) => typeof value?.username === "string";

const validTodos = (value) =>
  Array.isArray(value) &&
value.every((todo) =>
todo?.todoId != null &&
typeof todo.description === "string" &&
typeof todo.completed === "boolean");

const validCalenddar = (value) =>
  Array.isArray(value?.days) &&
  value.days.every((day) =>
    typeof day?.date === "string" &&
    typeof day?.hasTodo === "boolean" &&
    Number.isFinite(day.remaining)
  );


function ResourceState({resource, onRetry}){
  if(resource.loading){
    return <p role="status">불러오는 중...</p>
  }
  if(resource.error){
    return(
      <div>
        <p  role="alert">
          {resource.error}
        </p>
        <button onClick={onRetry}>다시 시도</button>
      </div>
    );
  }
  return null;
}

function FriendDetailPage() {
  const navigate = useNavigate();
  
  const {id} = useParams();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(()=>new Date());
  const [retries, setRtries] = useState({profile:0, todos:0, calendar:0});
  const retry = (key) => setRtries((prev) => ({...prev, [key]: prev[key] + 1}));

  const base = config.FOLLOW.PROFILE(id);
  const profile = useFriendResource(base, {}, validProfile, retries.profile);
  const todoResource = useFriendResource(
    config.FOLLOW.TODOS(id),
  { date: toDateKey(selectedDate) },
  validTodos,
  retries.todos
  );

  const friend = profile.value ? {
    name : profile.value.username.split("#")[0],
    bio : profile.value.introduction,
    profileImage : profile.value.profileImageUrl,
  }: null;

  const todos = (todoResource.value || []).map ((todo) =>({
    id: todo.todoId,
    text: todo.description,
    category: todo.categoryName,
    completed : todo.completed,
  }));

  const calendar = useFriendResource(
    config.FOLLOW.CALENDAR(id),
    {year: viewDate.getFullYear(), month: viewDate.getMonth() +1},
    validCalenddar,
    retries.calendar
  );
  const remainingByDate = Object.fromEntries(
    (calendar.value?.days || []).map((day) => [day.date, day])
  );

  return ( // 화면에 띄울 요소들
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        <div className="friend-detail-page__top">
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)} // 이 버튼을 클릭하면 브라우저 히스토리를 1단계 뒤로 되돌려 이전 페이지로 화면이 전환됨
          >
            ‹
          </button>

          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {friend?.profileImage ? ( // 프로필 이미지 데이터가 있으면 img 태그 화면을 렌더링하고 없으면 기본 아이콘 컴포넌트를 렌더링
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
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">
                  {friend?.name || " "} {/* 위에서 초기화한 friend state에서 이름 데이터를 꺼내와 화면에 출력 */}
                </span>
              </div>
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"} {/* bio 데이가 있으면 출력, 없으면 '한 줄 소개' 출력 */}
              </div>
            </div>
          </div>
          <ResourceState resource={profile} onRetry={()=> retry("profile")}/>
        </div>
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <ResourceState resource={calendar} onRetry={()=> retry("calendar")}/>
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)} // 자식 컴포넌트에서 특정 날짜를 마우스로 클릭하면 이 함수가 실행되어 부모의 selectedDate state가 바뀜 > 전체 화면이 재렌더링되며 오른쪽 투두 리스트가 클릭한 날짜에 맞게 변경됨 
              onMonthChange={(date) => {
                if (!date) return;
                setViewDate(date);
              }}
              remainingByDate={remainingByDate}
            />
          </div>

          <div className="friend-detail-page__todo">
            <ResourceState resource={todoResource} onRetry={()=> retry("todos")}/>
            <FriendTodo
              title="To do List"
              todos={todos} // 위쪽의 usememo에서 뽑아낸 클릭된 날짜의 투두 배열을 자식에게 props로 넘겨주오 화면에 리스트를 그리게 함
              categories={Categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
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

export default FriendDetailPage;