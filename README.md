# Aiti Guru Admin (test task)

React + TypeScript приложение для авторизации и работы со списком товаров (DummyJSON).

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Material UI](https://img.shields.io/badge/Material_UI-5.0-007FFF?logo=mui)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=react-query)
![TanStack Table](https://img.shields.io/badge/TanStack_Table-8-FF4154?logo=react-table)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990?logo=reacthookform)
![Zod](https://img.shields.io/badge/Zod-3.0-3E67B1?logo=Zod)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter)

## ТЗ (Задание)
Реализация административной системы управления товарами, включающей:

- Авторизацию пользователей.
- Просмотр, поиск и сортировку списка товаров.
- Добавление новых товаров.
- Строгая типизация (TypeScript) и работа с API (DummyJSON).

## Стек
### Основные технологии
- React 18+ — Библиотека для построения пользовательских интерфейсов.
- TypeScript — Строгая типизация для надежности кода.
- Vite — Инструмент сборки (быстрый старт и HMR).

### UI и Стилизация
- Material UI (MUI) v5 — UI-компоненты библиотека. Выбрана как стандарт индустрии для быстрого построения качественных интерфейсов.
- Fontsource Inter — Шрифт продукта.

### Работа с данными и состоянием
- TanStack Query (React Query) v5 — Управление серверным состоянием (кэширование, загрузка, ошибки).
- TanStack Table v8 — "Headless" библиотека для построения таблиц (высокая производительность, гибкость).
- React Context — Глобальное состояние (авторизация).
- React Hook Form + Zod — Управление формами и валидация схем.

## Архитектура
Проект реализован по методологии Feature-Sliced Design (FSD).Структура позволяет легко масштабировать проект, разделяя ответственность между слоями:

- app — Глобальные провайдеры, стили, роутинг.
- pages — Страницы приложения (LoginPage, ProductsPage).
- features — Функциональные модули.
- entities — Бизнес-сущности (product, user).
- shared — Переиспользуемый UI и утилиты (DataTable).

## Запуск
```bash
npm i
npm run dev
```

## Данные / API

Auth: DummyJSON Auth

Products: DummyJSON Products (+ search)

## Логин

Тестовые данные DummyJSON (пример):

username: emilys

password: emilyspass

## Реализовано

### Авторизация (/login)

- Авторизация + валидация + обработка ошибок
- Remember me (token в localStorage / sessionStorage)
- Редирект на страницу товаров при успехе

### Список товаров (/products)
- Список товаров (API), поиск (API + debounce), сортировка, пагинация
- Выбор строк чекбоксами
- Добавление товара (только UI, без сохранения на сервер) + toast
- Действия строки через "+","..." (заглушки)
- Прогресс-бар загрузки
- Рейтинг < 3 подсвечивается красным цветом
- Empty State при отсутствии данных

### Добавление товара
- Модальное окно с формой.
- Валидация полей.
- Имитация сохранения (без реального API запроса).
- Toast-уведомление об успехе.


## Лицензия
Этот проект распространяется под лицензией MIT. Подробнее см. в файле LICENSE.