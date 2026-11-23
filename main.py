import asyncio
import json
import os
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

from aiohttp import web
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
)

# ================= НАСТРОЙКИ ПРОЕКТА =================
BOT_TOKEN = os.getenv("BOT_TOKEN", "8795850712:AAE7V-0EnEqqf-qlOO_V50wAz8wmvrkFr4o")
ADMIN_ID = int(os.getenv("ADMIN_ID", "1122247879"))
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://195-226-93-70.sslip.io") 
PORT = int(os.getenv("PORT", "8080"))

BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "images"
DB_PATH = BASE_DIR / "shop.db"

# Часовой пояс Челябинска (UTC+5)
CHELYABINSK_TZ = timezone(timedelta(hours=5))
CATALOG_VERSION = "v2_actual_122"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


def now_chelyabinsk() -> datetime:
    return datetime.now(CHELYABINSK_TZ)


# ================= АКТУАЛЬНОЕ НАЛИЧИЕ (25 ПОЗИЦИЙ / 122 ШТ.) =================
INITIAL_CATALOG = [
    # КАТЕГОРИЯ 1: ПОДЫ (8 шт.)
    {
        "id": 1,
        "cat": "pods",
        "brand": "Pasito",
        "name": "Smoant Pasito II",
        "file": "PASITO2",
        "extra_files": "passito-3-500x400",
        "strength": "До 80W • 2500 mAh",
        "buy": 1690.0,
        "sell": 2300.0,
        "stock": 1,
        "badge": "hit",
        "options": [
            {"name": "Изумрудный", "stock": 1, "image": "pasito2_emerald"}
        ],
    },
    {
        "id": 2,
        "cat": "pods",
        "brand": "Xros",
        "name": "Vaporesso XROS 6 Mini",
        "file": "XROS6mini",
        "extra_files": "",
        "strength": "COREX • Компактный",
        "buy": 990.0,
        "sell": 1500.0,
        "stock": 1,
        "badge": "new",
        "options": [
            {"name": "Оранжевый", "stock": 1, "image": "xros6mini_orange"}
        ],
    },
    {
        "id": 3,
        "cat": "pods",
        "brand": "Xros",
        "name": "Vaporesso XROS 5 Mini",
        "file": "XROS5mini1",
        "extra_files": "xros5mini,XROS5mini2",
        "strength": "1000 mAh • COREX",
        "buy": 920.0,
        "sell": 1300.0,
        "stock": 6,
        "badge": "hit",
        "options": [
            {"name": "Серый", "stock": 4, "image": "xros5mini_grey"},
            {"name": "Карбон", "stock": 2, "image": "xros5mini_carbon"},
        ],
    },

    # КАТЕГОРИЯ 2: ЖИЖИ (61 шт.)
    # 50 мг — по 400 ₽
    {
        "id": 4,
        "cat": "liquid",
        "brand": "Podonki",
        "name": "PODONKI PODGON 50 мг",
        "file": "podonki_podgon",
        "extra_files": "",
        "strength": "50 мг",
        "buy": 230.0,
        "sell": 400.0,
        "stock": 16,
        "badge": "hit",
        "options": [
            {"name": "Ментол-мята", "stock": 7},
            {"name": "Ананасовая газировка", "stock": 4},
            {"name": "Малина-хвоя", "stock": 2},
            {"name": "Сочная дыня", "stock": 2},
            {"name": "Классический бабл-гам", "stock": 1},
        ],
    },
    {
        "id": 5,
        "cat": "liquid",
        "brand": "Duall",
        "name": "DUALL 50 мг",
        "file": "duall",
        "extra_files": "",
        "strength": "50 мг",
        "buy": 230.0,
        "sell": 400.0,
        "stock": 13,
        "badge": "hit",
        "options": [
            {"name": "Манго-апельсин-мята", "stock": 6},
            {"name": "Манго-кумкват", "stock": 3},
            {"name": "Кола-лимон", "stock": 1},
            {"name": "Ледяное манго", "stock": 1},
            {"name": "Лимонные леденцы", "stock": 1},
            {"name": "Чай с манго", "stock": 1},
        ],
    },
    {
        "id": 6,
        "cat": "liquid",
        "brand": "Skala",
        "name": "SKALA 50 мг",
        "file": "SKALA50MG",
        "extra_files": "",
        "strength": "50 мг",
        "buy": 210.0,
        "sell": 400.0,
        "stock": 6,
        "badge": "",
        "options": [
            {"name": "Дыня со льдом", "stock": 1},
            {"name": "Кактус со льдом", "stock": 1},
            {"name": "Лимонад со льдом", "stock": 1},
            {"name": "Манго со льдом", "stock": 1},
            {"name": "Тархун со льдом", "stock": 1},
            {"name": "Эрл Грей со льдом", "stock": 1},
        ],
    },
    {
        "id": 7,
        "cat": "liquid",
        "brand": "Puffmi",
        "name": "PUFFMI 50 мг",
        "file": "puffmi_liq",
        "extra_files": "",
        "strength": "50 мг",
        "buy": 230.0,
        "sell": 400.0,
        "stock": 1,
        "badge": "",
        "options": [
            {"name": "Pear Lemonade", "stock": 1},
        ],
    },

    # 60 мг — по 400 ₽
    {
        "id": 8,
        "cat": "liquid",
        "brand": "Delta",
        "name": "DELTA 60 мг",
        "file": "delta_liq",
        "extra_files": "",
        "strength": "60 мг",
        "buy": 230.0,
        "sell": 400.0,
        "stock": 3,
        "badge": "new",
        "options": [
            {"name": "KillerBrov Mi&Bin", "stock": 2},
            {"name": "Red Bull зелёный", "stock": 1},
        ],
    },

    # 70 мг — по 450 ₽
    {
        "id": 9,
        "cat": "liquid",
        "brand": "Podonki",
        "name": "PODONKI & HYSTERIA 70 мг",
        "file": "podonki_hysteria",
        "extra_files": "",
        "strength": "70 мг",
        "buy": 245.0,
        "sell": 450.0,
        "stock": 5,
        "badge": "hit",
        "options": [
            {"name": "Cranberry Ice", "stock": 1},
            {"name": "Monster Energy", "stock": 1},
            {"name": "Peach Currant", "stock": 1},
            {"name": "Pear Lemonade", "stock": 1},
            {"name": "Watermelon Candy", "stock": 1},
        ],
    },
    {
        "id": 10,
        "cat": "liquid",
        "brand": "Podonki",
        "name": "PODONKI МЕДУЗА 70 мг",
        "file": "podonki_meduza",
        "extra_files": "",
        "strength": "70 мг",
        "buy": 245.0,
        "sell": 450.0,
        "stock": 1,
        "badge": "",
        "options": [
            {"name": "Ice Soda Cola", "stock": 1},
        ],
    },
    {
        "id": 11,
        "cat": "liquid",
        "brand": "Hotspot",
        "name": "HOTSPOT 70 мг",
        "file": "hotspot",
        "extra_files": "",
        "strength": "70 мг",
        "buy": 245.0,
        "sell": 450.0,
        "stock": 1,
        "badge": "",
        "options": [
            {"name": "Клубника-киви-базилик", "stock": 1},
        ],
    },

    # 80 мг — по 450 ₽
    {
        "id": 12,
        "cat": "liquid",
        "brand": "Animal Love",
        "name": "ANIMAL LOVE 80 мг",
        "file": "ANIMMA80mg",
        "extra_files": "",
        "strength": "80 мг",
        "buy": 245.0,
        "sell": 450.0,
        "stock": 13,
        "badge": "hit",
        "options": [
            {"name": "Апельсин-вишня", "stock": 3},
            {"name": "Ананас-апельсин", "stock": 2},
            {"name": "Персиковый лимонад", "stock": 2},
            {"name": "Тропический банан", "stock": 2},
            {"name": "Яблочный лимонад", "stock": 2},
            {"name": "Груша-малина-газировка", "stock": 1},
            {"name": "Яблоко-киви", "stock": 1},
        ],
    },
    {
        "id": 13,
        "cat": "liquid",
        "brand": "Злая Монашка",
        "name": "ЗЛАЯ МОНАШКА 80 мг",
        "file": "monashka",
        "extra_files": "",
        "strength": "80 мг",
        "buy": 245.0,
        "sell": 450.0,
        "stock": 2,
        "badge": "new",
        "options": [
            {"name": "Йогурт манго-маракуйя", "stock": 1},
            {"name": "Ягодный сорбет с грейпфрутом", "stock": 1},
        ],
    },

    # КАТЕГОРИЯ 3: ОДНОРАЗКИ (30 шт.)
    {
        "id": 14,
        "cat": "disposable",
        "brand": "Pillow Talk",
        "name": "Pillow Talk 40000",
        "file": "PIllowTANK40k",
        "extra_files": "",
        "strength": "40 000 тяг",
        "buy": 450.0,
        "sell": 950.0,
        "stock": 3,
        "badge": "hit",
        "options": [
            {"name": "King Fab", "stock": 2},
            {"name": "Арбуз-лёд", "stock": 1},
        ],
    },
    {
        "id": 15,
        "cat": "disposable",
        "brand": "YOOZ",
        "name": "YOOZ 25000 / LINKX 25000",
        "file": "YOOZ25000",
        "extra_files": "YOOZ25000 (1)",
        "strength": "25 000 тяг",
        "buy": 360.0,
        "sell": 850.0,
        "stock": 11,
        "badge": "hit",
        "options": [
            {"name": "Малина-лимон", "stock": 3},
            {"name": "Яблочный лимонад", "stock": 2},
            {"name": "Персик-лёд", "stock": 1},
            {"name": "Персик-манго-арбуз", "stock": 1},
            {"name": "Питая-клубника", "stock": 1},
            {"name": "Манго-персик", "stock": 1},
            {"name": "Ананас-мята-лёд", "stock": 1},
            {"name": "Клубника-арбуз", "stock": 1},
        ],
    },
    {
        "id": 16,
        "cat": "disposable",
        "brand": "Funky Lands",
        "name": "Funky Lands 15000",
        "file": "FUnki_lands",
        "extra_files": "FUnki_land1s",
        "strength": "15 000 тяг",
        "buy": 350.0,
        "sell": 800.0,
        "stock": 4,
        "badge": "",
        "options": [
            {"name": "Двойное яблоко-лёд", "stock": 4},
        ],
    },
    {
        "id": 17,
        "cat": "disposable",
        "brand": "Geek Bar",
        "name": "Geek Bar 32000",
        "file": "geek_bar_32000",
        "extra_files": "",
        "strength": "32 000 тяг",
        "buy": 400.0,
        "sell": 800.0,
        "stock": 2,
        "badge": "new",
        "options": [
            {"name": "Прохладный с мятой", "stock": 1},
            {"name": "Сочный персик-лёд", "stock": 1},
        ],
    },
    {
        "id": 18,
        "cat": "disposable",
        "brand": "Puffmi",
        "name": "Puffmi 16000",
        "file": "puffmi_16000",
        "extra_files": "",
        "strength": "16 000 тяг",
        "buy": 380.0,
        "sell": 800.0,
        "stock": 1,
        "badge": "",
        "options": [
            {"name": "Ледяной арбуз", "stock": 1},
        ],
    },
    {
        "id": 19,
        "cat": "disposable",
        "brand": "YOOZ",
        "name": "YOOZ 15000",
        "file": "YOOZ15000 (1)",
        "extra_files": "",
        "strength": "15 000 тяг",
        "buy": 300.0,
        "sell": 800.0,
        "stock": 1,
        "badge": "",
        "options": [
            {"name": "Мята", "stock": 1},
        ],
    },
    {
        "id": 20,
        "cat": "disposable",
        "brand": "Twister Bar",
        "name": "Twister Bar 9600",
        "file": "twister_bar_9600",
        "extra_files": "",
        "strength": "9 600 тяг",
        "buy": 250.0,
        "sell": 450.0,
        "stock": 3,
        "badge": "",
        "options": [
            {"name": "Лимонадная версия", "stock": 1},
            {"name": "Тропическая версия", "stock": 1},
            {"name": "Фруктовая версия", "stock": 1},
        ],
    },
    {
        "id": 21,
        "cat": "disposable",
        "brand": "Geek Bar",
        "name": "Geek Bar Meloso 30000",
        "file": "geek_bar_meloso",
        "extra_files": "",
        "strength": "30 000 тяг",
        "buy": 250.0,
        "sell": 450.0,
        "stock": 2,
        "badge": "new",
        "options": [
            {"name": "Кислый боярышник", "stock": 2},
        ],
    },
    {
        "id": 22,
        "cat": "disposable",
        "brand": "Puffmi",
        "name": "Puffmi 12000",
        "file": "puffmi_12000",
        "extra_files": "",
        "strength": "12 000 тяг",
        "buy": 220.0,
        "sell": 400.0,
        "stock": 3,
        "badge": "",
        "options": [
            {"name": "Табак", "stock": 2},
            {"name": "Имбирное пиво", "stock": 1},
        ],
    },

    # КАТЕГОРИЯ 4: РАСХОДНИКИ (14 шт. — все по 300 ₽)
    {
        "id": 23,
        "cat": "consumable",
        "brand": "Xros",
        "name": "Картридж Vaporesso XROS 0.6Ω",
        "file": "kartridj0.6",
        "extra_files": "",
        "strength": "0.6 Ω • COREX",
        "buy": 145.0,
        "sell": 300.0,
        "stock": 11,
        "badge": "hit",
        "options": [],
    },
    {
        "id": 24,
        "cat": "consumable",
        "brand": "Aegis",
        "name": "Картридж Aegis Hero 5",
        "file": "kartridj_hero5",
        "extra_files": "",
        "strength": "Для Aegis Hero 5",
        "buy": 150.0,
        "sell": 300.0,
        "stock": 2,
        "badge": "",
        "options": [],
    },
    {
        "id": 25,
        "cat": "consumable",
        "brand": "Pasito",
        "name": "Испаритель Smoant Pasito 2/3 (K-5, 0.15Ω, 70–90W)",
        "file": "Pasito2u3_ispariteli",
        "extra_files": "",
        "strength": "0.15 Ω • 70–90W",
        "buy": 116.67,
        "sell": 300.0,
        "stock": 1,
        "badge": "",
        "options": [],
    },

    # КАТЕГОРИЯ 5: СНЮС / ПЛАСТИНКИ (9 шт. — все по 400 ₽)
    {
        "id": 26,
        "cat": "snus",
        "brand": "Delta & Burn",
        "name": "Снюс / Никпаки Delta & Burn",
        "file": "snus_delta",
        "extra_files": "",
        "strength": "Шайбы • Никпаки",
        "buy": 220.0,
        "sell": 400.0,
        "stock": 6,
        "badge": "hit",
        "options": [
            {"name": "Delta Adrenaline Rush Hot Effect", "stock": 2},
            {"name": "Delta KillerBrov Triple Shot", "stock": 2},
            {"name": "Delta Burn Energy Фруктовый пунш", "stock": 1},
            {"name": "Burn Яблоко-киви", "stock": 1},
        ],
    },
    {
        "id": 27,
        "cat": "snus",
        "brand": "Adrenaline",
        "name": "Снюс / Никпаки Adrenaline",
        "file": "snus_adrenaline",
        "extra_files": "",
        "strength": "Шайбы • Никпаки",
        "buy": 220.0,
        "sell": 400.0,
        "stock": 3,
        "badge": "new",
        "options": [
            {"name": "Adrenaline Vitamin Power", "stock": 1},
            {"name": "Adrenaline Energy Power", "stock": 1},
            {"name": "Adrenaline Pepsi", "stock": 1},
        ],
    },
]


def init_db():
    """Создает и автоматически мигрирует таблицы в shop.db без потери истории заказов."""
    IMAGES_DIR.mkdir(exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS meta (
                key TEXT PRIMARY KEY,
                val TEXT
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                cat TEXT,
                brand TEXT,
                name TEXT,
                file TEXT,
                extra_files TEXT,
                strength TEXT,
                buy REAL,
                sell REAL,
                stock INTEGER,
                badge TEXT,
                options_json TEXT
            )
        """)

        cur.execute("PRAGMA table_info(products)")
        prod_cols = {row[1] for row in cur.fetchall()}
        for col, col_type in [
            ("cat", "TEXT"),
            ("brand", "TEXT"),
            ("file", "TEXT"),
            ("extra_files", "TEXT"),
            ("strength", "TEXT"),
            ("buy", "REAL"),
            ("sell", "REAL"),
            ("stock", "INTEGER"),
            ("badge", "TEXT"),
            ("options_json", "TEXT"),
        ]:
            if col not in prod_cols:
                cur.execute(f"ALTER TABLE products ADD COLUMN {col} {col_type}")

        cur.execute("SELECT val FROM meta WHERE key = 'catalog_version'")
        ver_row = cur.fetchone()
        is_new_version = (not ver_row) or (ver_row[0] != CATALOG_VERSION)

        if is_new_version:
            # Полная замена старого каталога на актуальное наличие (122 шт.)
            cur.execute("DELETE FROM products")
            for item in INITIAL_CATALOG:
                opts = item.get("options", [])
                total_stock = sum(int(o.get("stock", 0)) for o in opts) if opts else int(item["stock"])
                cur.execute("""
                    INSERT INTO products (
                        id, cat, brand, name, file, extra_files,
                        strength, buy, sell, stock, badge, options_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    item["id"],
                    item["cat"],
                    item["brand"],
                    item["name"],
                    item["file"],
                    item["extra_files"],
                    item["strength"],
                    item["buy"],
                    item["sell"],
                    total_stock,
                    item["badge"],
                    json.dumps(opts, ensure_ascii=False),
                ))
            cur.execute(
                "INSERT OR REPLACE INTO meta (key, val) VALUES ('catalog_version', ?)",
                (CATALOG_VERSION,),
            )

        cur.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                full_name TEXT,
                delivery_date TEXT,
                time_slot TEXT,
                district TEXT,
                address TEXT,
                payment_method TEXT,
                comment TEXT,
                items_json TEXT,
                total_price REAL,
                total_margin REAL,
                status TEXT DEFAULT 'active',
                created_at TEXT
            )
        """)

        cur.execute("PRAGMA table_info(orders)")
        order_cols = {row[1] for row in cur.fetchall()}
        for col in [
            "user_id INTEGER",
            "username TEXT",
            "full_name TEXT",
            "delivery_date TEXT",
            "time_slot TEXT",
            "district TEXT",
            "address TEXT",
            "payment_method TEXT",
            "comment TEXT",
            "items_json TEXT",
            "total_price REAL",
            "total_margin REAL",
            "status TEXT DEFAULT 'active'",
            "created_at TEXT",
        ]:
            col_name = col.split()[0]
            if col_name not in order_cols:
                cur.execute(f"ALTER TABLE orders ADD COLUMN {col}")

        conn.commit()


# ================= РАЗДАЧА КАРТИНОК И СТАТИКИ =================
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP")


def find_image_file(raw_name: str) -> Path | None:
    """Ищет фото в папке images/ и в корне проекта без учета расширения и регистра."""
    clean_name = raw_name.strip()
    if not clean_name:
        return None

    for folder in (IMAGES_DIR, BASE_DIR):
        if not folder.exists():
            continue

        direct = folder / clean_name
        if direct.is_file() and direct.suffix.lower() in IMAGE_EXTENSIONS:
            return direct

        for ext in IMAGE_EXTENSIONS:
            candidate = folder / f"{clean_name}{ext}"
            if candidate.is_file():
                return candidate

        target_lower = clean_name.lower()
        for f in folder.iterdir():
            if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS:
                if f.name.lower() == target_lower or f.stem.lower() == target_lower:
                    return f
    return None


async def handle_index(request: web.Request):
    return web.FileResponse(BASE_DIR / "index.html")


async def handle_static(request: web.Request):
    filename = request.match_info.get("filename", "")
    if filename in ("style.css", "app.js", "index.html"):
        fpath = BASE_DIR / filename
        if fpath.is_file():
            return web.FileResponse(fpath)
    img_path = find_image_file(filename)
    if img_path:
        return web.FileResponse(img_path)
    return web.Response(status=404, text="Not found")


async def handle_image(request: web.Request):
    raw_name = request.match_info.get("name", "")
    img_path = find_image_file(raw_name)
    if img_path:
        return web.FileResponse(img_path)
    return web.Response(status=404, text="Image not found")


async def api_get_catalog(request: web.Request):
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM products ORDER BY id ASC")
        rows = []
        for r in cur.fetchall():
            d = dict(r)
            try:
                d["options"] = json.loads(d.get("options_json") or "[]")
            except Exception:
                d["options"] = []
            rows.append(d)
    return web.json_response({"ok": True, "products": rows})


async def api_get_user_orders(request: web.Request):
    raw_uid = request.query.get("user_id", "0")
    user_id = int(raw_uid) if raw_uid.isdigit() else 0
    if user_id <= 0:
        return web.json_response({"ok": True, "orders": []})

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 15",
            (user_id,),
        )
        orders = []
        for r in cur.fetchall():
            d = dict(r)
            try:
                d["items"] = json.loads(d.get("items_json") or "[]")
            except Exception:
                d["items"] = []
            orders.append(d)
    return web.json_response({"ok": True, "orders": orders})


# ================= ОФОРМЛЕНИЕ ЗАКАЗА И УВЕДОМЛЕНИЯ =================
async def process_and_save_order(data: dict) -> int:
    items = data.get("items", [])
    if not isinstance(items, list) or not items:
        raise ValueError("Корзина пуста")

    user = data.get("user") if isinstance(data.get("user"), dict) else {}
    raw_uid = user.get("id", 0)
    user_id = int(raw_uid) if isinstance(raw_uid, (int, float, str)) and str(raw_uid).isdigit() else 0
    username = str(user.get("username") or "").strip() or "без_юзернейма"
    full_name = str(user.get("full_name") or "").strip() or "Покупатель"

    delivery_date = str(data.get("delivery_date") or "Сегодня")
    time_slot = str(data.get("time_slot") or "По согласованию")
    district = str(data.get("district") or "Не указан")
    address = str(data.get("address") or "Не указан").strip()
    payment_method = str(data.get("payment_method") or "Перевод")
    comment = str(data.get("comment") or "").strip() or "—"

    created_at = now_chelyabinsk().strftime("%Y-%m-%d %H:%M")

    total_price = 0.0
    total_margin = 0.0
    detailed_items = []
    conflict_orders = []

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        cur.execute("""
            SELECT id, district FROM orders
            WHERE status = 'active' AND delivery_date = ? AND time_slot = ? AND district != ?
        """, (delivery_date, time_slot, district))
        for r in cur.fetchall():
            conflict_orders.append(f"№{r['id']} ({r['district']})")

        for cart_item in items:
            if not isinstance(cart_item, dict):
                continue

            raw_pid = cart_item.get("id", 0)
            if isinstance(raw_pid, dict):
                raw_pid = raw_pid.get("id", 0)
            pid = int(str(raw_pid).split(":")[0]) if str(raw_pid).split(":")[0].isdigit() else 0

            raw_qty = cart_item.get("qty", 1)
            if isinstance(raw_qty, dict):
                raw_qty = raw_qty.get("qty", 1)
            qty = max(1, int(raw_qty)) if isinstance(raw_qty, (int, float, str)) and str(raw_qty).isdigit() else 1

            selected_option = str(cart_item.get("option") or cart_item.get("note") or "").strip()

            cur.execute("SELECT * FROM products WHERE id = ?", (pid,))
            prod = cur.fetchone()
            if not prod:
                continue

            sell_p = float(prod["sell"] or 0.0)
            buy_p = float(prod["buy"] or 0.0)
            line_sum = sell_p * qty
            line_margin = (sell_p - buy_p) * qty if buy_p > 0 else 0.0

            total_price += line_sum
            total_margin += line_margin
            detailed_items.append({
                "id": pid,
                "name": prod["name"],
                "qty": qty,
                "sell": sell_p,
                "buy": buy_p,
                "line_sum": line_sum,
                "line_margin": round(line_margin, 2),
                "option": selected_option,
                "note": selected_option,
            })

        if not detailed_items:
            raise ValueError("Не удалось распознать товары в корзине")

        cur.execute("""
            INSERT INTO orders (
                user_id, username, full_name, delivery_date, time_slot,
                district, address, payment_method, comment, items_json,
                total_price, total_margin, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
        """, (
            user_id,
            username,
            full_name,
            delivery_date,
            time_slot,
            district,
            address,
            payment_method,
            comment,
            json.dumps(detailed_items, ensure_ascii=False),
            round(total_price, 2),
            round(total_margin, 2),
            created_at,
        ))
        order_id = cur.lastrowid
        conn.commit()

    lines = []
    for it in detailed_items:
        opt_str = f" <b>[{it['option']}]</b>" if it.get("option") else ""
        lines.append(f"• {it['name']}{opt_str} × {it['qty']} шт. = <b>{int(it['line_sum'])} ₽</b>")
    items_block = "\n".join(lines)

    conflict_block = ""
    if conflict_orders:
        conflict_block = (
            f"\n⚠️ <b>ВНИМАНИЕ (наложение слота):</b> На {time_slot} уже стоит заказ "
            f"{', '.join(conflict_orders)}!\n"
        )

    user_link = (
        f"@{username}"
        if username != "без_юзернейма"
        else f"<a href='tg://user?id={user_id}'>{full_name}</a>"
    )

    admin_text = (
        f"🚀 <b>НОВЫЙ ЗАКАЗ №{order_id}</b>\n"
        f"🕒 Создан: {created_at} (ЧЛБ)\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"👤 <b>Клиент:</b> {full_name} ({user_link})\n"
        f"🆔 <b>Telegram ID:</b> <code>{user_id}</code>\n\n"
        f"📅 <b>День:</b> {delivery_date}\n"
        f"⏰ <b>Таймслот:</b> {time_slot}\n"
        f"📍 <b>Район:</b> {district}\n"
        f"🏠 <b>Адрес / Точка:</b> {address}\n"
        f"{conflict_block}"
        f"💳 <b>Оплата:</b> {payment_method}\n"
        f"💬 <b>Комментарий:</b> {comment}\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"📦 <b>Состав заказа:</b>\n{items_block}\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"💰 <b>К оплате:</b> {int(total_price)} ₽\n"
        f"📈 <b>Чистая маржа:</b> +{int(round(total_margin))} ₽"
    )

    buttons = [
        [
            InlineKeyboardButton(text="✅ Выполнен", callback_data=f"order_done:{order_id}"),
            InlineKeyboardButton(text="❌ Отменён", callback_data=f"order_cancel:{order_id}"),
        ]
    ]
    if user_id > 0:
        buttons.append([InlineKeyboardButton(text="💬 Написать клиенту", url=f"tg://user?id={user_id}")])

    try:
        await bot.send_message(
            ADMIN_ID,
            admin_text,
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons),
        )
    except Exception as e:
        print(f"[WARN] Ошибка отправки уведомления админу: {e}")

    if user_id > 0:
        try:
            client_msg = (
                f"🚀 <b>KOSMOS SHOP — Заказ №{order_id} принят!</b>\n\n"
                f"📅 <b>Когда:</b> {delivery_date}, {time_slot}\n"
                f"📍 <b>Куда:</b> {district}, {address}\n"
                f"💳 <b>Оплата:</b> {payment_method}\n\n"
                f"📦 <b>Состав:</b>\n{items_block}\n\n"
                f"💰 <b>Итого: {int(total_price)} ₽</b>\n\n"
                f"Менеджер свяжется с тобой для подтверждения!"
            )
            await bot.send_message(user_id, client_msg, parse_mode="HTML")
        except Exception:
            pass

    return order_id


async def api_create_order(request: web.Request):
    try:
        data = await request.json()
        order_id = await process_and_save_order(data)
        return web.json_response({"ok": True, "order_id": order_id})
    except Exception as e:
        return web.json_response({"ok": False, "error": str(e)}, status=400)


@dp.message(F.web_app_data)
async def handle_webapp_data(message: Message):
    try:
        raw = json.loads(message.web_app_data.data)
        raw["user"] = {
            "id": message.from_user.id,
            "username": message.from_user.username or "без_юзернейма",
            "full_name": message.from_user.full_name,
        }
        order_id = await process_and_save_order(raw)
        await message.answer(f"✅ Заказ №{order_id} успешно оформлен!")
    except Exception as e:
        await message.answer(f"Ошибка при обработке заказа: {e}")


# ================= КОМАНДЫ БОТА =================
@dp.message(Command("start"))
async def cmd_start(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🚀 Открыть магазин KOSMOS SHOP", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    welcome = (
        "⚡ <b>KOSMOS SHOP | ЧЕЛЯБИНСК</b>\n\n"
        "• Актуальное наличие по вкусам и цветам\n"
        "• Удобный выбор времени доставки (слоты по 30 мин)\n"
        "• Поды, жижи, одноразки, расходники и снюс\n\n"
        "Жми кнопку ниже, чтобы открыть витрину 👇"
    )
    if message.from_user.id == ADMIN_ID:
        welcome += (
            "\n\n🔧 <b>Панель администратора:</b>\n"
            "/active — Заказы в ожидании\n"
            "/done — Выполненные заказы и касса за день\n"
            "/stock — Остатки товаров по вкусам и цветам\n"
            "<code>/setstock ID КОЛВО [ВКУС/ЦВЕТ]</code> — Изменить остаток\n"
            "<code>/setprice ID ЦЕНА</code> — Изменить розничную цену"
        )
    await message.answer(welcome, parse_mode="HTML", reply_markup=kb)


@dp.message(Command("active"))
async def cmd_active(message: Message):
    if message.from_user.id != ADMIN_ID:
        return

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM orders WHERE status = 'active' ORDER BY id ASC")
        orders = cur.fetchall()

    if not orders:
        await message.answer("✅ <b>Активных заказов в ожидании сейчас нет.</b>", parse_mode="HTML")
        return

    await message.answer(f"⏳ <b>Заказы в ожидании ({len(orders)} шт.):</b>", parse_mode="HTML")
    for o in orders:
        items = json.loads(o["items_json"])
        items_str = "\n".join(
            f"  • {i['name']}"
            + (f" [{i.get('option') or i.get('note')}]" if (i.get("option") or i.get("note")) else "")
            + f" × {i['qty']} шт."
            for i in items
        )
        text = (
            f"🔸 <b>Заказ №{o['id']}</b> ({o['delivery_date']} | <b>{o['time_slot']}</b>)\n"
            f"👤 {o['full_name']} (@{o['username']}) | ID: <code>{o['user_id']}</code>\n"
            f"📍 <b>{o['district']}</b> — {o['address']}\n"
            f"💳 {o['payment_method']} | 💬 {o['comment']}\n"
            f"📦 <b>Состав:</b>\n{items_str}\n"
            f"💰 <b>Сумма: {int(o['total_price'])} ₽</b> (маржа: +{int(round(o['total_margin']))} ₽)"
        )
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="✅ Выполнен", callback_data=f"order_done:{o['id']}"),
                InlineKeyboardButton(text="❌ Отменён", callback_data=f"order_cancel:{o['id']}"),
            ]
        ])
        await message.answer(text, parse_mode="HTML", reply_markup=kb)


def build_done_report(date_prefix: str) -> str:
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM orders WHERE status = 'done' AND created_at LIKE ? ORDER BY id ASC",
            (f"{date_prefix}%",),
        )
        orders = cur.fetchall()

    if not orders:
        return f"📊 За <b>{date_prefix}</b> выполненных заказов пока нет."

    total_rev = sum(float(o["total_price"]) for o in orders)
    total_prof = sum(float(o["total_margin"]) for o in orders)
    total_cost = total_rev - total_prof

    lines = [f"✅ <b>Выполненные заказы за {date_prefix} ({len(orders)} шт.):</b>\n"]
    for o in orders:
        items = json.loads(o["items_json"])
        items_str = ", ".join(
            f"{i['name']}"
            + (f" ({i.get('option') or i.get('note')})" if (i.get("option") or i.get("note")) else "")
            + f" ×{i['qty']}"
            for i in items
        )
        lines.append(
            f"• <b>№{o['id']}</b> [{o['district']}, {o['time_slot']}]: {items_str} — "
            f"<b>{int(o['total_price'])} ₽</b> (+{int(round(o['total_margin']))} ₽)"
        )

    lines.append(
        f"\n━━━━━━━━━━━━━━━━━━\n"
        f"💰 <b>Выручка (касса):</b> {int(total_rev)} ₽\n"
        f"📦 <b>Себестоимость:</b> {int(round(total_cost))} ₽\n"
        f"📈 <b>Чистая прибыль:</b> +{int(round(total_prof))} ₽"
    )
    return "\n".join(lines)


@dp.message(Command("done"))
async def cmd_done(message: Message):
    if message.from_user.id != ADMIN_ID:
        return
    today_str = now_chelyabinsk().strftime("%Y-%m-%d")
    await message.answer(build_done_report(today_str), parse_mode="HTML")


@dp.message(Command("stock"))
async def cmd_stock(message: Message):
    if message.from_user.id != ADMIN_ID:
        return
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM products ORDER BY id ASC")
        rows = cur.fetchall()

    total_units = sum(int(r["stock"] or 0) for r in rows)
    lines = [f"📦 <b>Актуальный склад (всего {total_units} шт.):</b>\n"]
    for r in rows:
        icon = "🟢" if r["stock"] > 0 else "🔴"
        opts = json.loads(r["options_json"] or "[]")
        opt_summary = ""
        if opts:
            opt_parts = [f"{o['name']}: {o['stock']}" for o in opts if int(o.get("stock", 0)) > 0]
            opt_summary = f"\n   └ <i>{', '.join(opt_parts) if opt_parts else 'все вкусы/цвета 0'}</i>"
        lines.append(
            f"{icon} <code>#{r['id']}</code> <b>{r['name']}</b> — {r['stock']} шт. ({int(r['sell'])} ₽){opt_summary}"
        )

    text = "\n".join(lines)
    # Отправляем частями, если сообщение длинное
    if len(text) > 3900:
        mid = len(lines) // 2
        await message.answer("\n".join(lines[:mid]), parse_mode="HTML")
        await message.answer("\n".join(lines[mid:]), parse_mode="HTML")
    else:
        await message.answer(text, parse_mode="HTML")


@dp.message(Command("setstock"))
async def cmd_setstock(message: Message):
    if message.from_user.id != ADMIN_ID:
        return
    parts = message.text.split(maxsplit=3)
    if len(parts) < 3 or not parts[1].isdigit() or not parts[2].isdigit():
        await message.answer(
            "Формат:\n"
            "• Общий остаток: <code>/setstock ID КОЛВО</code>\n"
            "• Остаток вкуса/цвета: <code>/setstock ID КОЛВО Название вкуса</code>",
            parse_mode="HTML",
        )
        return

    pid = int(parts[1])
    new_qty = int(parts[2])
    opt_name = parts[3].strip() if len(parts) > 3 else ""

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM products WHERE id = ?", (pid,))
        prod = cur.fetchone()
        if not prod:
            await message.answer("Товар с таким ID не найден.")
            return

        opts = json.loads(prod["options_json"] or "[]")
        if opt_name and opts:
            matched = False
            for o in opts:
                if o["name"].lower() == opt_name.lower():
                    o["stock"] = new_qty
                    matched = True
                    break
            if not matched:
                opts.append({"name": opt_name, "stock": new_qty})
            total_stock = sum(max(0, int(o.get("stock", 0))) for o in opts)
            cur.execute(
                "UPDATE products SET stock = ?, options_json = ? WHERE id = ?",
                (total_stock, json.dumps(opts, ensure_ascii=False), pid),
            )
            conn.commit()
            await message.answer(
                f"✅ Обновлён вариант <b>{opt_name}</b> у товара <code>#{pid}</code>: {new_qty} шт. (Всего: {total_stock} шт.)",
                parse_mode="HTML",
            )
        else:
            cur.execute("UPDATE products SET stock = ? WHERE id = ?", (new_qty, pid))
            conn.commit()
            await message.answer(
                f"✅ Общий остаток товара <code>#{pid}</code> обновлён: <b>{new_qty} шт.</b>",
                parse_mode="HTML",
            )


@dp.message(Command("setprice"))
async def cmd_setprice(message: Message):
    if message.from_user.id != ADMIN_ID:
        return
    parts = message.text.split()
    if len(parts) != 3 or not parts[1].isdigit():
        await message.answer("Формат: <code>/setprice ID ЦЕНА</code>", parse_mode="HTML")
        return
    pid, new_price = int(parts[1]), float(parts[2])
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("UPDATE products SET sell = ? WHERE id = ?", (new_price, pid))
        conn.commit()
    await message.answer(
        f"✅ Розничная цена товара <code>#{pid}</code> обновлена: <b>{int(new_price)} ₽</b>",
        parse_mode="HTML",
    )


@dp.callback_query(F.data.startswith("order_done:"))
async def cb_order_done(callback: CallbackQuery):
    order_id = int(callback.data.split(":")[1])
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        order = cur.fetchone()
        if not order:
            await callback.answer("Заказ не найден", show_alert=True)
            return
        if order["status"] == "done":
            await callback.answer("Заказ уже отмечен выполненным")
            return

        items = json.loads(order["items_json"])
        for it in items:
            pid = int(it["id"])
            qty = int(it["qty"])
            opt_selected = (it.get("option") or it.get("note") or "").strip()

            cur.execute("SELECT stock, options_json FROM products WHERE id = ?", (pid,))
            prod = cur.fetchone()
            if not prod:
                continue

            opts = json.loads(prod["options_json"] or "[]")
            if opts and opt_selected:
                for o in opts:
                    if o["name"].lower() == opt_selected.lower():
                        o["stock"] = max(0, int(o.get("stock", 0)) - qty)
                        break
                new_total = sum(max(0, int(o.get("stock", 0))) for o in opts)
                cur.execute(
                    "UPDATE products SET stock = ?, options_json = ? WHERE id = ?",
                    (new_total, json.dumps(opts, ensure_ascii=False), pid),
                )
            else:
                new_total = max(0, int(prod["stock"] or 0) - qty)
                cur.execute("UPDATE products SET stock = ? WHERE id = ?", (new_total, pid))

        cur.execute("UPDATE orders SET status = 'done' WHERE id = ?", (order_id,))
        conn.commit()

    await callback.message.edit_text(
        callback.message.html_text + "\n\n✅ <b>СТАТУС: ВЫПОЛНЕН (остатки по вкусам/цветам списаны)</b>",
        parse_mode="HTML",
    )
    await callback.answer(f"Заказ №{order_id} выполнен!")


@dp.callback_query(F.data.startswith("order_cancel:"))
async def cb_order_cancel(callback: CallbackQuery):
    order_id = int(callback.data.split(":")[1])
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status = 'cancelled' WHERE id = ?", (order_id,))
        conn.commit()

    await callback.message.edit_text(
        callback.message.html_text + "\n\n❌ <b>СТАТУС: ОТМЕНЁН</b>",
        parse_mode="HTML",
    )
    await callback.answer(f"Заказ №{order_id} отменён.")


# ================= АВТО-СВОДКА В 23:00 (UTC+5) =================
async def daily_summary_scheduler():
    last_sent_date = None
    while True:
        now = now_chelyabinsk()
        today_str = now.strftime("%Y-%m-%d")
        if now.hour == 23 and now.minute == 0 and last_sent_date != today_str:
            last_sent_date = today_str
            report = "🌙 <b>АВТОМАТИЧЕСКАЯ СВОДКА СМЕНЫ (23:00 ЧЛБ)</b>\n\n" + build_done_report(today_str)
            try:
                await bot.send_message(ADMIN_ID, report, parse_mode="HTML")
            except Exception as e:
                print(f"[WARN] Ошибка авто-отчета: {e}")
        await asyncio.sleep(20)


async def main():
    init_db()
    app = web.Application()
    app.router.add_get("/", handle_index)
    app.router.add_get("/api/catalog", api_get_catalog)
    app.router.add_get("/api/orders", api_get_user_orders)
    app.router.add_post("/api/order", api_create_order)
    app.router.add_get("/images/{name}", handle_image)
    app.router.add_get("/{filename}", handle_static)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    print(f"🚀 Сервер KOSMOS SHOP запущен: http://127.0.0.1:{PORT}")

    asyncio.create_task(daily_summary_scheduler())
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())