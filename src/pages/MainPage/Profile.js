import React, { useState, useRef } from "react";
import { FaPen } from "react-icons/fa";
import defaultImg from "../../assets/img/profile.jpg";

function Profile() {
  const [image, setImage] = useState(null);
  const fileRef = useRef();

  const handleClick = () => {
    fileRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="profile-img-wrapper">
      <img
        src={image || defaultImg}
        alt="profile"
        className="profile-img"
      />

      <button className="edit-btn" onClick={handleClick}>
        <FaPen />
      </button>

      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
}

export default Profile;