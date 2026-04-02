import "../styles/Header.css";
import logo from "../assets/img/logo.png";
import { NavLink } from "react-router-dom";
import LogoutIcon from "../assets/icon/logout.png";


function Header() {
    return (
        <header className="header">
            {/*로고*/}
            <div className="header-left">
                <img src={logo} alt="LTE 로고" className="header-logo"/>
                <span className="header-title">Lion To-do Everyday</span>
            </div>

            {/*메뉴*/}
            <nav className="header-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>홈
                </NavLink>

                <NavLink to="/friends" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>친구
                </NavLink>

                <NavLink to="/mypage" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>마이페이지
                </NavLink>
            </nav>

                <div className="header-right">
                    <span className="user-name">이서연님</span>
                    <img src={LogoutIcon} alt="로그아웃" className="logout-icon"/>

                </div>
        </header>
    );
}

export default Header;
