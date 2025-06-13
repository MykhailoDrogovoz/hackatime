import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Header = (props) => {
  const audioRef = useRef(null);
  const [url, setUrl] = useState(
    "https://youtu.be/eJnQBXmZ7Ek?si=cMSsQYrf8G16iHyZ"
  ); // user input
  const [videoId, setVideoId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(() => {
    return JSON.parse(localStorage.getItem("userCoins")) || null;
  });
  const [loading, setLoading] = useState(true);
  const [musicPlay, setMusicPlay] = useState(false);
  const [volume, setVolume] = useState(true);

  // Function to extract YouTube video ID or null if not YouTube
  const extractVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]+)/);
    return match ? match[1] : null;
  };

  // Detect if url is YouTube on url change
  useEffect(() => {
    const id = extractVideoId(url);
    setVideoId(id);
  }, [url]);

  // Toggle menu open/close
  const toggleMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  // Play/pause toggle handler
  const togglePlay = () => {
    if (videoId) {
      // For YouTube iframe player
      if (musicPlay) {
        audioRef.current?.pauseVideo();
      } else {
        audioRef.current?.playVideo();
      }
    } else {
      // For native audio element
      if (musicPlay) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    }
    setMusicPlay(!musicPlay);
  };

  // Volume toggle handler
  const toggleVolume = () => {
    if (audioRef.current) {
      if (videoId) {
        // Mute/unmute YouTube iframe player
        audioRef.current.isMuted()
          ? audioRef.current.unMute()
          : audioRef.current.mute();
      } else {
        // Mute/unmute native audio element
        audioRef.current.muted = !volume;
      }
    }
    setVolume(!volume);
  };

  // Load YouTube iframe API and create player on videoId change
  useEffect(() => {
    if (!videoId) return;

    window.onYouTubeIframeAPIReady = () => {
      audioRef.current = new window.YT.Player("yt-player", {
        height: "200",
        width: "300",
        videoId,
        events: {
          onReady: () => {
            console.log("YouTube player ready");
            if (musicPlay) audioRef.current.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setMusicPlay(false);
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      window.onYouTubeIframeAPIReady();
    }
  }, [videoId]);

  // Fetch user data, localStorage handling, etc. (your existing code here)...

  return (
    <header id={props.isGradientPage ? "gradient-bg" : ""} className="header">
      <a href="/" id="logo"></a>

      <nav id="menu" className={menuOpen ? "open" : ""}>
        <div className="music">
          <div className="music_image">
            <img
              src="https://variety.com/wp-content/uploads/2022/07/Music-Streaming-Wars.jpg?w=1000&h=563&crop=1"
              alt="Music Cover"
            />
          </div>

          {/* Render YouTube iframe or native audio */}
          {videoId ? (
            <div id="yt-player"></div>
          ) : (
            <audio
              ref={audioRef}
              src={url}
              controls={false}
              onEnded={() => setMusicPlay(false)}
            />
          )}

          <i className="fa fa-backward"></i>
          <i
            className={musicPlay ? "fa fa-stop-circle" : "fa fa-play-circle"}
            onClick={togglePlay}
          ></i>
          <i className="fa fa-forward"></i>
          <i
            className={volume ? "fa fa-volume-up" : "fa fa-volume-mute"}
            onClick={toggleVolume}
          ></i>
        </div>

        <button id="mobile-menu-btn" onClick={toggleMenuOpen}>
          <i className={menuOpen ? "fa fa-times" : "fa fa-bars"}></i>
        </button>

        <Link to="/" className="menuItem">
          Home
        </Link>
        <Link to="/leaderboard" className="menuItem">
          Leaderboard
        </Link>

        {loading ? (
          // <div id="coin-container">Loading...</div>
          ""
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
