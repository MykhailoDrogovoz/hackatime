import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import globalAudioManager from "../../GlobalAudioManager";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(
    () => JSON.parse(localStorage.getItem("userCoins")) || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(true);

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

  return (
    <header id={props.isGradientPage ? "gradient-bg" : ""} className="header">
      <a href="/" id="logo"></a>

      <nav id="menu" className={menuOpen ? "open" : ""}>
        {coins !== null && (
          <div className="music">
            <div className="music_image">
              <img
                src="https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1"
                alt="Music Cover"
              />
            </div>

            <i
              className="fa fa-backward"
              onClick={() => globalAudioManager.goToPreviousTrack()}
            ></i>
            <i
              className={isPlaying ? "fa fa-stop-circle" : "fa fa-play-circle"}
              onClick={() => {
                if (isPlaying) {
                  globalAudioManager.pause();
                } else {
                  globalAudioManager.play();
                }
              }}
            ></i>
            <i
              className="fa fa-forward"
              onClick={() => globalAudioManager.goToNextTrack()}
            ></i>
            <i
              class={volume ? "fa fa-volume-mute" : "fa fa-volume-up"}
              onClick={() => setVolume(!volume)}
            ></i>
          </div>
        )}

        <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
          <i className={menuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </button>

        <Link to="/" className="menuItem">
          Home
        </Link>
        <Link to="/leaderboard" className="menuItem">
          Leaderboard
        </Link>

        {coins !== null && (
          <div id="coin-container">
            <span>{coins}</span>
            <img src="/coin.png" alt="coins" />
          </div>
        )}

        <Link to="/login" className="menuItem">
          <i className="fa fa-user-circle"></i>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
