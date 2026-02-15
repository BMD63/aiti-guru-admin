export const PRODUCTS_PAGE = {
  limit: 20,

  layout: {
    topPadding: 20,
    sidePadding: 30,
    gap: 30,
    navbarHeight: 105,
    cardMinTableWidth: 1100,
  },

  search: {
    debounceMs: 400,
    inputWidth: 560,
  },

  actions: {
    toastAdded: 'Добавлено',
    toastCreated: 'Товар успешно добавлен',
    soonEdit: 'Скоро будет: редактирование',
    soonDelete: 'Скоро будет: удаление',
  },
} as const;
