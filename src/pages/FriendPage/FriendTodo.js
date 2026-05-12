import React, { useMemo } from "react";

import "../../styles/Todo.css";
import "../../styles/FriendTodo.css";

// 친구 Todo 더미 데이터

// 실제 서버 대신 임시로 사용하는 데이터
// map()을 통해 화면에 Todo 목록으로 출력된다.
const dummyTodos = [
  { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
  { id: 2, text: "FriendTodo 구현하기", category: "공부", completed: false },
  { id: 3, text: "동아리 회의", category: "동아리", completed: false },
];

// 카테고리별 스타일 정보

// Todo의 category 값에 따라
// 배경색과 글자색이 다르게 적용된다.
const dummyCategories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const FriendTodo = ({

  // 부모 컴포넌트에서 전달받는 props

  // Todo 영역 제목
  // 전달되지 않으면 기본값 사용
  title = "To do List"
}) => {

  // 현재는 더미 데이터를 직접 사용

  // 이후 실제 프로젝트에서는:
  // props 또는 서버 데이터로 변경 가능
  const todos = dummyTodos;

  // 카테고리 스타일 데이터
  const categories = dummyCategories;

  // Todo 통계 계산

  // useMemo 사용 이유:
  // todos가 변경될 때만 다시 계산

  // 불필요한 연산 방지
  const counts = useMemo(() => {

    // 전체 Todo 개수
    const total = todos.length;

    // completed === true 인 Todo만 filter()

    // 예:
    // [
    //   {completed:true},
    //   {completed:false}
    // ]
    // ↓
    // [{completed:true}]

    // 최종 length:
    // 완료 개수
    const done = todos.filter((t) => t.completed).length;

    // 객체 형태로 반환
    return { total, done };

  }, [todos]);

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

// 다른 컴포넌트에서 FriendTodo를 import 할 수 있도록 export
export default FriendTodo;