import "../styles/Footer.css";
import logo from "../assets/img/logo.png";

function Footer(){
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <img src={logo} alt="로고" className="footer-logo" />
                <div>
                    <h3 className="footer-title">Lion To-do Everyday</h3>
                    <p className="footer-desc">
                        LTE는 한국항공대학교 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹 서비스입니다.
                    </p>
                    </div>    
                </div>
                <div className="footer-bottom">
                    <p>
                        상호명 한국항공대학교 멋쟁이사자처럼 &nbsp;&nbsp;
                        대표자 이서연 &nbsp;&nbsp;
                        주소 경기도 고양시 항공대학로76 항공우주센터 3층 창업카페
                    </p>
                    <p>
                        사업자등록번호 333-22-55555 &nbsp;&nbsp;
                        개인정보보호책임자 전유안 &nbsp;&nbsp;
                        이메일 seoyeon9184@naver.com &nbsp;&nbsp;
                        전화번호 010-9326-9184
                    </p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;