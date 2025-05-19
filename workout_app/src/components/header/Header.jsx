import { useState } from "react";
import { Link } from "react-router-dom";

import "./Header.css";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  return (
    <header id={props.isGradientPage ? "gradient-bg" : ""} className="header">
      <a href="/" id="logo"></a>

      <nav id="menu" className={menuOpen ? "open" : ""}>
        <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
          <i className="fa fa-times"></i>
        </button>
        <Link to="/" className="menuItem">
          Home
        </Link>
        <Link to="/leaderboard" className="menuItem">
          Leaderboard
        </Link>
        <div id="coin-container">
          <span>21</span>
          <img src="/coin.png" alt="" />
        </div>
        <Link to="/account" className="menuItem">
          <i className="fa fa-user-circle"></i>
        </Link>
      </nav>

      <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
        <i className="fa fa-bars"></i>
      </button>
    </header>
  );
};

export default Header;
