import React, { useMemo } from "react";

import "../../styles/Todo.css";
import "../../styles/FriendTodo.css";

const FriendTodo = ({title = "To do List", todos = [], categories = {}}) => {

  return (
    <div className="friend-todo">
      <div className="todo-container">

        {/* Todo 상단 헤더 */}
        <div className="todo-header">

          {/* 부모 컴포넌트에서 전달받은 title 출력 */}
          <div className="todo-title">{title}</div>
        </div>

        {/* Todo 리스트 영역 */}
        <div className="todo-list">

          {/* 
            Todo가 없는 경우와 있는 경우를 조건부 렌더링

            todos.length === 0
            → "등록된 투두가 없습니다." 출력

            todos.length > 0
            → map()으로 Todo 리스트 생성
          */}
          {todos.length === 0 ? (

            // Todo 데이터가 없을 때 표시
            <div className="friend-todo__empty">
              등록된 투두가 없습니다.
            </div>

          ) : (

            // todos 배열을 map()으로 순회

            // 배열 요소 개수만큼 Todo UI 생성
            todos.map((t) => (

              <div

                // React 리스트 렌더링용 key
                key={t.id}

                // completed 상태에 따라 done 클래스 추가

                // 완료 상태면:
                // class="todo-item done"

                // 미완료 상태면:
                // class="todo-item"

                // CSS에서 스타일 차이 발생
                className={`todo-item ${t.completed ? "done" : ""}`}
              >

                {/* 
                  체크박스 UI

                  completed 값에 따라 checked 클래스 추가

                  완료된 Todo:
                  → 체크된 스타일 표시

                  미완료 Todo:
                  → 기본 스타일 표시
                */}
                <div className={`checkbox ${t.completed ? "checked" : ""}`} />

                {/* Todo 내용 출력 */}
                <div className="todo-text">{t.text}</div>

                <div
                  className="todo-category"

                  // category 값에 따라 스타일 동적 적용

                  // 예:
                  // "공부"
                  // → 연두색 배경

                  // "동아리"
                  // → 파란색 배경

                  // 즉,
                  // 데이터 상태에 따라 UI 색상이 달라진다.
                  style={categories[t.category] ?? undefined}
                >

                  {/* 카테고리 이름 출력 */}
                  {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


export default FriendTodo;