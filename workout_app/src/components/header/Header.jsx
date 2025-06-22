import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import globalAudioManager from "../../GlobalAudioManager";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(() => {
    const stored = localStorage.getItem("userCoins");
    return stored ? JSON.parse(stored) : null;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [userData, setUserData] = useState({});
  const [currentTrack, setCurrentTrack] = useState(null);
  const [muted, setMuted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    globalAudioManager.on("muted", setMuted);
    return () => globalAudioManager.off("muted", setMuted);
  }, []);

  useEffect(() => {
    setIsPlaying(globalAudioManager.isPlaying);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => goToNextTrack();

    globalAudioManager.on("play", onPlay);
    globalAudioManager.on("pause", onPause);
    globalAudioManager.on("ended", onEnd);

    return () => {
      globalAudioManager.off("play", onPlay);
      globalAudioManager.off("pause", onPause);
      globalAudioManager.off("ended", onEnd);
    };
  }, []);

  const toggleMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    const checkAuthorization = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUserData(data.user);
        setCoins(data.user.coins);
        localStorage.setItem("userCoins", JSON.stringify(data.user.coins));
      } catch (error) {
        console.error("Authorization check failed:", error);
      }
    };

    const handleCoinsUpdate = () => checkAuthorization();

    window.addEventListener("coinsUpdated", handleCoinsUpdate);

    checkAuthorization();

    return () => {
      window.removeEventListener("coinsUpdated", handleCoinsUpdate);
    };
  }, []);

  const unlockFeature = async (feature) => {
    alert("Are you sure you want to spend 100 coins?");

    const token = localStorage.getItem("authToken");

    const res = await fetch(`${VITE_API_URL}user/unlock-feature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feature }),
    });

    const data = await res.json();

    if (data.success) {
      setUserData((prev) => ({
        ...prev,
        coins: data.coins,
        [`${feature}Unlocked`]: true,
      }));
    } else {
      alert(data.error || "Failed to unlock feature.");
    }
  };

  useEffect(() => {
    const updateTrackInfo = () => {
      setCurrentTrack(globalAudioManager.getCurrentTrack());
    };

    globalAudioManager.on("play", updateTrackInfo);
    globalAudioManager.on("trackChanged", updateTrackInfo);

    updateTrackInfo();

    return () => {
      globalAudioManager.off("play", updateTrackInfo);
      globalAudioManager.off("trackChanged", updateTrackInfo);
    };
  }, []);

  return (
    <header id={props.isGradientPage ? "gradient-bg" : ""} className="header">
      <a href="/" id="logo">
        <img
          src={props.isGradientPage ? "/logo_light.svg" : "/logo.svg"}
          alt="logo"
          style={{ width: "180px", height: "90px" }}
        />
      </a>

      <nav id="menu" className={menuOpen ? "open" : ""}>
        {coins !== null && (
          <div
            className={"music" + (userData.musicUnlocked ? "" : " locked")}
            onClick={() => {
              !userData.musicUnlocked
                ? unlockFeature("music")
                : navigate("/music-player");
            }}
          >
            {!userData.musicUnlocked && <i className="fas fa-lock"></i>}

            <div className="music_image">
              <img
                src={
                  currentTrack?.imgUrl ||
                  "https://img.freepik.com/premium-photo/headphones-with-music-notes-headband-purple-background_1204450-18453.jpg?semt=ais_hybrid&w=740"
                }
                alt="Music Cover"
              />
            </div>

            <i
              className="fa fa-backward"
              onClick={(e) => {
                e.stopPropagation();
                userData.musicUnlocked &&
                  globalAudioManager.goToPreviousTrack();
              }}
            ></i>

            <i
              className={isPlaying ? "fa fa-stop-circle" : "fa fa-play-circle"}
              onClick={(e) => {
                e.stopPropagation();
                if (userData.musicUnlocked) {
                  if (isPlaying) {
                    globalAudioManager.pause();
                  } else {
                    globalAudioManager.play();
                  }
                }
              }}
            ></i>

            <i
              className="fa fa-forward"
              onClick={(e) => {
                e.stopPropagation();
                userData.musicUnlocked && globalAudioManager.goToNextTrack();
              }}
            ></i>

            <i
              className={muted ? "fa fa-volume-mute" : "fa fa-volume-up"}
              onClick={(e) => {
                e.stopPropagation();
                if (muted) {
                  globalAudioManager.unmute();
                } else {
                  globalAudioManager.mute();
                }
              }}
            ></i>
          </div>
        )}

        <Link to="/" className="menuItem">
          Home
        </Link>
        <Link to="/leaderboard" className="menuItem">
          Leaderboard
        </Link>

        {coins !== null && (
          <div id="coin-container">
            <span>{coins}</span>
            <img src="/coin.svg" alt="coins" className="coin-img" />
          </div>
        )}

        <Link to="/login" className="menuItem">
          <i className="fa fa-user-circle"></i>
        </Link>
      </nav>
      <nav className="mobile-bottom-nav">
        <Link to="/" className="mobile-nav-item">
          <i className="fa fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/leaderboard" className="mobile-nav-item">
          <i className="fa fa-trophy"></i>
          <span>Top</span>
        </Link>
        <div
          className="mobile-nav-item"
          onClick={() => {
            !userData.musicUnlocked
              ? unlockFeature("music")
              : navigate("/music-player");
          }}
        >
          <i className="fa fa-music"></i>
          <span>Music</span>
        </div>
        <Link to="/login" className="mobile-nav-item">
          <i className="fa fa-user-circle"></i>
          <span>Profile</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
