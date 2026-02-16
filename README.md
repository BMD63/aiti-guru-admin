# Aiti Guru Admin (test task)

React + TypeScript приложение для авторизации и работы со списком товаров (DummyJSON).

## Стек
- React 18 + TypeScript (strict)
- MUI
- React Hook Form + Zod
- TanStack React Query
- TanStack React Table
- React Router

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

- Авторизация + валидация + обработка ошибок
- Remember me (token в localStorage / sessionStorage)
- Список товаров (API), поиск (API + debounce), сортировка, пагинация
- Выбор строк чекбоксами
- Добавление товара (только UI, без сохранения на сервер) + toast
- Действия строки через "..." (заглушки)

