#!/bin/bash

echo "=== ЗАПУСК ПРОЕКТА KOSMOS SHOP ==="

# Переходим в папку со скриптом (на всякий случай)
cd "$(dirname "$0")"

# Запускаем Python-сервер
echo "Запускаем main.py..."
python3 main.py