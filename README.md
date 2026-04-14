# Простой блог

React + NestJS + PostgreSQL + Docker.

## Возможности
- Регистрация / логин (JWT access + refresh)
- Профиль: просмотр, редактирование, смена аватара
- Лента постов: создание/редактирование/удаление, пагинация, сортировка по дате
- Загрузка изображений
- Editor.js как wysywig

## Запуск (Docker + локальный фронт – рекомендуется)
1. Клонировать репозиторий
2. Скопировать `.env.example` в `.env` корень проекта
3. Запустить в Docker `docker-compose up --build`

UI будет доступен на http://localhost
server на http://localhost:3000

## API

### Auth
1. POST /auth/register – регистрация (multipart/form-data: login, password, email, avatar – опционально)
2. POST /auth/login – логин (JSON: login, password)
3. POST /auth/refresh – обновление токенов (JSON: refresh_token)

### Profile
1. GET /profile – получить профиль
2. PATCH /profile – обновить (JSON: firstName, lastName, birthDate, about, email, phoneNumber)
3. POST /profile/avatar – загрузить аватар (form-data: avatar)

### Posts
1. GET /posts?limit=10&offset=0&sort=DESC – список постов пользователя
2. POST /posts – создать пост (JSON: content – Editor.js output)
3. GET /posts/:id – получить пост
4. PATCH /posts/:id – обновить (JSON: content)
5. DELETE /posts/:id – мягкое удаление

### Upload
1. POST /upload/temp – временная загрузка изображения (form-data: image)

### Users
1. GET /users – список всех пользователей (id, login, firstName, lastName, avatarPicId)