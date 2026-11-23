const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

// Полный резервный каталог (25 позиций / 122 шт.)
const FALLBACK_PRODUCTS = [
  // 1. Поды (8 шт.)
  { id: 1, cat: "pods", brand: "Pasito", name: "Smoant Pasito II", file: "PASITO2", extra_files: "passito-3-500x400", strength: "До 80W • 2500 mAh", sell: 2300, stock: 1, badge: "hit", options: [{ name: "Изумрудный", stock: 1, image: "pasito2_emerald" }] },
  { id: 2, cat: "pods", brand: "Xros", name: "Vaporesso XROS 6 Mini", file: "XROS6mini", extra_files: "", strength: "COREX • Компактный", sell: 1500, stock: 1, badge: "new", options: [{ name: "Оранжевый", stock: 1, image: "xros6mini_orange" }] },
  { id: 3, cat: "pods", brand: "Xros", name: "Vaporesso XROS 5 Mini", file: "XROS5mini1", extra_files: "xros5mini,XROS5mini2", strength: "1000 mAh • COREX", sell: 1300, stock: 6, badge: "hit", options: [{ name: "Серый", stock: 4, image: "xros5mini_grey" }, { name: "Карбон", stock: 2, image: "xros5mini_carbon" }] },

  // 2. Жижи (61 шт.)
  { id: 4, cat: "liquid", brand: "Podonki", name: "PODONKI PODGON 50 мг", file: "podonki_podgon", extra_files: "", strength: "50 мг", sell: 400, stock: 16, badge: "hit", options: [{ name: "Ментол-мята", stock: 7 }, { name: "Ананасовая газировка", stock: 4 }, { name: "Малина-хвоя", stock: 2 }, { name: "Сочная дыня", stock: 2 }, { name: "Классический бабл-гам", stock: 1 }] },
  { id: 5, cat: "liquid", brand: "Duall", name: "DUALL 50 мг", file: "duall", extra_files: "", strength: "50 мг", sell: 400, stock: 13, badge: "hit", options: [{ name: "Манго-апельсин-мята", stock: 6 }, { name: "Манго-кумкват", stock: 3 }, { name: "Кола-лимон", stock: 1 }, { name: "Ледяное манго", stock: 1 }, { name: "Лимонные леденцы", stock: 1 }, { name: "Чай с манго", stock: 1 }] },
  { id: 6, cat: "liquid", brand: "Skala", name: "SKALA 50 мг", file: "SKALA50MG", extra_files: "", strength: "50 мг", sell: 400, stock: 6, badge: "", options: [{ name: "Дыня со льдом", stock: 1 }, { name: "Кактус со льдом", stock: 1 }, { name: "Лимонад со льдом", stock: 1 }, { name: "Манго со льдом", stock: 1 }, { name: "Тархун со льдом", stock: 1 }, { name: "Эрл Грей со льдом", stock: 1 }] },
  { id: 7, cat: "liquid", brand: "Puffmi", name: "PUFFMI 50 мг", file: "puffmi_liq", extra_files: "", strength: "50 мг", sell: 400, stock: 1, badge: "", options: [{ name: "Pear Lemonade", stock: 1 }] },
  { id: 8, cat: "liquid", brand: "Delta", name: "DELTA 60 мг", file: "delta_liq", extra_files: "", strength: "60 мг", sell: 400, stock: 3, badge: "new", options: [{ name: "KillerBrov Mi&Bin", stock: 2 }, { name: "Red Bull зелёный", stock: 1 }] },
  { id: 9, cat: "liquid", brand: "Podonki", name: "PODONKI & HYSTERIA 70 мг", file: "podonki_hysteria", extra_files: "", strength: "70 мг", sell: 450, stock: 5, badge: "hit", options: [{ name: "Cranberry Ice", stock: 1 }, { name: "Monster Energy", stock: 1 }, { name: "Peach Currant", stock: 1 }, { name: "Pear Lemonade", stock: 1 }, { name: "Watermelon Candy", stock: 1 }] },
  { id: 10, cat: "liquid", brand: "Podonki", name: "PODONKI МЕДУЗА 70 мг", file: "podonki_meduza", extra_files: "", strength: "70 мг", sell: 450, stock: 1, badge: "", options: [{ name: "Ice Soda Cola", stock: 1 }] },
  { id: 11, cat: "liquid", brand: "Hotspot", name: "HOTSPOT 70 мг", file: "hotspot", extra_files: "", strength: "70 мг", sell: 450, stock: 1, badge: "", options: [{ name: "Клубника-киви-базилик", stock: 1 }] },
  { id: 12, cat: "liquid", brand: "Animal Love", name: "ANIMAL LOVE 80 мг", file: "ANIMMA80mg", extra_files: "", strength: "80 мг", sell: 450, stock: 13, badge: "hit", options: [{ name: "Апельсин-вишня", stock: 3 }, { name: "Ананас-апельсин", stock: 2 }, { name: "Персиковый лимонад", stock: 2 }, { name: "Тропический банан", stock: 2 }, { name: "Яблочный лимонад", stock: 2 }, { name: "Груша-малина-газировка", stock: 1 }, { name: "Яблоко-киви", stock: 1 }] },
  { id: 13, cat: "liquid", brand: "Злая Монашка", name: "ЗЛАЯ МОНАШКА 80 мг", file: "monashka", extra_files: "", strength: "80 мг", sell: 450, stock: 2, badge: "new", options: [{ name: "Йогурт манго-маракуйя", stock: 1 }, { name: "Ягодный сорбет с грейпфрутом", stock: 1 }] },

  // 3. Одноразки (30 шт.)
  { id: 14, cat: "disposable", brand: "Pillow Talk", name: "Pillow Talk 40000", file: "PIllowTANK40k", extra_files: "", strength: "40 000 тяг", sell: 950, stock: 3, badge: "hit", options: [{ name: "King Fab", stock: 2 }, { name: "Арбуз-лёд", stock: 1 }] },
  { id: 15, cat: "disposable", brand: "YOOZ", name: "YOOZ 25000 / LINKX 25000", file: "YOOZ25000", extra_files: "YOOZ25000 (1)", strength: "25 000 тяг", sell: 850, stock: 11, badge: "hit", options: [{ name: "Малина-лимон", stock: 3 }, { name: "Яблочный лимонад", stock: 2 }, { name: "Персик-лёд", stock: 1 }, { name: "Персик-манго-арбуз", stock: 1 }, { name: "Питая-клубника", stock: 1 }, { name: "Манго-персик", stock: 1 }, { name: "Ананас-мята-лёд", stock: 1 }, { name: "Клубника-арбуз", stock: 1 }] },
  { id: 16, cat: "disposable", brand: "Funky Lands", name: "Funky Lands 15000", file: "FUnki_lands", extra_files: "FUnki_land1s", strength: "15 000 тяг", sell: 800, stock: 4, badge: "", options: [{ name: "Двойное яблоко-лёд", stock: 4 }] },
  { id: 17, cat: "disposable", brand: "Geek Bar", name: "Geek Bar 32000", file: "geek_bar_32000", extra_files: "", strength: "32 000 тяг", sell: 800, stock: 2, badge: "new", options: [{ name: "Прохладный с мятой", stock: 1 }, { name: "Сочный персик-лёд", stock: 1 }] },
  { id: 18, cat: "disposable", brand: "Puffmi", name: "Puffmi 16000", file: "puffmi_16000", extra_files: "", strength: "16 000 тяг", sell: 800, stock: 1, badge: "", options: [{ name: "Ледяной арбуз", stock: 1 }] },
  { id: 19, cat: "disposable", brand: "YOOZ", name: "YOOZ 15000", file: "YOOZ15000 (1)", extra_files: "", strength: "15 000 тяг", sell: 800, stock: 1, badge: "", options: [{ name: "Мята", stock: 1 }] },
  { id: 20, cat: "disposable", brand: "Twister Bar", name: "Twister Bar 9600", file: "twister_bar_9600", extra_files: "", strength: "9 600 тяг", sell: 450, stock: 3, badge: "", options: [{ name: "Лимонадная версия", stock: 1 }, { name: "Тропическая версия", stock: 1 }, { name: "Фруктовая версия", stock: 1 }] },
  { id: 21, cat: "disposable", brand: "Geek Bar", name: "Geek Bar Meloso 30000", file: "geek_bar_meloso", extra_files: "", strength: "30 000 тяг", sell: 450, stock: 2, badge: "new", options: [{ name: "Кислый боярышник", stock: 2 }] },
  { id: 22, cat: "disposable", brand: "Puffmi", name: "Puffmi 12000", file: "puffmi_12000", extra_files: "", strength: "12 000 тяг", sell: 400, stock: 3, badge: "", options: [{ name: "Табак", stock: 2 }, { name: "Имбирное пиво", stock: 1 }] },

  // 4. Расходники (14 шт.)
  { id: 23, cat: "consumable", brand: "Xros", name: "Картридж Vaporesso XROS 0.6Ω", file: "kartridj0.6", extra_files: "", strength: "0.6 Ω • COREX", sell: 300, stock: 11, badge: "hit", options: [] },
  { id: 24, cat: "consumable", brand: "Aegis", name: "Картридж Aegis Hero 5", file: "kartridj_hero5", extra_files: "", strength: "Для Aegis Hero 5", sell: 300, stock: 2, badge: "", options: [] },
  { id: 25, cat: "consumable", brand: "Pasito", name: "Испаритель Smoant Pasito 2/3 (K-5, 0.15Ω, 70–90W)", file: "Pasito2u3_ispariteli", extra_files: "", strength: "0.15 Ω • 70–90W", sell: 300, stock: 1, badge: "", options: [] },

  // 5. Снюс / Пластинки (9 шт.)
  { id: 26, cat: "snus", brand: "Delta & Burn", name: "Снюс / Никпаки Delta & Burn", file: "snus_delta", extra_files: "", strength: "Шайбы • Никпаки", sell: 400, stock: 6, badge: "hit", options: [{ name: "Delta Adrenaline Rush Hot Effect", stock: 2 }, { name: "Delta KillerBrov Triple Shot", stock: 2 }, { name: "Delta Burn Energy Фруктовый пунш", stock: 1 }, { name: "Burn Яблоко-киви", stock: 1 }] },
  { id: 27, cat: "snus", brand: "Adrenaline", name: "Снюс / Никпаки Adrenaline", file: "snus_adrenaline", extra_files: "", strength: "Шайбы • Никпаки", sell: 400, stock: 3, badge: "new", options: [{ name: "Adrenaline Vitamin Power", stock: 1 }, { name: "Adrenaline Energy Power", stock: 1 }, { name: "Adrenaline Pepsi", stock: 1 }] }
];

let allProducts = [...FALLBACK_PRODUCTS];
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem("kosmos_favs") || "[]");
  if (!Array.isArray(favorites)) favorites = [];
} catch (e) {
  favorites = [];
}

// Защищенный парсинг корзины: ключи формата "id" или "id::Вкус/Цвет" -> число qty
let cart = {};
try {
  const rawCart = JSON.parse(localStorage.getItem("kosmos_cart_v2") || "{}");
  if (rawCart && typeof rawCart === "object" && !Array.isArray(rawCart)) {
    for (const [k, v] of Object.entries(rawCart)) {
      const num = typeof v === "number" ? v : (v && typeof v === "object" ? Number(v.qty) : Number(v));
      if (Number.isFinite(num) && num > 0) {
        cart[k] = Math.round(num);
      }
    }
  }
} catch (e) {
  cart = {};
}
localStorage.setItem("kosmos_cart_v2", JSON.stringify(cart));

// Выбранный цвет на карточках подов (id -> название цвета)
let selectedCardOption = {};

let activeCategory = "all";
let activeSubfilter = "all";
let selectedDateMode = "Сегодня";
let selectedPayment = "Перевод";

const CATEGORY_NAMES = {
  all: "Популярное",
  liquid: "Жидкости",
  pods: "Под-системы",
  disposable: "Одноразки",
  consumable: "Расходники",
  snus: "Снюс / Пластинки",
};

const DISTRICT_LANDMARKS = {
  "ЧТЗ": ["ТРК Горки", "Комсомольская пл.", "Сад Победы", "Башня"],
  "Центральный": ["Алое Поле", "Пл. Революции", "ТРК Урал", "Кировка"],
  "Северо-Запад": ["ТРК Родник", "ТРК Фокус", "ТРК Космос", "Прииск"],
  "Теплотех": ["Теплотехнический ин-т", "Киномакс Победа", "Перекресток Кирова/Победы"],
  "Ленинский": ["ТРК Алмаз", "Аврора", "ДК ЧТПЗ"],
  "Советский": ["ТК Синегорье", "Ж/Д Вокзал", "Гостиница Меридиан"],
};

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.add("hidden"), 1800);
}

function makeCartKey(pid, optionName) {
  const cleanOpt = (optionName || "").trim();
  return cleanOpt ? `${pid}::${cleanOpt}` : `${pid}`;
}

function parseCartKey(key) {
  const idx = key.indexOf("::");
  if (idx === -1) return { id: Number(key), option: "" };
  return {
    id: Number(key.slice(0, idx)),
    option: key.slice(idx + 2),
  };
}

function getProductCartCount(pid) {
  let count = 0;
  for (const [k, qty] of Object.entries(cart)) {
    const parsed = parseCartKey(k);
    if (parsed.id === pid) count += qty;
  }
  return count;
}

// ================= 1. ПРОВЕРКА ВОЗРАСТА 18+ =================
function initAgeGate() {
  const modal = document.getElementById("age-modal");
  if (localStorage.getItem("kosmos_age_ok") !== "1") {
    modal.classList.remove("hidden");
  }
  document.getElementById("age-confirm-btn").addEventListener("click", () => {
    localStorage.setItem("kosmos_age_ok", "1");
    modal.classList.add("hidden");
  });
  document.getElementById("age-deny-btn").addEventListener("click", () => {
    document.querySelector(".age-box").innerHTML = `
      <div class="age-badge">18+</div>
      <h2>Доступ закрыт</h2>
      <p>Магазин предназначен строго для совершеннолетних пользователей (18+).</p>
    `;
  });
}

// ================= 2. АВТО-ВИТРИНА STORIES (7.5 СЕК) =================
function initShowcase() {
  const slides = document.querySelectorAll(".story-slide");
  const barsContainer = document.getElementById("story-bars");
  const total = slides.length;
  let current = 0;
  let progress = 0;
  let paused = false;
  const duration = 7500;
  const step = 100;

  barsContainer.innerHTML = Array.from({ length: total })
    .map(() => `<div class="story-bar"><div class="story-bar-fill"></div></div>`)
    .join("");
  const fills = barsContainer.querySelectorAll(".story-bar-fill");

  function showSlide(index) {
    current = (index + total) % total;
    progress = 0;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    fills.forEach((f, i) => {
      f.style.width = i < current ? "100%" : "0%";
    });
  }

  setInterval(() => {
    if (paused) return;
    progress += step;
    const pct = Math.min(100, (progress / duration) * 100);
    if (fills[current]) fills[current].style.width = `${pct}%`;
    if (progress >= duration) {
      showSlide(current + 1);
    }
  }, step);

  document.getElementById("story-prev").addEventListener("click", () => showSlide(current - 1));
  document.getElementById("story-next").addEventListener("click", () => showSlide(current + 1));

  let startX = 0;
  const showcase = document.getElementById("showcase");
  showcase.addEventListener("touchstart", (e) => {
    paused = true;
    startX = e.touches[0].clientX;
  });
  showcase.addEventListener("touchend", (e) => {
    paused = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      showSlide(diff > 0 ? current - 1 : current + 1);
    }
  });
}

// ================= 3. КАТАЛОГ, ВКЛАДКИ ЦВЕТОВ И ВЫБОР ВКУСОВ =================
async function loadCatalog() {
  try {
    const res = await fetch("/api/catalog");
    const data = await res.json();
    if (data.ok && Array.isArray(data.products) && data.products.length > 0) {
      allProducts = data.products;
    }
  } catch (e) {
    console.warn("Используется резервный каталог:", e);
  }

  const totalUnits = allProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const stockEl = document.getElementById("profile-total-stock");
  if (stockEl) stockEl.textContent = `${totalUnits} шт.`;

  renderProducts();
  renderCart();
}

function buildSubfilters() {
  const bar = document.getElementById("subfilters-bar");
  if (activeCategory === "all") {
    bar.classList.add("hidden");
    return;
  }

  let options = ["all"];
  if (activeCategory === "liquid") {
    options.push("50 мг", "60 мг", "70 мг", "80 мг");
  } else if (activeCategory === "pods") {
    options.push("Xros", "Pasito", "Серый", "Карбон", "Оранжевый", "Изумрудный");
  } else if (activeCategory === "disposable") {
    options.push("Pillow Talk", "YOOZ", "Funky Lands", "Geek Bar", "Puffmi", "Twister Bar");
  } else if (activeCategory === "consumable") {
    options.push("Xros", "Aegis", "Pasito");
  } else if (activeCategory === "snus") {
    options.push("Delta & Burn", "Adrenaline");
  }

  bar.innerHTML = options
    .map(
      (opt) =>
        `<button class="subfilter-chip ${activeSubfilter === opt ? "active" : ""}" data-sub="${opt}">
          ${opt === "all" ? "Все" : opt}
        </button>`
    )
    .join("");
  bar.classList.remove("hidden");

  bar.querySelectorAll(".subfilter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeSubfilter = btn.dataset.sub;
      buildSubfilters();
      renderProducts();
    });
  });
}

function createProductCardHTML(p) {
  const isFav = favorites.includes(p.id);
  const inCartQty = getProductCartCount(p.id);
  const opts = Array.isArray(p.options) ? p.options.filter((o) => Number(o.stock) > 0) : [];

  if (opts.length > 0 && !selectedCardOption[p.id]) {
    selectedCardOption[p.id] = opts[0].name;
  }

  let badgeHTML = "";
  if (p.stock <= 0) {
    badgeHTML = `<span class="card-badge badge-out">Нет в наличии</span>`;
  } else if (p.badge === "hit") {
    badgeHTML = `<span class="card-badge badge-hit">🔥 Хит</span>`;
  } else if (p.badge === "new") {
    badgeHTML = `<span class="card-badge badge-new">💥 Новинка</span>`;
  }

  const activeOptObj = opts.find((o) => o.name === selectedCardOption[p.id]) || opts[0];
  const primaryImgFile = activeOptObj?.image ? activeOptObj.image : p.file;
  const fallbackMainImg = `/images/${encodeURIComponent(p.file)}`;
  const placeholderImg = `https://placehold.co/300x300/181a20/c084fc?text=${encodeURIComponent(p.name)}`;

  // Для подов — вкладки расцветок прямо на карточке
  let optionsBlockHTML = "";
  if (p.cat === "pods" && opts.length > 0) {
    optionsBlockHTML = `
      <div class="card-color-tabs">
        ${opts
          .map(
            (o) => `
            <button type="button" class="color-tab-btn ${selectedCardOption[p.id] === o.name ? "active" : ""}"
                    data-color-pid="${p.id}" data-color-name="${o.name}">
              ${o.name} (${o.stock})
            </button>`
          )
          .join("")}
      </div>
    `;
  } else if (opts.length > 0) {
    const labelText =
      opts.length === 1
        ? `Вкус: ${opts[0].name} (${opts[0].stock} шт.)`
        : `Выбрать вкус (${opts.length} вид. • ${p.stock} шт.) ▾`;
    optionsBlockHTML = `
      <button type="button" class="flavor-hint-btn" data-open="${p.id}">
        ${labelText}
      </button>
    `;
  }

  const subText = `${p.strength ? p.strength + " • " : ""}В наличии: ${p.stock} шт.`;
  const qtyBadge = inCartQty > 0 ? `<span class="in-cart-dot">${inCartQty}</span>` : "";

  return `
    <div class="product-card" data-id="${p.id}">
      ${badgeHTML}
      <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${p.id}">♥</button>
      <div class="card-img-wrap" data-open="${p.id}">
        <img id="card-img-${p.id}" src="/images/${encodeURIComponent(primaryImgFile)}" alt="${p.name}" loading="lazy"
             onerror="if(this.src.indexOf('${encodeURIComponent(p.file)}')===-1){this.src='${fallbackMainImg}';}else{this.src='${placeholderImg}';}" />
      </div>
      <div>
        <div class="card-title" data-open="${p.id}">${p.name}</div>
        <div class="card-sub">${subText}</div>
        ${optionsBlockHTML}
        <div class="card-bottom">
          <span class="card-price">${Math.round(p.sell).toLocaleString("ru-RU")} ₽</span>
          <button class="add-btn" data-add="${p.id}">+${qtyBadge}</button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const grid = document.getElementById("products-grid");

  const filtered = allProducts.filter((p) => {
    if (activeCategory !== "all" && p.cat !== activeCategory) return false;
    if (activeSubfilter !== "all") {
      const subLower = activeSubfilter.toLowerCase();
      const matchBrand = p.brand && p.brand.toLowerCase() === subLower;
      const matchStrength = p.strength && p.strength.toLowerCase() === subLower;
      const matchOpt =
        Array.isArray(p.options) &&
        p.options.some((o) => o.name.toLowerCase().includes(subLower) && Number(o.stock) > 0);
      if (!matchBrand && !matchStrength && !matchOpt) return false;
    }
    if (query) {
      const optsText = Array.isArray(p.options) ? p.options.map((o) => o.name).join(" ") : "";
      const hay = `${p.name} ${p.brand} ${p.strength} ${optsText}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; color: #8b909a; padding: 24px 0; text-align:center;">По вашему запросу ничего не найдено</p>`;
  } else {
    grid.innerHTML = filtered.map(createProductCardHTML).join("");
  }

  bindCardEvents(grid);
}

function renderFavorites() {
  const grid = document.getElementById("favorites-grid");
  const favItems = allProducts.filter((p) => favorites.includes(p.id));
  grid.innerHTML = favItems.length
    ? favItems.map(createProductCardHTML).join("")
    : `<p style="grid-column: 1/-1; color: #8b909a; text-align:center; padding: 24px 0;">Нажмите ♥ на карточке товара, чтобы добавить его в избранное</p>`;
  bindCardEvents(grid);
}

function bindCardEvents(container) {
  // Переключение вкладок расцветок на карточках подов
  container.querySelectorAll("[data-color-pid]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pid = Number(btn.dataset.colorPid);
      const colorName = btn.dataset.colorName;
      selectedCardOption[pid] = colorName;
      renderProducts();
      renderFavorites();
    });
  });

  // Нажатие на "+"
  container.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pid = Number(btn.dataset.add);
      const p = allProducts.find((x) => x.id === pid);
      if (!p) return;

      const availOpts = Array.isArray(p.options) ? p.options.filter((o) => Number(o.stock) > 0) : [];
      if (p.cat === "pods" && availOpts.length > 0) {
        const chosenColor = selectedCardOption[pid] || availOpts[0].name;
        addToCart(pid, chosenColor);
      } else if (availOpts.length === 1) {
        addToCart(pid, availOpts[0].name);
      } else if (availOpts.length > 1) {
        // Если у жидкости/одноразки/снюса несколько вкусов — открываем выбор вкуса
        openProductModal(pid);
      } else {
        addToCart(pid, "");
      }
    });
  });

  container.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFav(Number(btn.dataset.fav));
    });
  });

  container.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => openProductModal(Number(el.dataset.open)));
  });
}

function openProductModal(id) {
  const p = allProducts.find((item) => item.id === id);
  if (!p) return;

  const opts = Array.isArray(p.options) ? p.options : [];
  const availOpts = opts.filter((o) => Number(o.stock) > 0);
  let currentModalOption =
    selectedCardOption[p.id] && availOpts.some((o) => o.name === selectedCardOption[p.id])
      ? selectedCardOption[p.id]
      : availOpts[0]?.name || "";

  function renderModalGallery(optName) {
    const optObj = opts.find((o) => o.name === optName);
    const files = [
      ...(optObj?.image ? [optObj.image] : []),
      p.file,
      ...(p.extra_files ? p.extra_files.split(",") : []),
    ]
      .map((s) => s.trim())
      .filter(Boolean);

    const uniqueFiles = [...new Set(files)];
    const fallbackMain = `/images/${encodeURIComponent(p.file)}`;
    const placeholder = `https://placehold.co/300x300/181a20/c084fc?text=${encodeURIComponent(p.name)}`;

    document.getElementById("modal-gallery").innerHTML = uniqueFiles
      .map(
        (f) =>
          `<img src="/images/${encodeURIComponent(f)}" alt="${p.name}"
                onerror="if(this.src.indexOf('${encodeURIComponent(p.file)}')===-1){this.src='${fallbackMain}';}else{this.src='${placeholder}';}" />`
      )
      .join("");
  }

  renderModalGallery(currentModalOption);

  document.getElementById("modal-prod-title").textContent = p.name;
  document.getElementById("modal-prod-sub").textContent = `${
    p.strength ? p.strength + " • " : ""
  }Всего в наличии: ${p.stock} шт.`;
  document.getElementById("modal-prod-price").textContent = `${Math.round(p.sell).toLocaleString("ru-RU")} ₽`;

  const optionsWrap = document.getElementById("modal-options-wrap");
  const optionsList = document.getElementById("modal-options-list");
  const optionsLabel = document.getElementById("modal-options-label");

  if (opts.length > 0) {
    optionsLabel.textContent = p.cat === "pods" ? "Выберите цвет устройства:" : "Выберите вкус (в наличии):";
    optionsList.innerHTML = opts
      .map((o) => {
        const isOut = Number(o.stock) <= 0;
        const isActive = o.name === currentModalOption;
        return `
          <button type="button" class="option-choice-btn ${isActive ? "active" : ""} ${isOut ? "disabled" : ""}"
                  data-opt-name="${o.name}">
            <span>${o.name}</span>
            <span class="option-stock-tag">${isOut ? "Нет в наличии" : `${o.stock} шт.`}</span>
          </button>
        `;
      })
      .join("");
    optionsWrap.classList.remove("hidden");

    optionsList.querySelectorAll(".option-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentModalOption = btn.dataset.optName;
        selectedCardOption[p.id] = currentModalOption;
        optionsList.querySelectorAll(".option-choice-btn").forEach((b) =>
          b.classList.toggle("active", b.dataset.optName === currentModalOption)
        );
        renderModalGallery(currentModalOption);
      });
    });
  } else {
    optionsWrap.classList.add("hidden");
  }

  document.getElementById("modal-add-btn").onclick = () => {
    if (opts.length > 0 && !currentModalOption) {
      alert("Выберите доступный вкус или цвет!");
      return;
    }
    addToCart(p.id, currentModalOption);
    document.getElementById("product-modal").classList.add("hidden");
  };

  document.getElementById("product-modal").classList.remove("hidden");
}

function toggleFav(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((x) => x !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("kosmos_favs", JSON.stringify(favorites));
  renderProducts();
  renderFavorites();
}

// ================= 4. КОРЗИНА С УЧЕТОМ ОСТАТКОВ ПО ВКУСАМ И ЦВЕТАМ =================
function getMaxStockForOption(p, optionName) {
  if (!p) return 0;
  if (optionName && Array.isArray(p.options) && p.options.length > 0) {
    const found = p.options.find((o) => o.name === optionName);
    if (found) return Number(found.stock) || 0;
  }
  return Number(p.stock) || 0;
}

function addToCart(pid, optionName = "") {
  const p = allProducts.find((x) => x.id === pid);
  if (!p || p.stock <= 0) {
    showToast("Товар закончился");
    return;
  }

  const key = makeCartKey(pid, optionName);
  const currentQty = cart[key] || 0;
  const maxStock = getMaxStockForOption(p, optionName);

  if (maxStock > 0 && currentQty >= maxStock) {
    showToast(`Максимум в наличии: ${maxStock} шт.`);
    return;
  }

  cart[key] = currentQty + 1;
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
  saveCart();
  renderProducts();
  renderFavorites();
  showToast(optionName ? `Добавлено: ${optionName} 🛒` : "Добавлено в корзину 🛒");
}

function changeCartKeyQty(key, delta) {
  if (!cart[key]) return;
  const { id, option } = parseCartKey(key);
  const p = allProducts.find((x) => x.id === id);
  const maxStock = getMaxStockForOption(p, option);

  const nextQty = cart[key] + delta;
  if (delta > 0 && maxStock > 0 && nextQty > maxStock) {
    showToast(`В наличии всего ${maxStock} шт.`);
    return;
  }

  if (nextQty <= 0) {
    delete cart[key];
  } else {
    cart[key] = nextQty;
  }
  saveCart();
  renderProducts();
  renderFavorites();
}

function saveCart() {
  localStorage.setItem("kosmos_cart_v2", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items-list");
  const form = document.getElementById("checkout-form");
  const badge = document.getElementById("cart-badge");
  const clearBtn = document.getElementById("clear-cart-btn");

  const entries = Object.entries(cart);
  const totalCount = entries.reduce((acc, [, q]) => acc + q, 0);

  if (totalCount > 0) {
    badge.textContent = totalCount;
    badge.classList.remove("hidden");
    clearBtn.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
    clearBtn.classList.add("hidden");
  }

  if (entries.length === 0) {
    list.innerHTML = `<p style="color:#8b909a; text-align:center; padding: 28px 0;">Ваша корзина пока пуста</p>`;
    form.classList.add("hidden");
    return;
  }

  let totalSum = 0;
  list.innerHTML = entries
    .map(([key, qty]) => {
      const { id, option } = parseCartKey(key);
      const p = allProducts.find((x) => x.id === id);
      if (!p) return "";
      const sum = p.sell * qty;
      totalSum += sum;
      const optBadge = option
        ? `<div style="color:#c084fc; font-size:11.5px; font-weight:600; margin-top:2px;">Вариант: ${option}</div>`
        : "";
      const encodedKey = encodeURIComponent(key);
      return `
        <div class="cart-item">
          <div>
            <div style="font-weight:700; font-size:14px;">${p.name}</div>
            ${optBadge}
            <div style="color:#8b909a; font-size:12px; margin-top:2px;">${Math.round(p.sell)} ₽ × ${qty} = ${Math.round(sum)} ₽</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-cart-key="${encodedKey}" data-delta="-1">−</button>
            <span>${qty}</span>
            <button class="qty-btn" data-cart-key="${encodedKey}" data-delta="1">+</button>
          </div>
        </div>
      `;
    })
    .join("");

  list.querySelectorAll("[data-cart-key]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = decodeURIComponent(btn.dataset.cartKey);
      const d = Number(btn.dataset.delta);
      changeCartKeyQty(k, d);
    });
  });

  document.getElementById("cart-total-sum").textContent = `${Math.round(totalSum).toLocaleString("ru-RU")} ₽`;
  form.classList.remove("hidden");
  updateTimeSlots();
  renderLandmarkChips();
}

function renderLandmarkChips() {
  const district = document.getElementById("district-select").value;
  const bar = document.getElementById("landmark-chips");
  const points = DISTRICT_LANDMARKS[district] || [];
  bar.innerHTML = points
    .map((pt) => `<button type="button" class="subfilter-chip" data-point="${pt}">📍 ${pt}</button>`)
    .join("");

  bar.querySelectorAll("[data-point]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("address-input").value = btn.dataset.point;
    });
  });
}

function getChelyabinskMinutesNow() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const chelDate = new Date(utcMs + 5 * 3600000); // UTC+5
  return chelDate.getHours() * 60 + chelDate.getMinutes();
}

function updateTimeSlots() {
  const select = document.getElementById("time-slot-select");
  const chelNowMins = getChelyabinskMinutesNow();
  const slots = [];

  for (let h = 12; h < 22; h++) {
    for (let m of [0, 30]) {
      const startMins = h * 60 + m;
      const endMins = startMins + 30;
      if (selectedDateMode === "Сегодня" && startMins <= chelNowMins + 15) {
        continue;
      }
      const pad = (n) => String(n).padStart(2, "0");
      const endH = Math.floor(endMins / 60);
      const endM = endMins % 60;
      slots.push(`${pad(h)}:${pad(m)} – ${pad(endH)}:${pad(endM)}`);
    }
  }

  if (slots.length === 0) {
    select.innerHTML = `<option value="По согласованию">На сегодня слоты вышли — выбери «Завтра» или по согласованию</option>`;
  } else {
    select.innerHTML = slots.map((s) => `<option value="${s}">${s}</option>`).join("");
  }
}

// ================= 5. ИСТОРИЯ ЗАКАЗОВ И КНОПКА «ПОВТОРИТЬ ЗАКАЗ» =================
async function renderOrderHistory() {
  const container = document.getElementById("order-history-list");
  let localHistory = [];
  try {
    localHistory = JSON.parse(localStorage.getItem("kosmos_order_history") || "[]");
    if (!Array.isArray(localHistory)) localHistory = [];
  } catch (e) {
    localHistory = [];
  }

  const tgUser = tg?.initDataUnsafe?.user;
  if (tgUser?.id) {
    try {
      const res = await fetch(`/api/orders?user_id=${tgUser.id}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.orders) && data.orders.length > 0) {
        localHistory = data.orders;
      }
    } catch (e) {
      // Используем локальную историю при оффлайне
    }
  }

  if (localHistory.length === 0) {
    container.innerHTML = `<p style="color:#8b909a; text-align:center; padding: 18px 0;">У вас пока нет оформленных заказов</p>`;
    return;
  }

  container.innerHTML = localHistory
    .map((ord, idx) => {
      const items = Array.isArray(ord.items) ? ord.items : [];
      const lines = items
        .map((i) => `${i.name}${i.option ? " (" + i.option + ")" : ""} ×${i.qty}`)
        .join(", ");
      return `
        <div class="history-card">
          <div class="row-between">
            <strong>Заказ №${ord.id || idx + 1}</strong>
            <span class="muted">${ord.created_at || ord.delivery_date || ""}</span>
          </div>
          <div style="font-size:12.5px; color:#cbd5e1;">${lines}</div>
          <div class="row-between" style="margin-top:4px;">
            <strong style="color:#c084fc;">${Math.round(ord.total_price || 0)} ₽</strong>
            <button type="button" class="repeat-order-btn" data-repeat-idx="${idx}">🔁 Повторить заказ</button>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll("[data-repeat-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const ord = localHistory[Number(btn.dataset.repeatIdx)];
      if (!ord || !Array.isArray(ord.items)) return;
      ord.items.forEach((it) => {
        const key = makeCartKey(Number(it.id), it.option || it.note || "");
        cart[key] = (cart[key] || 0) + (Number(it.qty) || 1);
      });
      saveCart();
      renderProducts();
      showToast("Товары из заказа добавлены в корзину 🛒");
      document.querySelector('[data-tab="tab-cart"]').click();
    });
  });
}

// ================= 6. ИНТЕРАКТИВНАЯ КАРТА ЧЕЛЯБИНСКА =================
function buildFallbackMapDataURI() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="#10121a"/>
    <text x="400" y="60" fill="#d8b4fe" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">ЗОНЫ ДОСТАВКИ KOSMOS SHOP (ЧЕЛЯБИНСК)</text>
    <rect x="70" y="120" width="290" height="200" rx="22" fill="#1e1b4b" stroke="#60a5fa" stroke-width="3"/>
    <text x="215" y="210" fill="#fff" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">СЕВЕРО-ЗАПАД</text>
    <text x="215" y="245" fill="#93c5fd" font-family="sans-serif" font-size="16" text-anchor="middle">Родник • Фокус • Космос</text>
    <rect x="400" y="120" width="330" height="200" rx="22" fill="#2e1065" stroke="#a855f7" stroke-width="3"/>
    <text x="565" y="210" fill="#fff" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">ТЕПЛОТЕХ</text>
    <text x="565" y="245" fill="#d8b4fe" font-family="sans-serif" font-size="16" text-anchor="middle">Кирова / пр. Победы</text>
    <rect x="70" y="350" width="310" height="200" rx="22" fill="#3b0764" stroke="#c084fc" stroke-width="4"/>
    <text x="225" y="440" fill="#fff" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">ЦЕНТРАЛЬНЫЙ</text>
    <text x="225" y="475" fill="#e9d5ff" font-family="sans-serif" font-size="16" text-anchor="middle">Алое Поле • Пл. Революции • Урал</text>
    <rect x="410" y="350" width="320" height="200" rx="22" fill="#4c0519" stroke="#f472b6" stroke-width="4"/>
    <text x="570" y="440" fill="#fff" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">ЧТЗ</text>
    <text x="570" y="475" fill="#fbcfe8" font-family="sans-serif" font-size="16" text-anchor="middle">ТРК Горки • Комсомольская пл.</text>
    <rect x="70" y="580" width="310" height="160" rx="22" fill="#064e3b" stroke="#34d399" stroke-width="3"/>
    <text x="225" y="655" fill="#fff" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">СОВЕТСКИЙ</text>
    <text x="225" y="690" fill="#6ee7b7" font-family="sans-serif" font-size="16" text-anchor="middle">Синегорье • Вокзал</text>
    <rect x="410" y="580" width="320" height="160" rx="22" fill="#083344" stroke="#22d3ee" stroke-width="3"/>
    <text x="570" y="655" fill="#fff" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">ЛЕНИНСКИЙ</text>
    <text x="570" y="690" fill="#67e8f9" font-family="sans-serif" font-size="16" text-anchor="middle">ТРК Алмаз • Аврора</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function initInteractiveMap() {
  const modal = document.getElementById("map-modal");
  const img = document.getElementById("map-image");
  const viewport = document.getElementById("map-viewport");

  img.onerror = () => {
    img.onerror = null;
    img.src = buildFallbackMapDataURI();
  };

  let scale = 1;
  let posX = 0;
  let posY = 0;
  let startX = 0;
  let startY = 0;
  let initialPinchDist = null;
  let initialScale = 1;

  function applyTransform() {
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }

  document.getElementById("open-map-btn").addEventListener("click", () => modal.classList.remove("hidden"));
  document.getElementById("profile-map-btn").addEventListener("click", () => modal.classList.remove("hidden"));
  document.getElementById("close-map-modal").addEventListener("click", () => modal.classList.add("hidden"));

  document.getElementById("zoom-in-btn").addEventListener("click", () => {
    scale = Math.min(4, scale + 0.5);
    applyTransform();
  });
  document.getElementById("zoom-out-btn").addEventListener("click", () => {
    scale = Math.max(1, scale - 0.5);
    if (scale === 1) { posX = 0; posY = 0; }
    applyTransform();
  });
  document.getElementById("zoom-reset-btn").addEventListener("click", () => {
    scale = 1; posX = 0; posY = 0;
    applyTransform();
  });

  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      initialPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialScale = scale;
    } else if (e.touches.length === 1) {
      startX = e.touches[0].clientX - posX;
      startY = e.touches[0].clientY - posY;
    }
  });

  viewport.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && initialPinchDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      scale = Math.min(4, Math.max(1, initialScale * (dist / initialPinchDist)));
      applyTransform();
    } else if (e.touches.length === 1 && scale > 1) {
      posX = e.touches[0].clientX - startX;
      posY = e.touches[0].clientY - startY;
      applyTransform();
    }
  }, { passive: false });
}

// ================= 7. ОТПРАВКА ЗАКАЗА =================
async function submitOrder() {
  const address = document.getElementById("address-input").value.trim();
  if (!address) {
    alert("Пожалуйста, выберите ориентир встречи или введите адрес!");
    return;
  }

  const deliveryDate =
    selectedDateMode === "custom"
      ? document.getElementById("custom-date-input").value || "По договоренности"
      : selectedDateMode;

  const tgUser = tg?.initDataUnsafe?.user || {};
  const orderItems = Object.entries(cart).map(([key, qty]) => {
    const { id, option } = parseCartKey(key);
    const p = allProducts.find((x) => x.id === id);
    return {
      id: Number(id),
      name: p ? p.name : `Товар #${id}`,
      sell: p ? p.sell : 0,
      qty: Number(qty),
      option: option || "",
      note: option || "",
    };
  });

  const payload = {
    user: {
      id: Number(tgUser.id) || 0,
      username: tgUser.username || "без_юзернейма",
      full_name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || "Клиент MiniApp",
    },
    delivery_date: deliveryDate,
    time_slot: document.getElementById("time-slot-select").value,
    district: document.getElementById("district-select").value,
    address,
    payment_method: selectedPayment,
    comment: document.getElementById("comment-input").value,
    items: orderItems,
  };

  const btn = document.getElementById("submit-order-btn");
  btn.disabled = true;
  btn.textContent = "Отправляем заказ...";

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) {
      // Сохраняем в локальную историю для кнопки «Повторить заказ»
      try {
        const hist = JSON.parse(localStorage.getItem("kosmos_order_history") || "[]");
        const total = orderItems.reduce((acc, i) => acc + i.sell * i.qty, 0);
        hist.unshift({
          id: data.order_id,
          delivery_date: `${deliveryDate}, ${payload.time_slot}`,
          total_price: total,
          items: orderItems,
        });
        localStorage.setItem("kosmos_order_history", JSON.stringify(hist.slice(0, 15)));
      } catch (e) {}

      cart = {};
      saveCart();
      renderProducts();
      alert(`✅ Заказ №${data.order_id} принят! Менеджер скоро свяжется с вами.`);
      if (tg) tg.close();
      return;
    } else {
      alert("Ошибка: " + (data.error || "не удалось оформить заказ"));
    }
  } catch (e) {
    if (tg?.sendData) {
      tg.sendData(JSON.stringify(payload));
      return;
    }
    alert("Не удалось связаться с сервером бота. Проверьте соединение.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Подтвердить заказ";
  }
}

// ================= ИНИЦИАЛИЗАЦИЯ =================
document.addEventListener("DOMContentLoaded", () => {
  initAgeGate();
  initShowcase();
  initInteractiveMap();
  loadCatalog();

  const tgUser = tg?.initDataUnsafe?.user;
  if (tgUser) {
    document.getElementById("profile-name").textContent =
      [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || "Покупатель";
    document.getElementById("profile-username").textContent = tgUser.username
      ? `@${tgUser.username}`
      : `ID: ${tgUser.id}`;
  }

  document.getElementById("search-input").addEventListener("input", renderProducts);

  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      activeCategory = activeCategory === cat ? "all" : cat;
      activeSubfilter = "all";

      document.querySelectorAll(".cat-btn").forEach((b) =>
        b.classList.toggle("active", b.dataset.cat === activeCategory)
      );
      document.getElementById("catalog-title").textContent = CATEGORY_NAMES[activeCategory];
      document.getElementById("reset-filter-btn").classList.toggle("hidden", activeCategory === "all");

      buildSubfilters();
      renderProducts();
    });
  });

  document.getElementById("reset-filter-btn").addEventListener("click", () => {
    activeCategory = "all";
    activeSubfilter = "all";
    document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
    document.getElementById("catalog-title").textContent = "Популярное";
    document.getElementById("reset-filter-btn").classList.add("hidden");
    buildSubfilters();
    renderProducts();
  });

  document.getElementById("clear-cart-btn").addEventListener("click", () => {
    cart = {};
    saveCart();
    renderProducts();
  });

  document.getElementById("district-select").addEventListener("change", renderLandmarkChips);

  document.querySelectorAll("#date-pills .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#date-pills .pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedDateMode = btn.dataset.date;
      document.getElementById("custom-date-input").classList.toggle("hidden", selectedDateMode !== "custom");
      updateTimeSlots();
    });
  });

  document.querySelectorAll("#payment-pills .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#payment-pills .pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPayment = btn.dataset.pay;
    });
  });

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "tab-favorites") renderFavorites();
      if (btn.dataset.tab === "tab-cart") renderCart();
      if (btn.dataset.tab === "tab-profile") renderOrderHistory();
    });
  });

  document.getElementById("close-product-modal").addEventListener("click", () => {
    document.getElementById("product-modal").classList.add("hidden");
  });

  document.getElementById("submit-order-btn").addEventListener("click", submitOrder);
});