import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(() => {
    return JSON.parse(localStorage.getItem("userCoins")) || null; // Initialize coins from localStorage
  });
  const [loading, setLoading] = useState(true);

  const toggleMenuOpen = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${VITE_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched user:", data);
          setCoins(data.user.coins); // If fetched coins from API, update state
          localStorage.setItem("userCoins", JSON.stringify(data.user.coins));
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("New update");
    // Add event listener to watch for localStorage changes (coins)
    const handleStorageChange = () => {
      console.log("New update");

      const updatedCoins = JSON.parse(localStorage.getItem("userCoins"));
      console.log(updatedCoins);
      setCoins(updatedCoins); // Update state when localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);
    console.log(coins);

    // Cleanup event listener on component unmount
    console.log(coins);
    return () => {
      console.log(coins);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header id={props.isGradientPage ? "gradient-bg" : ""} className="header">
      <a href="/" id="logo"></a>

      <nav id="menu" className={menuOpen ? "open" : ""}>
        <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
          <i className={menuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </button>

        <Link to="/" className="menuItem">
          Home
        </Link>
        <Link to="/leaderboard" className="menuItem">
          Leaderboard
        </Link>

        {/* Loading or Coin Display */}
        {loading ? (
          <div id="coin-container">Loading...</div>
        ) : coins !== null ? (
          <div id="coin-container">
            <span>{coins}</span>
            <img src="/coin.png" alt="coins" />
          </div>
        ) : (
          ""
        )}

        <Link to="/login" className="menuItem">
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
