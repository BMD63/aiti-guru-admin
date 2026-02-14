export const LOGIN_UI = {
  outerRadius: 40,
  outerPadding: 6,

  innerWidth: 515,
  innerMinHeight: 704,
  innerRadius: 34,
  innerPadding: 48,

  formMaxWidth: 399,

  fieldHeight: 44,
  fieldRadius: 2,

  logoSize: 52,
  logoImageW: 35,
  logoImageH: 34,
} as const;

export const AUTH_EXPIRES_IN_MINS = 60 as const;

export const LOGIN_TEXT = {
  title: 'Добро пожаловать!',
  subtitle: 'Пожалуйста, авторизируйтесь',
  usernameLabel: 'Логин',
  passwordLabel: 'Пароль',
  remember: 'Запомнить данные',
  submit: 'Войти',
  noAccount: 'Нет аккаунта?',
  create: 'Создать',
} as const;
