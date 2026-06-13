const songs = [
  {
    title: "Kesariya",
    artist: "Arijit Singh",
    src: "song1.mp3",
    cover: "cover1.webp",
    category: "new",
    album: "New Songs"
  },
  {
    title: "Heeriye",
    artist: "Jasleen Royal",
    src: "song2.mp3",
    cover: "cover2.webp",
    category: "new",
    album: "New Songs"
  },
  {
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    src: "song3.mp3",
    cover: "cover3.webp",
    category: "arijit",
    album: "Arijit Singh Collection"
  },
  {
    title: "90s Song 1",
    artist: "90s Singer",
    src: "song4.mp3",
    cover: "cover4.webp",
    category: "90s",
    album: "90s Hits"
  },
  {
    title: "90s Song 2",
    artist: "90s Singer",
    src: "song5.mp3",
    cover: "cover5.jpg",
    category: "90s",
    album: "90s Hits"
  },
  {
    title: "Arijit Song 2",
    artist: "Arijit Singh",
    src: "song6.mp3",
    cover: "cover6.webp",
    category: "arijit",
    album: "Arijit Singh Collection"
  },
  {
    title: "Jubin Song 1",
    artist: "Jubin Nautiyal",
    src: "song7.mp3",
    cover: "cover7.jpg",
    category: "jubin",
    album: "Jubin Nautiyal Collection"
  },
  {
    title: "Jubin Song 2",
    artist: "Jubin Nautiyal",
    src: "song8.mp3",
    cover: "cover8.webp",
    category: "jubin",
    album: "Jubin Nautiyal Collection"
  },
  {
    title: "New Song 3",
    artist: "Bollywood Singer",
    src: "song9.mp3",
    cover: "cover9.jpg",
    category: "new",
    album: "New Songs"
  }
];

const songList = document.getElementById("songList");
const recentList = document.getElementById("recentList");
const audio = document.getElementById("audio");

const currentCover = document.getElementById("currentCover");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");

const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");

const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".categories button");
const likedSongsLink = document.getElementById("likedSongsLink");

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentCategory = "all";

let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
let recentlyPlayed = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

function saveLikedSongs() {
  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
}

function saveRecentlyPlayed() {
  localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
}

function isLiked(song) {
  return likedSongs.includes(song.src);
}

function toggleLike(song) {
  if (isLiked(song)) {
    likedSongs = likedSongs.filter((src) => src !== song.src);
  } else {
    likedSongs.push(song.src);
  }

  saveLikedSongs();
  applyFilters();
}

function addToRecentlyPlayed(song) {
  recentlyPlayed = recentlyPlayed.filter((item) => item.src !== song.src);
  recentlyPlayed.unshift(song);

  if (recentlyPlayed.length > 5) {
    recentlyPlayed.pop();
  }

  saveRecentlyPlayed();
  renderRecentlyPlayed();
}

function getCategorySongs() {
  if (currentCategory === "all") {
    return songs;
  }

  if (currentCategory === "liked") {
    return songs.filter((song) => likedSongs.includes(song.src));
  }

  return songs.filter((song) => song.category === currentCategory);
}

function applyFilters() {
  const searchValue = searchInput.value.toLowerCase();
  let filteredSongs = getCategorySongs();

  filteredSongs = filteredSongs.filter((song) => {
    return (
      song.title.toLowerCase().includes(searchValue) ||
      song.artist.toLowerCase().includes(searchValue) ||
      song.album.toLowerCase().includes(searchValue) ||
      song.category.toLowerCase().includes(searchValue)
    );
  });

  loadSongs(filteredSongs);
}

function loadSongs(songArray = songs) {
  songList.innerHTML = "";

  if (songArray.length === 0) {
    songList.innerHTML = `<p class="no-song">No songs found</p>`;
    return;
  }

  songArray.forEach((song) => {
    const originalIndex = songs.indexOf(song);

    const card = document.createElement("div");
    card.classList.add("song-card");

    if (originalIndex === currentSongIndex) {
      card.classList.add("active");
    }

    card.innerHTML = `
      <button class="like-btn">${isLiked(song) ? "♥" : "♡"}</button>
      <img src="${song.cover}" alt="${song.title}">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <span class="album-name">${song.album}</span>

      <div class="equalizer">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    card.addEventListener("click", () => {
      currentSongIndex = originalIndex;
      loadSong(currentSongIndex);
      playSong();
      addToRecentlyPlayed(songs[currentSongIndex]);
      applyFilters();
    });

    const likeBtn = card.querySelector(".like-btn");

    likeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLike(song);
    });

    songList.appendChild(card);
  });
}

function renderRecentlyPlayed() {
  if (!recentList) return;

  recentList.innerHTML = "";

  if (recentlyPlayed.length === 0) {
    recentList.innerHTML = `<p class="no-song">No recently played songs</p>`;
    return;
  }

  recentlyPlayed.forEach((song) => {
    const originalIndex = songs.findIndex((item) => item.src === song.src);

    const recentCard = document.createElement("div");
    recentCard.classList.add("recent-card");

    recentCard.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div>
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      </div>
    `;

    recentCard.addEventListener("click", () => {
      currentSongIndex = originalIndex;
      loadSong(currentSongIndex);
      playSong();
      addToRecentlyPlayed(songs[currentSongIndex]);
      applyFilters();
    });

    recentList.appendChild(recentCard);
  });
}

function loadSong(index) {
  const song = songs[index];

  audio.src = song.src;
  currentCover.src = song.cover;
  currentTitle.textContent = song.title;
  currentArtist.textContent = song.artist;
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
  applyFilters();
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  applyFilters();
}

function nextSong() {
  if (isShuffle) {
    let randomIndex = Math.floor(Math.random() * songs.length);

    while (randomIndex === currentSongIndex && songs.length > 1) {
      randomIndex = Math.floor(Math.random() * songs.length);
    }

    currentSongIndex = randomIndex;
  } else {
    currentSongIndex++;

    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
  }

  loadSong(currentSongIndex);
  playSong();
  addToRecentlyPlayed(songs[currentSongIndex]);
}

function prevSong() {
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  loadSong(currentSongIndex);
  playSong();
  addToRecentlyPlayed(songs[currentSongIndex]);
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
    addToRecentlyPlayed(songs[currentSongIndex]);
  }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active-control", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active-control", isRepeat);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

searchInput.addEventListener("input", applyFilters);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active-category");
    });

    button.classList.add("active-category");
    currentCategory = button.getAttribute("data-category");

    applyFilters();
  });
});

if (likedSongsLink) {
  likedSongsLink.addEventListener("click", () => {
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active-category");
    });

    currentCategory = "liked";
    applyFilters();
  });
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${minutes}:${seconds}`;
}

loadSong(currentSongIndex);
loadSongs();
renderRecentlyPlayed();
audio.volume = 0.7;