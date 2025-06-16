import { useState, useEffect } from "react";
import "./MusicPlayer.css";
import globalAudioManager from "../../GlobalAudioManager";
import { useNavigate } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const MusicPlayer = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [musicPlay, setMusicPlay] = useState(false);
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const defaultImage =
    "https://img.freepik.com/premium-photo/headphones-with-music-notes-headband-purple-background_1204450-18453.jpg?semt=ais_hybrid&w=740";

  const extractArtistAndSong = (title) => {
    const dashSplit = title.split(" - ");
    if (dashSplit.length === 2) {
      return { artist: dashSplit[0].trim(), song: dashSplit[1].trim() };
    }
    const byMatch = title.match(/(.*) by (.*)/i);
    if (byMatch) {
      return { song: byMatch[1].trim(), artist: byMatch[2].trim() };
    }
    const cleanTitle = title
      .replace(/\(.*?\)|\[.*?\]|ft\.|feat\./gi, "")
      .trim();
    return { song: cleanTitle, artist: "Unknown" };
  };

  const extractYouTubeID = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const id = extractYouTubeID(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  const addMusic = async () => {
    const url = inputUrl.trim();
    if (!url || musicList.some((t) => t.url === url)) return;

    const type =
      url.includes("youtube") || url.includes("youtu.be") ? "youtube" : "mp3";

    let imgUrl = null;

    if (type === "youtube") {
      imgUrl = getYouTubeThumbnail(url);
    } else {
      imgUrl = defaultImage;
    }
    const response = await fetch(`${VITE_API_URL}tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ url, type, imgUrl }),
    });

    const newTrack = await response.json();
    setMusicList((prev) => [...prev, newTrack]);
    if (!currentTrack) setCurrentTrack(newTrack);
    setInputUrl("");
  };

  useEffect(() => {
    const fetchTracks = async () => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${VITE_API_URL}tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tracks = await response.json();

      setMusicList(tracks.tracks);
      if (tracks.tracks.length > 0) setCurrentTrack(tracks.tracks[0]);
      setLoaded(true);
    };

    fetchTracks();
  }, []);

  useEffect(() => {
    if (musicList.length === 0) return;

    const storedTrack = localStorage.getItem("currentTrack");
    if (storedTrack) {
      const parsed = JSON.parse(storedTrack);
      const found = musicList.find((t) => t.url === parsed.url);
      if (found) {
        setCurrentTrack(found);
        return;
      }
    }

    setCurrentTrack(musicList[0]);
  }, [musicList]);

  useEffect(() => {
    if (!loaded) return;
    globalAudioManager.setTrackList(musicList);
    localStorage.setItem("myTrackList", JSON.stringify(musicList));
  }, [musicList, loaded]);

  useEffect(() => {
    const storedTrack = localStorage.getItem("currentTrack");
    if (storedTrack) {
      setCurrentTrack(JSON.parse(storedTrack));
    }
  }, []);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack) {
      globalAudioManager.setCurrentTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    const onPlay = () => setMusicPlay(true);
    const onPause = () => setMusicPlay(false);
    const onEnd = () => goToNextTrack();

    globalAudioManager.on("play", onPlay);
    globalAudioManager.on("pause", onPause);
    globalAudioManager.on("ended", onEnd);

    return () => {
      globalAudioManager.off("play", onPlay);
      globalAudioManager.off("pause", onPause);
      globalAudioManager.off("ended", onEnd);
    };
  }, [musicList, currentTrack]);

  useEffect(() => {
    if (!currentTrack) return;

    globalAudioManager.setSrc(currentTrack.url);

    if (currentTrack.type === "youtube") {
      globalAudioManager
        .getYouTubeVideoTitle(currentTrack.url)
        .then((title) => {
          const { artist, song } = extractArtistAndSong(title);
          setCurrentArtist(artist);
          setCurrentSong(song);
        })
        .catch(() => {
          setCurrentArtist("Unknown Artist");
          setCurrentSong("Unknown Song");
        });
    } else {
      setCurrentArtist("");
      setCurrentSong("");
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (musicPlay) {
      globalAudioManager.pause();
    } else {
      globalAudioManager.play();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      navigate("/login");
      return; // Exit early to avoid running fetch without a token
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
        }
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Authorization check failed:", error);
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };

    checkAuthorization();
  }, []);

  const unlockFeature = async (feature) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${VITE_API_URL}user/unlock-feature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feature }),
    });

    const data = await response.json();

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

  return (
    <div >
      <div
        className={
          "lists chart-container" +
          (currentTrack ? " currentTrack" : "") +
          (!userData.customMusicUnlocked ? " custom-music" : "")
        }
      >
        {!userData.customMusicUnlocked && (
          <button
            className="unlock-custom-music"
            onClick={() => unlockFeature("customMusic")}
          >
            Unlock Custom Music (200 coins)
          </button>
        )}

        {userData.customMusicUnlocked && (
          <div className="music-header">
            <div>
              <label htmlFor="music-url">Enter music link</label>
              <input
                type="text"
                id="music-url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addMusic();
                }}
              />
            </div>
            <button className="add-music" onClick={addMusic}>
              Add url
            </button>
          </div>
        )}

        {musicList.length > 0 &&
          musicList.map((track, idx) => (
            <div key={idx} className="music-song">
              <div className="music-song-left">
                <div className="music_image">
                  <img
                    src={
                      track.type === "youtube"
                        ? getYouTubeThumbnail(track.url)
                        : "https://img.freepik.com/premium-photo/headphones-with-music-notes-headband-purple-background_1204450-18453.jpg?semt=ais_hybrid&w=740"
                    }
                    alt="Music Cover"
                  />
                </div>
                <div>
                  <h3>
                    {track.type === "youtube" ? "YouTube Track" : "MP3 Track"}
                  </h3>
                  <p>{track.url}</p>
                </div>
              </div>
              <i
                className={
                  musicPlay && currentTrack === track
                    ? "fa fa-stop-circle"
                    : "fa fa-play-circle"
                }
                onClick={() => {
                  if (currentTrack === track) {
                    togglePlay();
                  } else {
                    setCurrentTrack(track);
                  }
                }}
              ></i>
            </div>
          ))}

        {currentTrack && (
          <div className="music-song main">
            <div className="music-song-left">
              <div className="music_image">
                <img
                  src={
                    currentTrack.type === "youtube"
                      ? getYouTubeThumbnail(currentTrack.url)
                      : "https://img.freepik.com/premium-photo/headphones-with-music-notes-headband-purple-background_1204450-18453.jpg?semt=ais_hybrid&w=740"
                  }
                  alt="Music Cover"
                />
              </div>
              <div>
                <h3>
                  {currentTrack.type === "youtube"
                    ? `${currentArtist || "Artist"} - ${currentSong || "Song"}`
                    : "MP3 Track"}
                </h3>
                <p>{currentTrack.url}</p>
              </div>
            </div>
            <div className="music-song-icons">
              <div className="music-song-right">
                <i
                  className="fa fa-backward"
                  onClick={() => globalAudioManager.goToPreviousTrack()}
                ></i>
                <i
                  className={
                    musicPlay ? "fa fa-stop-circle" : "fa fa-play-circle"
                  }
                  onClick={() => {
                    if (musicPlay) {
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
