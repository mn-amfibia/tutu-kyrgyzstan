import { useState } from 'react'
import { ArrowLeftRight, Check, CreditCard, Info, ReceiptText, Users } from 'lucide-react'
import type { SearchState } from '../types'
import type { Translator } from '../translations'
import { cities } from '../popularRoutes'

interface HeroProps {
  search: SearchState
  loading: boolean
  onChange: (search: SearchState) => void
  onSearch: () => void
  t: Translator
}

export function Hero({ search, loading, onChange, onSearch, t }: HeroProps) {
  const [passengersOpen, setPassengersOpen] = useState(false)
  const cityOptions = cities.flatMap((group) => group.values)
  const total = search.passengers.adults + search.passengers.children + search.passengers.infants

  const updatePassenger = (key: keyof SearchState['passengers'], amount: number) => {
    const next = Math.max(key === 'adults' ? 1 : 0, search.passengers[key] + amount)
    onChange({ ...search, passengers: { ...search.passengers, [key]: next } })
  }

  return (
    <section className="hero" id="top">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="container hero-content">
        <div className="hero-copy">
          <span className="eyebrow">Кыргызстан ↔ Россия</span>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroText')}</p>
        </div>
        <img className="hero-asset" src={`${import.meta.env.BASE_URL}brand/suitcase.png`} alt="" aria-hidden="true" />

        <form className="search-card" onSubmit={(event) => { event.preventDefault(); onSearch() }}>
          <div className="search-fields">
            <label className="field city-field">
              <span>{t('from')}</span>
              <input list="cities" value={search.from} onChange={(event) => onChange({ ...search, from: event.target.value })} />
            </label>
            <button
              type="button"
              className="swap-button"
              aria-label={`${t('from')} / ${t('to')}`}
              onClick={() => onChange({ ...search, from: search.to, to: search.from })}
            >
              <ArrowLeftRight size={20} />
            </button>
            <label className="field city-field">
              <span>{t('to')}</span>
              <input list="cities" value={search.to} onChange={(event) => onChange({ ...search, to: event.target.value })} />
            </label>
            <datalist id="cities">{cityOptions.map((city) => <option value={city} key={city} />)}</datalist>
            <label className="field">
              <span>{t('there')}</span>
              <input type="date" value={search.departureDate} onChange={(event) => onChange({ ...search, departureDate: event.target.value })} />
            </label>
            <label className={`field ${search.unknownReturn ? 'disabled' : ''}`}>
              <span>{t('back')}</span>
              <input type="date" disabled={search.unknownReturn} value={search.returnDate} onChange={(event) => onChange({ ...search, returnDate: event.target.value })} />
            </label>
            <div className="passenger-wrap">
              <button type="button" className="field field-button" onClick={() => setPassengersOpen(!passengersOpen)} aria-expanded={passengersOpen}>
                <span>{t('passengers')}</span><strong>{total}</strong>
              </button>
              {passengersOpen && (
                <div className="popover passenger-popover">
                  {(['adults', 'children', 'infants'] as const).map((key) => (
                    <div className="counter" key={key}>
                      <span>{t(key)}</span>
                      <div><button type="button" onClick={() => updatePassenger(key, -1)} aria-label="Уменьшить">−</button><strong>{search.passengers[key]}</strong><button type="button" onClick={() => updatePassenger(key, 1)} aria-label="Увеличить">+</button></div>
                    </div>
                  ))}
                  <button type="button" className="button button-full" onClick={() => setPassengersOpen(false)}>{t('done')}</button>
                </div>
              )}
            </div>
            <button className="button search-submit" disabled={loading}>{loading ? t('loading') : t('find')}</button>
          </div>
          <label className="unknown-return">
            <input type="checkbox" checked={search.unknownReturn} onChange={(event) => onChange({ ...search, unknownReturn: event.target.checked })} />
            <span><strong>{t('unknownReturn')}</strong>{search.unknownReturn && <small>{t('unknownHint')}</small>}</span>
          </label>
        </form>

        <div className="benefit-row">
          {[<ReceiptText />, <Info />, <CreditCard />, <Check />].map((icon, index) => (
            <div className="benefit" key={index}>{icon}<span>{t(`benefit${index + 1}` as 'benefit1')}</span></div>
          ))}
        </div>
        <div className="trust-strip"><Users size={18} /><span>23 года работаем для вас</span><span>•</span><span>4,9 — рейтинг приложения</span></div>
      </div>
    </section>
  )
}
