import type { Currency } from './types'

export const RUB_TO_KGS = 1.02

export const toKgs = (rub: number) => Math.round(rub * RUB_TO_KGS)

export function formatMoney(rub: number, currency: Currency): string {
  const amount = currency === 'RUB' ? rub : toKgs(rub)
  return new Intl.NumberFormat(currency === 'RUB' ? 'ru-RU' : 'ky-KG', {
    maximumFractionDigits: 0,
  }).format(amount) + (currency === 'RUB' ? ' ₽' : ' сом')
}

export function secondaryMoney(rub: number, currency: Currency): string {
  return formatMoney(rub, currency === 'RUB' ? 'KGS' : 'RUB')
}
