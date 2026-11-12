import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";

import "../../styles/FriendDetailPage.css";
import "../../styles/Calendar.css";


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

export default function FriendCalendar({
  initialDate,
  onDateChange,
  onMonthChange,
  remainingByDate = {}
}) {const
  getDayMeta = (date) => {
    const day = remainingByDate[toDateKey(date)];

    return {
      hasTodos: day?.hasTodo === true,
      remaining: day?.remaining ?? 0,
      allDone: day?.hasTodo === true && day?.remaining === 0
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={(value) => onDateChange?.(value instanceof Date ? value:value?.[0])}
        onActiveStartDateChange = {({activeStartDate}) => onMonthChange?.(activeStartDate)}
        value={initialDate}
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date.getDate())}
        tileContent={({ date, view }) => {
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