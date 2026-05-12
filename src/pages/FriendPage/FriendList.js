import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

function FriendList(
  {
    // 부모 컴포넌트에서 전달받는 props
    // title : 목록 상단 제목
    // friends : 친구 데이터 배열
    // onClickRemove : 삭제 버튼 클릭 시 실행할 함수
    // emptyText : 친구가 없을 때 보여줄 문구

    title = "팔로우 목록",
    friends = [],
    onClickRemove,
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) {

  // 페이지 이동을 위한 react-router-dom의 navigate 함수
  // 특정 친구 클릭 시 친구 상세 페이지로 이동할 때 사용된다.
  const navigate = useNavigate();

  // 친구 카드 클릭 시 실행되는 함수
  const goFriendDetail = (friend) => {

    // /friends/친구id 형태의 URL로 이동
    // state로 friend 객체 전체를 함께 전달하기 때문에
    // 상세 페이지에서 location.state.friend 로 바로 데이터를 사용할 수 있다.
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-list">

      {/* 부모 컴포넌트에서 전달받은 title이 화면 상단 제목으로 출력된다. */}
      <h2 className="friend-list__title">{title}</h2>

      {/* 
        friends 배열 길이를 검사해서
        친구가 없는 경우와 있는 경우를 조건부 렌더링한다.

        friends.length === 0 이면:
        → "친구 없음" UI 표시

        friends.length > 0 이면:
        → 친구 목록 리스트 출력
      */}
      {friends.length === 0 ? (

        // 친구 데이터가 없을 때 사용자에게 안내 문구 표시
        <div className="friend-list__empty">{emptyText}</div>

      ) : (

        // 친구 데이터가 있을 경우 리스트 출력
        <ul className="friend-list__items">

          {/* 
            map()을 사용해서 friends 배열 데이터를 하나씩 꺼내
            화면에 친구 카드 UI를 생성한다.

          */}
          {friends.map((friend) => (

            // key는 React가 리스트 변경 사항을 빠르게 비교하기 위해 사용
            <li key={friend.id} className="friend-list__item">

              <div
                className="friend-list__left"

                // 접근성 관련 속성
                role="button"
                tabIndex={0}

                // 친구 영역 클릭 시 상세 페이지 이동
                onClick={() => {

                  // 클릭한 friend 객체를 전달
                  // 해당 친구 상세 페이지로 이동한다.
                  goFriendDetail(friend);
                }}
                >


                <div className="friend-avatar" aria-hidden="true">

                  {/* 
                    프로필 이미지가 존재하면 실제 이미지 출력
                    없으면 기본 SVG 아이콘(UserIcon) 출력

                    즉,
                    데이터 상태에 따라 화면 UI가 달라진다.
                  */}
                  {friend.profileImageUrl ? (

                    <img
                      className="friend-avatar__img"

                      // 서버 또는 저장된 이미지 URL
                      src={friend.profileImageUrl}

                      alt="프로필 사진"
                      />
                  ) : (

                    // 기본 프로필 아이콘
                    <UserIcon/>
                  )}
                </div>


                <div className="friend-info">

                  {/* 이름 + 태그 영역 */}
                  <div className = "friend-info__top">

                    {/* friend 객체의 name 값 출력 */}
                    <span className="friend-info__name">{friend.name}</span>

                    {/* friend 객체의 tag 값 출력 */}
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>

                  {/* 
                    소개글(bio)이 존재하면 소개글 출력
                    없으면 "소개글이 없습니다." 표시

                    즉,
                    데이터 유무에 따라 UI가 다르게 렌더링된다.
                  */}
                  {friend.bio ?(

                    <div className="friend-info__bio">{friend.bio}</div>

                  ) : (

                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>

              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"

                onClick={(e)=>{

                  // 버튼 클릭 시 부모 div의 클릭 이벤트 전파를 막는다.
                  // 만약 stopPropagation()이 없으면:
                  // 삭제 버튼 눌러도 상세 페이지 이동까지 같이 실행된다.
                  e.stopPropagation();

                  // 부모 컴포넌트에서 전달받은 삭제 함수 실행
                  // 클릭한 friend 객체를 인자로 전달한다.

                  onClickRemove?.(friend);
                }}
                >

                  {/* 삭제 버튼 아이콘 */}
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
                </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function UserIcon() {

  // 프로필 이미지가 없을 때 대신 보여주는 기본 사용자 SVG 아이콘
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

// 다른 컴포넌트에서 FriendList를 import 해서 사용할 수 있도록 export
export default FriendList;