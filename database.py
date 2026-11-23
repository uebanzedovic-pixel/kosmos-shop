import sqlite3

def create_db():
    # Подключаемся к базе (если файла нет, он создастся автоматически)
    conn = sqlite3.connect('shop.db')
    cursor = conn.cursor()
    
    # Создаем таблицу товаров
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            name TEXT,
            description TEXT,
            options TEXT,
            price INTEGER,
            old_price INTEGER,
            stock INTEGER,
            photo_url TEXT,
            is_active INTEGER DEFAULT 1
        )
    ''')
    conn.commit()
    conn.close()
    print("База данных успешно создана!")

if __name__ == '__main__':
    create_db()