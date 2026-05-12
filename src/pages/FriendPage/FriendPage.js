import React from 'react';
import { useMemo, useState } from 'react';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';
import FriendUnfollowModal from './FriendUnfollowModal';
import '../../styles/FriendPage.css';


const initialFollowList = [
    {
        id: "1",
        userId: 1,
        name: "서연1",
        tag: "1231",
        bio: "안녕하세요! 저는 서연1입니다.",
        profileImageUrl: null
    },
    {
        id: "2",
        userId: 1,
        name: "서연2",
        tag: "1232",
        bio: "안녕하세요! 저는 서연2입니다.",
        profileImageUrl: null
    },
    {
        id: "3",
        userId: 1,
        name: "서연3",
        tag: "1233",
        bio: "안녕하세요! 저는 서연3입니다.",
        profileImageUrl: null
    },
]

function FriendPage() {
    const [followList, setFollowList ] = useState(initialFollowList);

    const followIds = useMemo(
        ()=> new Set(followList.map((x) => x.Id)),
    [followList]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFollow = (user) => {
        if (!user?.userId) return;
        if (followIds.has(String(user.userId))) return;

        setFollowList((prev) => [...prev, user]);
    };

    const handleClickRemove = (friend) => {
        setSelectedFriend(friend);
        setIsModalOpen(true);
    }

    const handleConfirmRemove = () => {
        if(!selectedFriend) return;
        setFollowList((prev)=>
            prev.filter((friend) => friend.id !==selectedFriend.id)
    );
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    return(
        <div className="friend-page"> 
            <div className="friend-page__inner">
            <div className="friend-page__grid">
            <FriendList 
                friends={followList}
                onClickRemove={handleClickRemove}
                emptyText="팔로우하는 친구가 없습니다."
                />

                <FriendSearch
                    onFollow={handleFollow}
                    followingList={followList}
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