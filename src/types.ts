export type Language = 'ru' | 'ky' | 'en'
export type Currency = 'RUB' | 'KGS'
export type DeparturePeriod = 'morning' | 'day' | 'evening' | 'night'
export type SortKey = 'recommended' | 'cheap' | 'fast' | 'early'

export interface Passengers {
  adults: number
  children: number
  infants: number
}

export interface SearchState {
  from: string
  to: string
  departureDate: string
  returnDate: string
  passengers: Passengers
}

export interface Flight {
  id: string
  airline: string
  departureCity: string
  arrivalCity: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  departureDate: string
  arrivalDate: string
  durationMinutes: number
  stops: 0 | 1
  baggage: boolean
  priceRUB: number
  freeBooking: boolean
  bookingHours: number
  refundable: boolean
  refundConditions: string
  flexibleDate: boolean
  kyrgyzCardsSupported: boolean
  seatsLeft: number
  recommended: boolean
  departurePeriod: DeparturePeriod
  priceCheckedMinutesAgo: number
  priceChanged?: boolean
}

export interface Filters {
  freeBooking: boolean
  refundable: boolean
  flexibleDate: boolean
  kyrgyzCards: boolean
  baggage: boolean
  noBaggage: boolean
  direct: boolean
  oneStop: boolean
  periods: DeparturePeriod[]
  maxPrice: number
  maxDuration: number
  airlines: string[]
}

export type ModalName = 'flight' | 'alert' | 'group' | 'passengers' | null
