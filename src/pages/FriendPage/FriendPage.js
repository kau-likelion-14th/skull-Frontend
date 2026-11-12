import React, { useMemo, useState, useRef, useEffect } from 'react';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';
import FriendUnfollowModal from './FriendUnfollowModal';
import { toFriendModel } from "./friendModel";
import api from "../../Api";
import config from "../../Config";
import '../../styles/FriendPage.css';

function FriendPage() {
    const [followList, setFollowList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const followingRef = useRef(false);
    const removingRef = useRef(false);

    const [followingId, setFollowingId] = useState(null);
    const [followError, setFollowError] = useState("");
    const [searchRefreshKey, setSearchRefreshKey] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);

    // 팔로잉 목록 조회
    useEffect(() => {
        const fetchFollowings = async () => {
            try {
                setLoading(true);
                setLoadError("");

                const response = await api.get(
                    config.FOLLOW.FOLLOWINGS
                );

                if (
                    response?.data?.isSuccess === false ||
                    !Array.isArray(response?.data?.result)
                ) {
                    throw new Error("팔로잉 목록 응답을 확인해 주세요.");
                }

                const friends = response.data.result.map(toFriendModel);

                setFollowList(friends);
            } catch (error) {
                console.error("팔로잉 목록 조회 실패:", error);
                setLoadError("팔로잉 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowings();
    }, []);

    // 이미 팔로우 중인 사용자 ID 관리
    const followIds = useMemo(
        () => new Set(followList.map((x) => x.id)),
        [followList]
    );

    // 팔로우
    const handleFollow = async (user) => {
        if (
            !user ||
            loading ||
            loadError ||
            isModalOpen ||
            followingRef.current ||
            removingRef.current ||
            followIds.has(user.id)
        ) {
            return;
        }

        followingRef.current = true;
        setFollowingId(user.id);
        setFollowError("");

        try {
            const response = await api.post(
                config.FOLLOW.CREATE,
                {
                    toUserId: user.userId,
                }
            );

            if (
                response?.data?.isSuccess === false ||
                response?.data?.result?.userID == null ||
                String(
                    response.data.result.userID
                ) !== user.id
            ) {
                throw new Error("팔로우 응답을 확인해 주세요.");
            }

            const newFriend = toFriendModel(response.data.result);

            setFollowList((prev) => {
                if (
                    prev.some(
                        (friend) => friend.id === newFriend.id
                    )
                ) {
                    return prev;
                }

                return [...prev, newFriend];
            });

            // 검색 결과 갱신
            setSearchRefreshKey((value) => value + 1);

        } catch (error) {
            console.error("팔로우 실패:", error);
            setFollowError("팔로우에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            followingRef.current = false;
            setFollowingId(null);
        }
    };

    // 언팔로우 모달 열기
    const handleClickRemove = (friend) => {
        if (
            removingRef.current ||
            followingRef.current ||
            loading
        ) {
            return;
        }

        setSelectedFriend(friend);
        setIsModalOpen(true);
    };

    // 언팔로우
    const handleConfirmRemove = async () => {
        if (!selectedFriend || removingRef.current) return;

        removingRef.current = true;
        setIsRemoving(true);

        try {
            await api.delete(config.FOLLOW.DELETE, {
                data: {
                    toUserId: selectedFriend.userId,
                },
            });

            setFollowList((prev) =>
                prev.filter(
                    (friend) => friend.id !== selectedFriend.id
                )
            );

            setIsModalOpen(false);
            setSelectedFriend(null);

            // 검색 결과 갱신
            setSearchRefreshKey((value) => value + 1);

        } catch (error) {
            console.error("언팔로우 실패:", error);
            alert("언팔로우에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            removingRef.current = false;
            setIsRemoving(false);
        }
    };

    // 모달 닫기
    const handleCloseModal = () => {
        if (removingRef.current) return;

        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    return (
        <div className="friend-page">
            <div className="friend-page__inner">
                <div className="friend-page__grid">

                    {loading ? (
                        <div>팔로잉 목록을 불러오는 중...</div>
                    ) : loadError ? (
                        <div role="alert">
                            {loadError}
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : (
                        <FriendList
                            friends={followList}
                            onClickRemove={handleClickRemove}
                            emptyText="팔로우하는 친구가 없습니다."
                        />
                    )}

                    <FriendSearch
                        onFollow={handleFollow}
                        followingList={followList}
                        followingId={followingId}
                        followError={followError}
                        followDisabled={
                            loading ||
                            Boolean(loadError) ||
                            isModalOpen ||
                            isRemoving
                        }
                        refreshKey={searchRefreshKey}
                    />

                </div>
            </div>

            <FriendUnfollowModal
                isOpen={isModalOpen}
                friend={selectedFriend}
                onConfirm={handleConfirmRemove}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default FriendPage;