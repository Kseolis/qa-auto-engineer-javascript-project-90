# Task Manager Playwright Autotests

Проект содержит автотесты UI на **Playwright** для учебного Task Manager.

## Быстрый старт

- **Установка зависимостей**:

```bash
make install
```

- **Запуск приложения локально (dev)**:

```bash
make run
```

- **Запуск линтера**:

```bash
make lint
```

## Запуск автотестов

Playwright-конфигурация поднимает dev-сервер автоматически через `webServer` (см. `playwright.config.js`), поэтому отдельно стартовать `npm run dev` обычно не нужно.

- **Запуск тестов через Makefile**:

```bash
make test
```

- **Запуск тестов через npm**:

```bash
npm test
```

- **Дебаг режим**:

```bash
npm run test:debug
```

- **UI режим**:

```bash
npm run test:ui
```

- **Открыть HTML-репорт**:

```bash
npm run test:report
```

## CI/CD (GitHub Actions)

Проект настроен с двумя workflow:

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Запускается при push/PR в `main` или `develop`:
- ESLint проверка
- Playwright тесты

### 2. Nightly Tests (`.github/workflows/nightly.yml`)

Запускается каждый день в 2:00 UTC:
- Тесты на всех браузерах (chromium, firefox, webkit)
- Можно запустить вручную через `workflow_dispatch`

### Настройка секретов в GitHub

Для работы CI/CD добавьте в Settings → Secrets → Actions:

- `BASE_URL` (опционально) - URL приложения для тестов

## Переменные окружения

- **BASE_URL**: базовый URL приложения (по умолчанию `http://localhost:5173`)
- **EXPECT_TIMEOUT**: таймаут ожиданий `expect()` в мс (по умолчанию `5000`)
- **CI**: при наличии включает `forbidOnly`, `retries=2`, `workers=1` и отключает автопоказ HTML-репорта
