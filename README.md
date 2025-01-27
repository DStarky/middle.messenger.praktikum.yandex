# Messenger — Учебный проект от Яндекс.Практикум

## Описание проекта

**Messenger** — это учебный проект, разработанный в рамках курса [Яндекс.Практикум](https://praktikum.yandex.ru/) по направлению "Мидл фронтенд-разработчик". Проект представляет собой веб-приложение мессенджера, созданное с использованием чистого JavaScript, TypeScript, Vite и Handlebars.

Основная цель проекта — изучение архитектуры клиентских приложений, базовых принципов организации модулей, маршрутизации и шаблонизации.

---

### Дизайн проекта

Дизайн проекта доступен по [ссылке в Figma](https://www.figma.com/design/ywRG2C92lViK15kEAE6tzc/Messanger-VanillaJS).

---

## Страницы приложения

Приложение включает следующие маршруты:

- **Главная страница (Авторизация)** — [/](https://dstarky-messanger.netlify.app/)
- **Регистрация** — [/sign-up](https://dstarky-messanger.netlify.app/sign-up)
- **Список чатов** — [/messenger](https://dstarky-messanger.netlify.app/messenger)
- **Профиль пользователя** — [/settings](https://dstarky-messanger.netlify.app/settings)
- **Страница 404 (Не найдена)** — [/404](https://dstarky-messanger.netlify.app/404)
- **Страница 500 (Ошибка сервера)** — [/500](https://dstarky-messanger.netlify.app/500)

---

## Установка и запуск проекта

### Системные требования

- **Node.js** версии **18** или выше
- Установленный менеджер пакетов **npm**

### Шаги по установке и запуску

1. **Клонирование репозитория:**

   ```bash
   git clone https://github.com/DStarky/middle.messenger.praktikum.yandex
   cd middle.messenger.praktikum.yandex
   ```

2. **Установка зависимостей:**

   ```bash
   npm install
   ```

3. **Запуск проекта в режиме разработки:**

   ```bash
   npm run dev
   ```

4. **Сборка проекта:**

   ```bash
   npm run build
   ```

5. **Предпросмотр собранного проекта:**

   ```bash
   npm run preview
   ```

6. **Запуск production-сборки:**

   ```bash
   npm run start
   ```

7. **Проверка и автоматическое исправление стилей:**

   ```bash
   npm run stylelint:fix
   ```

8. **Проверка типизации:**

   ```bash
   npm run typecheck
   ```

9. **Проверка кода с помощью линтера:**

   ```bash
   npm run lint
   ```

10. **Автоматическое исправление замечаний линтера:**

    ```bash
    npm run lint:fix
    ```

11. **Запуск тестов:**

    ```bash
    npm run test
    ```

12. **Запуск тестов с отслеживанием изменений:**

    ```bash
    npm run test:watch
    ```

---

## Используемые технологии

- **Vanilla JavaScript** и **TypeScript** — основная логика приложения.
- **Vite** — быстрый инструмент для сборки и разработки.
- **Handlebars** — шаблонизатор для рендеринга HTML.
- **Express** — сервер для раздачи собранных файлов.
- **Mocha**, **Chai**, **Sinon** — инструменты для тестирования.
