export interface PopularRoute {
  from: string
  to: string
  priceRUB: number
}

export const popularRoutes: PopularRoute[] = [
  { from: 'Бишкек', to: 'Москва', priceRUB: 14220 },
  { from: 'Ош', to: 'Москва', priceRUB: 13670 },
  { from: 'Бишкек', to: 'Краснодар', priceRUB: 21450 },
  { from: 'Бишкек', to: 'Екатеринбург', priceRUB: 12990 },
]

export const cities = [
  { group: 'Кыргызстан', values: ['Бишкек', 'Ош'] },
  { group: 'Россия', values: ['Москва', 'Краснодар', 'Екатеринбург', 'Санкт-Петербург', 'Новосибирск', 'Красноярск'] },
]
