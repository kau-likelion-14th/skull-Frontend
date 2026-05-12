import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

function FriendUnfollowModal({

  // 부모 컴포넌트에서 전달받는 props

  // isOpen : 모달 열림 여부
  // friend : 현재 삭제하려는 친구 데이터
  // onConfirm : "예" 버튼 클릭 시 실행되는 함수
  // onClose : 모달 닫기 함수

  isOpen,
  friend,
  onConfirm,
  onClose
}) {

  // 모달이 열렸을 때 ESC 키로 닫을 수 있도록 처리하는 effect
  useEffect(() => {

    // 모달이 닫혀있으면 아무 작업도 하지 않는다.
    if (!isOpen) return;

    // 키보드 입력 이벤트 함수
    const handleKeyDown = (e) => {

      // ESC 키를 누르면 모달 닫기 실행
      if (e.key === "Escape") onClose?.();
    };

    // document 전체에 keydown 이벤트 등록
    // 즉, 화면 어디에서든 ESC 입력을 감지할 수 있다.
    document.addEventListener("keydown", handleKeyDown);

    // cleanup 함수

    // 모달이 닫히거나 컴포넌트가 사라질 때
    // 기존 이벤트 제거

    // 제거하지 않으면:
    // 이벤트가 계속 중첩 등록되어 메모리 누수 및 중복 실행 발생 가능
    return () => document.removeEventListener("keydown", handleKeyDown);

  }, [isOpen, onClose]);

  // 모달이 닫힌 상태라면
  // 아무것도 렌더링하지 않는다.

  // 즉,
  // 화면에 모달 DOM 자체가 생성되지 않는다.
  if (!isOpen) return null;

  // 친구 이름 표시용 값

  // optional chaining(?.) 사용:
  // friend가 undefined여도 에러 방지

  // nullish coalescing(??) 사용:
  // 값이 없으면 빈 문자열 사용
  const displayName = friend?.name ?? "";

  // 태그가 존재할 때만 # 포함
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  // 배경(overlay) 클릭 시 모달 닫기 처리
  const handleOverlayClick = (e) => {

    // e.target === e.currentTarget 조건은
    // 실제 배경 영역을 클릭했는지 검사

    // 이 조건이 없으면
    // 모달 내부 버튼 클릭 시에도 닫혀버릴 수 있다.

    // 즉:
    // 배경 클릭 → 닫힘
    // 모달 내용 클릭 → 유지
    if (e.target === e.currentTarget) onClose?.();
  };

  return (

    // 모달 배경 영역
    // 일반적으로 화면 전체를 덮는 반투명 영역
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>

      <div
        className="friend-unfollow-modal__content"

        // 접근성 관련 속성
        role="dialog"
        aria-modal="true"
      >

        {/* 삭제 확인 문구 */}
        <p className="friend-unfollow-modal__text">

          {/* 친구 이름 출력 */}
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}

          {/* 친구 태그 출력 */}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>

          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        <div className="friend-unfollow-modal__actions">

          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"

            // "예" 버튼 클릭 시 실행

            onClick={onConfirm}
          >
            예
          </button>

          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"

            // "아니오" 버튼 클릭 시 모달 닫기
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

// 다른 컴포넌트에서 import 해서 사용할 수 있도록 export
export default FriendUnfollowModal;