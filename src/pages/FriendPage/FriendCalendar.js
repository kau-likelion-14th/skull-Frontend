import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

// Date 객체를 "2026-05-04" 형태의 문자열로 변환하는 함수
// 날짜를 객체 그대로 비교하기 어렵기 때문에
// 문자열 key 형태로 변환해서 todos 데이터를 찾기 쉽게 만든다.
const toDateKey = (date) => {

  // 연도 추출
  const y = date.getFullYear();

  // 월 추출
  // getMonth()는 0부터 시작하기 때문에 +1 필요
  // padStart(2, "0")을 사용해서 1 → "01" 형태로 변환
  const m = String(date.getMonth() + 1).padStart(2, "0");

  // 날짜 추출
  // 한 자리 숫자는 앞에 0 추가
  const d = String(date.getDate()).padStart(2, "0");

  // 최종 결과:
  // "2026-05-04" 형태 반환
  return `${y}-${m}-${d}`;
};

// 날짜별 Todo 더미 데이터

// key:
// 날짜 문자열

// value:
// 해당 날짜의 todo 배열
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true },
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

export default function FriendCalendar() {

  // 현재 선택된 날짜를 저장하는 state

  // 초기값:
  // new Date() → 오늘 날짜

  // 사용자가 달력 날짜를 클릭하면
  // setSelectedDate()로 값이 변경된다.

  // state가 변경되면 컴포넌트가 다시 렌더링되고
  // 선택된 날짜 UI도 함께 변경된다.
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 날짜 클릭 시 실행되는 함수
  const handleDateChange = (value) => {

    // react-calendar는 상황에 따라
    // Date 객체 또는 배열을 반환할 수 있다.

    // 단일 날짜 선택이면 Date
    // 기간 선택이면 배열

    // 현재는 단일 날짜만 사용하므로
    // Date 객체만 추출
    const next = value instanceof Date ? value : value?.[0];

    // 값이 없으면 종료
    if (!next) return;

    // 선택된 날짜 state 변경

    // state 변경 흐름:
    // 1. selectedDate 값 변경
    // 2. 컴포넌트 재렌더링
    // 3. Calendar의 value가 변경됨
    // 4. 화면에서 선택된 날짜 표시가 바뀜
    setSelectedDate(next);
  };

  // 특정 날짜의 todo 상태를 계산하는 함수
  const getDayMeta = (date) => {

    // Date 객체를 문자열 key로 변환
    const key = toDateKey(date);

    // 해당 날짜의 todo 목록 가져오기
    // 없으면 빈 배열 사용
    const list = dummyTodosByDate[key] ?? [];

    // todo가 하나도 없는 경우
    if (list.length === 0) {

      // 달력에 표시할 메타 정보 반환
      return { hasTodos: false, remaining: 0, allDone: false };
    }

    // filter()를 사용해서
    // 완료되지 않은 todo만 추출

    // 예:
    // completed: false 인 데이터만 남음
    const remaining = list.filter((todo) => !todo.completed).length;

    return {

      // todo 존재 여부
      hasTodos: true,

      // 남은 todo 개수
      remaining,

      // 남은 todo가 0개면 모두 완료 상태
      allDone: remaining === 0,
    };
  };

  return (
    <div className="calendar-container">

      {/* react-calendar 컴포넌트 */}
      <Calendar

        // 날짜 선택 시 실행되는 함수
        onChange={handleDateChange}

        // 현재 선택된 날짜
        // selectedDate state와 연결됨
        value={selectedDate}

        // 달력 시작 요일 설정
        calendarType="gregory"

        // 월 단위 보기
        view="month"

        // 연도 이동 버튼 제거
        prev2Label={null}
        next2Label={null}

        // 이전/다음 달 날짜도 함께 표시
        showNeighboringMonth={true}

        // 날짜 숫자만 표시
        // 예:
        // "1일" → "1"
        formatDay={(locale, date) => String(date.getDate())}

        // 날짜 칸 내부 추가 UI 렌더링
        tileContent={({ date, view }) => {

          // month view가 아니면 표시 안 함
          if (view !== "month") return null;

          // 현재 날짜의 메타 정보 계산
          const { hasTodos, remaining, allDone } = getDayMeta(date);

          // todo 없으면 아무것도 표시 안 함
          if (!hasTodos) return null;

          return (

            // 달력 날짜 아래에 표시되는 영역

            // 모두 완료:
            // ★ 표시

            // 미완료 존재:
            // 남은 개수 표시

            // 예:
            // 남은 할 일 2개 → "2"
            <div className="tile-meta">
              {allDone ? "★" : remaining}
            </div>
          );
        }}

        // 날짜 칸 CSS 클래스 동적 적용
        tileClassName={({ date, view }) => {

          if (view !== "month") return "";

          // 현재 날짜 메타 정보 가져오기
          const { hasTodos, allDone } = getDayMeta(date);

          // todo 없으면 클래스 없음
          if (!hasTodos) return "";

          // 완료 여부에 따라 클래스 변경

          // tile-done:
          // 모든 todo 완료된 날짜

          // tile-has:
          // 아직 할 일이 남아있는 날짜

          // 즉,
          // 상태에 따라 달력 색상/UI가 달라진다.
          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}