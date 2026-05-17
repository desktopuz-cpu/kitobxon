const BOOKS = [
  {
    id: 1,
    title: "Атомные привычки",
    author: "Джеймс Клир",
    cover: "images/atomic.jpg",
    desc: "Революционная система для выработки хороших привычек и избавления от плохих. Небольшие изменения дают удивительные результаты.",
    audio: [
      { num: 1, title: "Глава 1 — Удивительная сила атомных привычек", duration: "18 мин" },
      { num: 2, title: "Глава 2 — Как привычки формируют личность", duration: "22 мин" },
      { num: 3, title: "Глава 3 — Четыре закона изменения поведения", duration: "25 мин" },
      { num: 4, title: "Глава 4 — Лучший способ начать новую привычку", duration: "19 мин" },
      { num: 5, title: "Глава 5 — Как оставаться на пути", duration: "20 мин" },
    ]
  },
  {
    id: 2,
    title: "Думай и богатей",
    author: "Наполеон Хилл",
    cover: "images/think.jpg",
    desc: "13 принципов успеха, проверенных временем и тысячами успешных людей.",
    audio: [
      { num: 1, title: "Глава 1 — Мысли это вещи", duration: "15 мин" },
      { num: 2, title: "Глава 2 — Желание", duration: "20 мин" },
      { num: 3, title: "Глава 3 — Вера", duration: "18 мин" },
    ]
  }
];

let currentUser = { name: "Читатель", favorites: [], history: [] };
let currentBook = null;

function loadData() {
  const saved = localStorage.getItem('kitobxon_user');
  if (saved) currentUser = JSON.parse(saved);
}

function saveData() {
  localStorage.setItem('kitobxon_user', JSON.stringify(currentUser));
}

function showHome() {
  document.getElementById('home-page').style.display = 'block';
  document.getElementById('book-page').style.display = 'none';
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('favorites-page').style.display = 'none';
  document.getElementById('history-page').style.display = 'none';
}

function showBook(bookId) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return;
  currentBook = book;

  if (!currentUser.history.find(h => h.id === book.id)) {
    currentUser.history.unshift({ id: book.id, title: book.title, author: book.author, cover: book.cover });
    saveData();
  }

  document.getElementById('book-cover').src = book.cover;
  document.getElementById('book-title').textContent = book.title;
  document.getElementById('book-author').textContent = book.author;
  document.getElementById('book-desc').textContent = book.desc;

  const isFav = currentUser.favorites.find(f => f.id === book.id);
  document.getElementById('fav-btn').textContent = isFav ? '❤️ В избранном' : '🤍 В избранное';

  const audioList = document.getElementById('audio-list');
  audioList.innerHTML = '';
  book.audio.forEach(a => {
    audioList.innerHTML += `
      <div class="audio-item" onclick="playAudio(${a.num})">
        <div class="audio-num">${a.num}</div>
        <div class="audio-info">
          <h4>${a.title}</h4>
          <p>${a.duration}</p>
        </div>
        <div class="play-icon">▶️</div>
      </div>
    `;
  });

  document.getElementById('home-page').style.display = 'none';
  document.getElementById('book-page').style.display = 'block';
  document.getElementById('profile-page').style.display = 'none';
}

function showProfile() {
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('book-page').style.display = 'none';
  document.getElementById('profile-page').style.display = 'block';
  document.getElementById('favorites-page').style.display = 'none';
  document.getElementById('history-page').style.display = 'none';

  if (window.Telegram && Telegram.WebApp.initDataUnsafe.user) {
    currentUser.name = Telegram.WebApp.initDataUnsafe.user.first_name;
    saveData();
  }
  document.getElementById('profile-name').textContent = currentUser.name;
}

function toggleFavorite() {
  if (!currentBook) return;
  const idx = currentUser.favorites.findIndex(f => f.id === currentBook.id);
  if (idx === -1) {
    currentUser.favorites.push({ id: currentBook.id, title: currentBook.title, author: currentBook.author, cover: currentBook.cover });
    document.getElementById('fav-btn').textContent = '❤️ В избранном';
  } else {
    currentUser.favorites.splice(idx, 1);
    document.getElementById('fav-btn').textContent = '🤍 В избранное';
  }
  saveData();
}

function showFavorites() {
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('favorites-page').style.display = 'block';
  const list = document.getElementById('favorites-list');
  if (currentUser.favorites.length === 0) {
    list.innerHTML = '<div class="empty-state"><div>🤍</div><p>Пока нет избранных книг</p></div>';
  } else {
    list.innerHTML = currentUser.favorites.map(b => `
      <div class="book-card" onclick="showBook(${b.id})">
        <img src="${b.cover}" alt="${b.title}">
        <div class="book-card-info"><h3>${b.title}</h3><p>${b.author}</p></div>
      </div>
    `).join('');
  }
}

function showHistory() {
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('history-page').style.display = 'block';
  const list = document.getElementById('history-list');
  if (currentUser.history.length === 0) {
    list.innerHTML = '<div class="empty-state"><div>📖</div><p>Ты ещё не читал книги</p></div>';
  } else {
    list.innerHTML = currentUser.history.map(b => `
      <div class="book-card" onclick="showBook(${b.id})">
        <img src="${b.cover}" alt="${b.title}">
        <div class="book-card-info"><h3>${b.title}</h3><p>${b.author}</p></div>
      </div>
    `).join('');
  }
}

function readBook() {
  alert('📖 Функция чтения скоро появится!');
}

function playAudio(num) {
  alert(`🎧 Глава ${num} скоро появится!`);
}

function openDonate() {
  window.open('https://t.me/твой_username', '_blank');
}

function openSupport() {
  window.open('https://t.me/твой_username', '_blank');
}

function searchBooks(query) {
  const q = query.toLowerCase();
  const filtered = BOOKS.filter(b =>
    b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  );
  renderBooks(filtered);
}

function renderBooks(books) {
  const grid = document.getElementById('books-grid');
  grid.innerHTML = books.map(b => `
    <div class="book-card" onclick="showBook(${b.id})">
      <img src="${b.cover}" alt="${b.title}">
      <div class="book-card-info">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
      </div>
    </div>
  `).join('');
}

loadData();
renderBooks(BOOKS);
