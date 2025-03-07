# Messanger - Учебный проект от Яндекс.Практикум

## Описание проекта

**Messanger** - это учебный проект, созданный в рамках курса [Яндекс.Практикум](https://praktikum.yandex.ru/) "Мидл фронтенд-разработчик
". Проект представляет собой веб-приложение мессенджера, разработанное с использованием чистого JavaScript, TypeScript, Vite и Handlebars.

Главная цель проекта - изучение архитектуры клиентских приложений, базовых принципов организации модулей, маршрутизации и шаблонизации.

---

### Демо-дизайн

Посмотреть дизайн проекта можно по [ссылке в Figma](https://www.figma.com/design/ywRG2C92lViK15kEAE6tzc/Messanger-VanillaJS).

---

## Страницы приложения

Приложение содержит следующие маршруты:

- Главная страница (авторизация) - [**/**](https://dstarky-messanger.netlify.app/)
- Регистрация - [**/sign-up**](https://dstarky-messanger.netlify.app/sign-up)
- Список чатов - [**/messenger**](https://dstarky-messanger.netlify.app/messenger)
- Профиль пользователя - [**/settings**](https://dstarky-messanger.netlify.app/settings)
- Страница 404 (страница не найдена) - [**/404**](https://dstarky-messanger.netlify.app/404)
- Страница 500 (ошибка сервера) - [**/500**](https://dstarky-messanger.netlify.app/500)

---

## Установка и запуск проекта

### Системные требования

- Node.js версии **16** или выше
- Установленный менеджер пакетов **npm**

### Шаги для запуска

1. Клонируйте репозиторий:

   ```bash
   https://github.com/DStarky/middle.messenger.praktikum.yandex
   cd middle.messenger.praktikum.yandex
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Запустите проект в режиме разработки:

   ```bash
   npm run dev
   ```

4. Сборка проекта:

   ```bash
   npm run build
   ```

5. Предпросмотр собранного проекта:

   ```bash
   npm run preview
   ```

6. Запуск production-сборки:

   ```bash
   npm run start
   ```

7. Проверка и правка стилей:

   ```bash
   npm run stylelint:fix
   ```

8. Проверка типизации:

   ```bash
   npm run typecheck
   ```

9. Проверка линтером:

   ```bash
   npm run lint
   ```

10. Исправление замечаний линтера:

```bash
npm run lint:fix
```

---

## Технологии

- **Vanilla JavaScript** и **TypeScript** - основная логика приложения.
- **Vite** - быстрый инструмент для сборки и разработки.
- **Handlebars** - шаблонизатор для рендеринга HTML.
- **Express** - для раздачи собранных файлов.
