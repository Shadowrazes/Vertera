import Logo from "../assets/logo.svg";
import headerBtn from "../assets/header_exit.svg";
import "../css/header.css";

function Header() {
  return (
    <>
      <section className="header">
        <div className="header__container container">
          <a href="/">
            <img className="header__logo" src={Logo} alt=""></img>
          </a>
          <div className="header__btn-group">
            <a className="header__exit" href="#">
              Выход
            </a>
            <a href="#" className="header__button">
              <img src={headerBtn} alt="" className="header__button-svg" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Header;
