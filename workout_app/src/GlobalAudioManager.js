import EventEmitter from "./SimpleEventEmitter";

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };
  });
}

class GlobalAudioManager extends EventEmitter {
  constructor() {
    super();
    this.currentType = "mp3";
    this.youtubePlayer = null;
    this.isPlaying = false;
    this.audio = new Audio();
    this.currentUrl = null;
    this.playerReady = false;
    this.trackList = [];
  }

  loadVideoById(videoId) {
    if (this.youtubePlayer && this.playerReady) {
      this.youtubePlayer.loadVideoById(videoId);
    }
  }

  async setSrc(url) {
    // Stop previous media
    if (this.currentType === "mp3") {
      this.audio.pause();
      this.audio.currentTime = 0;
    } else if (this.currentType === "youtube" && this.youtubePlayer) {
      this.youtubePlayer.stopVideo();
    }

    this.currentUrl = url;
    this.currentType =
      url.includes("youtube") || url.includes("youtu.be") ? "youtube" : "mp3";

    if (this.currentType === "mp3") {
      this.audio.src = url;
    } else {
      const videoId = this.extractYouTubeID(url);
      await this.initYouTubePlayer();
      this.loadVideoById(videoId);
    }
  }

  play() {
    if (this.currentType === "youtube") {
      this.youtubePlayer?.playVideo();
    } else {
      this.audio.play();
    }
    this.emit("play");
  }

  pause() {
    if (this.currentType === "youtube") {
      this.youtubePlayer?.pauseVideo();
    } else {
      this.audio.pause();
    }
    this.emit("pause");
  }

  setVolume(vol) {
    if (this.currentType === "youtube" && this.youtubePlayer?.setVolume) {
      this.youtubePlayer.setVolume(vol * 100);
    } else {
      this.audio.volume = vol;
    }
  }

  mute() {
    if (this.currentType === "youtube" && this.youtubePlayer?.mute) {
      this.youtubePlayer.mute();
    } else {
      this.audio.muted = true;
    }
    this.emit("muted", true);
  }

  unmute() {
    if (this.currentType === "youtube" && this.youtubePlayer?.unMute) {
      this.youtubePlayer.unMute();
    } else {
      this.audio.muted = false;
    }
    this.emit("muted", false);
  }

  setTrackList(tracks) {
    console.log(tracks);
    this.trackList = tracks;
  }

  async setCurrentTrack(track) {
    this.currentTrack = track;
    await this.setSrc(track.url);
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  async goToNextTrack() {
    if (!this.trackList || !this.currentTrack) return;
    const index = this.trackList.findIndex(
      (t) => t.url === this.currentTrack.url
    );
    const next = (index + 1) % this.trackList.length;
    const nextTrack = this.trackList[next];
    await this.setCurrentTrack(nextTrack);
    this.play();
  }

  async goToPreviousTrack() {
    console.log(this.trackList);

    if (!this.trackList || !this.currentTrack) return;
    const index = this.trackList.findIndex(
      (t) => t.url === this.currentTrack.url
    );
    const prev = (index - 1 + this.trackList.length) % this.trackList.length;
    const prevTrack = this.trackList[prev];
    await this.setCurrentTrack(prevTrack);
    this.play();
  }

  extractYouTubeID(url) {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  async initYouTubePlayer(domId = "hidden-youtube-player") {
    if (this.youtubePlayer) return;

    const YT = await loadYouTubeAPI();
    const container = document.createElement("div");
    container.id = domId;
    container.style.display = "none";
    document.body.appendChild(container);

    this.youtubePlayer = new YT.Player(domId, {
      height: "0",
      width: "0",
      videoId: "",
      events: {
        onReady: () => {
          this.playerReady = true;
        },
        onStateChange: (event) => {
          switch (event.data) {
            case YT.PlayerState.PLAYING:
              this.isPlaying = true;
              this.emit("play");
              break;
            case YT.PlayerState.PAUSED:
            case YT.PlayerState.ENDED:
              this.isPlaying = false;
              this.emit("pause");
              if (event.data === YT.PlayerState.ENDED) {
                this.emit("ended");
              }
              break;
          }
        },
        onError: () => {
          this.emit("error");
        },
      },
    });
  }

  getYouTubeVideoTitle(url) {
    const videoId = this.extractYouTubeID(url);
    if (!videoId) return Promise.reject("Invalid URL");
    return fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    )
      .then((res) => res.json())
      .then((data) => data.title);
  }
}

const globalAudioManager = new GlobalAudioManager();
export default globalAudioManager;
