import { useEffect, useMemo, useState } from 'react'
import { Bell, BriefcaseBusiness, Check, Clock3, CreditCard, Filter, Plane, RefreshCw, RotateCcw, ShieldCheck, TicketCheck } from 'lucide-react'
import { formatMoney, secondaryMoney } from '../currency'
import { airlines } from '../mockFlights'
import type { Currency, Filters, Flight, SortKey } from '../types'
import type { Translator } from '../translations'
import { Modal } from './Modal'

export const defaultFilters: Filters = {
  freeBooking: false, refundable: false, flexibleDate: false, kyrgyzCards: false,
  baggage: false, noBaggage: false, direct: false, oneStop: false, periods: [],
  maxPrice: 50000, maxDuration: 720, airlines: [],
}

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
  count: number
  t: Translator
}

function FilterPanel({ filters, onChange, count, t }: FilterPanelProps) {
  const checkbox = (key: keyof Pick<Filters, 'freeBooking' | 'refundable' | 'flexibleDate' | 'kyrgyzCards' | 'baggage' | 'noBaggage' | 'direct' | 'oneStop'>, label: string) => (
    <label className="check-row"><input type="checkbox" checked={filters[key]} onChange={(event) => onChange({ ...filters, [key]: event.target.checked })} /><span>{label}</span></label>
  )
  return (
    <div className="filter-panel">
      <div className="filter-heading"><div><strong>{t('filters')}</strong><small>{count} {t('found')}</small></div><button className="link-button" onClick={() => onChange(defaultFilters)}><RotateCcw size={14} />{t('reset')}</button></div>
      <fieldset><legend>{t('flexible')}</legend>
        {checkbox('freeBooking', t('freeBooking'))}{checkbox('refundable', t('refundable'))}
        {checkbox('flexibleDate', t('changeDate'))}{checkbox('kyrgyzCards', t('kyrgyzCards'))}
      </fieldset>
      <fieldset><legend>{t('mainParams')}</legend>
        {checkbox('baggage', t('baggage'))}{checkbox('noBaggage', t('noBaggage'))}
        {checkbox('direct', t('direct'))}{checkbox('oneStop', t('oneStop'))}
      </fieldset>
      <fieldset><legend>{t('time')}</legend>
        <div className="chip-grid">
          {(['morning', 'day', 'evening', 'night'] as const).map((period) => (
            <button key={period} className={`chip ${filters.periods.includes(period) ? 'selected' : ''}`} onClick={() => onChange({ ...filters, periods: filters.periods.includes(period) ? filters.periods.filter((item) => item !== period) : [...filters.periods, period] })}>{t(period)}</button>
          ))}
        </div>
      </fieldset>
      <fieldset><legend>{t('extra')}</legend>
        <label className="range-label"><span>{t('maxPrice')}</span><strong>{formatMoney(filters.maxPrice, 'RUB')}</strong><input type="range" min="10000" max="50000" step="1000" value={filters.maxPrice} onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })} /></label>
        <label className="range-label"><span>{t('maxDuration')}</span><strong>{Math.floor(filters.maxDuration / 60)} ч</strong><input type="range" min="180" max="720" step="30" value={filters.maxDuration} onChange={(event) => onChange({ ...filters, maxDuration: Number(event.target.value) })} /></label>
        <span className="sub-label">{t('airline')}</span>
        {airlines.map((airline) => <label className="check-row" key={airline}><input type="checkbox" checked={filters.airlines.includes(airline)} onChange={() => onChange({ ...filters, airlines: filters.airlines.includes(airline) ? filters.airlines.filter((item) => item !== airline) : [...filters.airlines, airline] })} /><span>{airline}</span></label>)}
      </fieldset>
    </div>
  )
}

interface FlightCardProps {
  flight: Flight
  currency: Currency
  onChoose: (flight: Flight) => void
  t: Translator
}

function FlightCard({ flight, currency, onChoose, t }: FlightCardProps) {
  const [condition, setCondition] = useState<string | null>(null)
  const duration = `${Math.floor(flight.durationMinutes / 60)} ч ${flight.durationMinutes % 60} мин`
  const badge = (show: boolean, icon: React.ReactNode, text: string, details: string) => show && (
    <button className="condition-badge" onClick={() => setCondition(condition === text ? null : text)}>{icon}{text}</button>
  )
  return (
    <article className={`flight-card ${flight.recommended ? 'flight-recommended' : ''}`}>
      <div className="flight-top">
        <div className="airline"><span className="airline-mark"><Plane size={16} /></span><strong>{flight.airline}</strong>{flight.recommended && <span className="recommended">{t('recommended')}</span>}</div>
        <span className="freshness"><RefreshCw size={13} /> {t('checked')} {flight.priceCheckedMinutesAgo} {t('minutesAgo')}</span>
      </div>
      <div className="flight-main">
        <div className="flight-route">
          <div className="flight-time"><strong>{flight.departureTime}</strong><span>{flight.departureCity}</span><small>{flight.departureAirport}</small></div>
          <div className="flight-line"><span>{duration} {t('onWay')}</span><div><i /></div><small>{flight.stops === 0 ? t('nonstop') : t('stop')}</small></div>
          <div className="flight-time align-right"><strong>{flight.arrivalTime}</strong><span>{flight.arrivalCity}</span><small>{flight.arrivalAirport}</small></div>
        </div>
        <div className="flight-price">
          <small>{t('totalPrice')}</small><strong>{formatMoney(flight.priceRUB, currency)}</strong><span>≈ {secondaryMoney(flight.priceRUB, currency)}</span><em>{flight.seatsLeft} {t('seats')}</em>
          <button className="button" onClick={() => onChoose(flight)}>{t('choose')}</button>
          <small>{t('checkAvailability')}</small>
        </div>
      </div>
      <div className="condition-row">
        <span className={`plain-badge ${flight.baggage ? 'positive' : ''}`}><BriefcaseBusiness size={14} />{flight.baggage ? t('included') : t('notIncluded')}</span>
        {badge(flight.freeBooking, <Clock3 size={14} />, t('bookingBadge'), 'booking')}
        {badge(flight.refundable, <RotateCcw size={14} />, t('returnBadge'), 'refund')}
        {badge(flight.flexibleDate, <TicketCheck size={14} />, t('dateBadge'), 'date')}
        {badge(flight.kyrgyzCardsSupported, <CreditCard size={14} />, t('cardBadge'), 'card')}
        {!flight.freeBooking && <span className="plain-badge muted">{t('noBooking')}</span>}
        {!flight.refundable && <span className="plain-badge muted">{t('nonRefundable')}</span>}
      </div>
      {condition && (
        <div className="condition-info" role="status">
          {condition === t('bookingBadge') && 'Зафиксируем предложение на 24 часа без оплаты.'}
          {condition === t('returnBadge') && 'Оформить возврат можно онлайн по правилам тарифа.'}
          {condition === t('dateBadge') && 'Можно изменить дату по правилам тарифа.'}
          {condition === t('cardBadge') && 'Перед оформлением повторно проверим поддержку выбранной карты.'}
        </div>
      )}
    </article>
  )
}

function FlightDetails({ flight, currency, t, onClose }: { flight: Flight; currency: Currency; t: Translator; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'confirmed' | 'changed'>('idle')
  const verify = () => {
    setStatus('checking')
    window.setTimeout(() => setStatus(flight.priceChanged ? 'changed' : 'confirmed'), 800)
  }
  return (
    <Modal open title={t('flightDetails')} onClose={onClose} wide>
      <div className="detail-route">
        <div><span>{flight.airline}</span><strong>{flight.departureTime} · {flight.departureCity}</strong><small>{flight.departureAirport}</small></div>
        <Plane />
        <div className="align-right"><span>{flight.stops === 0 ? t('nonstop') : t('stop')}</span><strong>{flight.arrivalTime} · {flight.arrivalCity}</strong><small>{flight.arrivalAirport}</small></div>
      </div>
      <div className="detail-grid">
        <section><h3>{t('fareIncludes')}</h3>
          <p><BriefcaseBusiness size={17} /> {flight.baggage ? t('included') : t('notIncluded')}</p>
          <p><Clock3 size={17} /> {flight.freeBooking ? 'Зафиксируем предложение на 24 часа без оплаты.' : t('noBooking')}</p>
          <p><RotateCcw size={17} /> {flight.refundable ? flight.refundConditions : t('nonRefundable')}</p>
          <p><TicketCheck size={17} /> {flight.flexibleDate ? 'Можно изменить дату по правилам тарифа.' : t('noDateChange')}</p>
          {flight.refundable && <ol className="steps"><li>Откройте заказ</li><li>Выберите пассажиров</li><li>Проверьте расчёт удержаний</li><li>Подтвердите возврат онлайн</li></ol>}
        </section>
        <section><h3>{t('payment')}</h3><p><CreditCard size={17} /> {t('paymentText')}</p>
          <div className="currency-summary"><span>{t('displayCurrency')}: <b>{currency}</b></span><span>{t('chargeCurrency')}: <b>RUB*</b></span></div>
          <small>{t('exchangeNote')}</small>
        </section>
      </div>
      <div className="checkout-panel">
        <div><small>{t('totalPrice')}</small><strong>{formatMoney(flight.priceRUB + (status === 'changed' ? 620 : 0), currency)}</strong><span>≈ {secondaryMoney(flight.priceRUB + (status === 'changed' ? 620 : 0), currency)}</span></div>
        {status === 'idle' && <button className="button" onClick={verify}>{t('verify')}</button>}
        {status === 'checking' && <button className="button" disabled><span className="spinner" /> {t('checking')}</button>}
      </div>
      {status === 'confirmed' && <div className="status-message success"><Check /> <div><strong>{t('confirmed')}</strong><span>{t('checkAvailability')}</span></div></div>}
      {status === 'changed' && <div className="status-message warning"><InfoIcon /><div><strong>{t('changed')}</strong><span>{t('changedWhy')}</span><div className="button-row"><button className="button">{t('continueNew')}</button><button className="button secondary" onClick={onClose}>{t('similar')}</button></div></div></div>}
    </Modal>
  )
}

function InfoIcon() { return <span className="info-icon">!</span> }

interface SearchResultsProps {
  route: string
  flights: Flight[]
  filters: Filters
  onFilters: (filters: Filters) => void
  sort: SortKey
  onSort: (sort: SortKey) => void
  currency: Currency
  onAlert: () => void
  onChangeSearch: () => void
  t: Translator
}

export function SearchResults({ route, flights, filters, onFilters, sort, onSort, currency, onAlert, onChangeSearch, t }: SearchResultsProps) {
  const [mobileFilters, setMobileFilters] = useState(false)
  const [selected, setSelected] = useState<Flight | null>(null)
  const filtered = useMemo(() => flights.filter((flight) =>
    (!filters.freeBooking || flight.freeBooking) &&
    (!filters.refundable || flight.refundable) &&
    (!filters.flexibleDate || flight.flexibleDate) &&
    (!filters.kyrgyzCards || flight.kyrgyzCardsSupported) &&
    (!filters.baggage || flight.baggage) &&
    (!filters.noBaggage || !flight.baggage) &&
    (!filters.direct || flight.stops === 0) &&
    (!filters.oneStop || flight.stops === 1) &&
    (!filters.periods.length || filters.periods.includes(flight.departurePeriod)) &&
    flight.priceRUB <= filters.maxPrice && flight.durationMinutes <= filters.maxDuration &&
    (!filters.airlines.length || filters.airlines.includes(flight.airline))
  ).sort((a, b) => sort === 'cheap' ? a.priceRUB - b.priceRUB : sort === 'fast' ? a.durationMinutes - b.durationMinutes : sort === 'early' ? a.departureTime.localeCompare(b.departureTime) : Number(b.recommended) - Number(a.recommended) || a.priceRUB - b.priceRUB), [flights, filters, sort])

  useEffect(() => setSelected(null), [route])

  return (
    <section className="section results-section" id="results">
      <div className="container">
        <div className="transparency-banner"><ShieldCheck /><div><strong>{t('transparentTitle')}</strong><span>{t('transparentText')}</span></div></div>
        <div className="results-toolbar">
          <div><span className="eyebrow">Кыргызстан ↔ Россия</span><h2>{route}</h2><p>{filtered.length} {t('found')}</p></div>
          <div className="toolbar-actions">
            <button className="button secondary" onClick={onAlert}><Bell size={17} />{t('watchPrice')}</button>
            <select aria-label="Сортировка" value={sort} onChange={(event) => onSort(event.target.value as SortKey)}>
              <option value="recommended">{t('optimal')}</option><option value="cheap">{t('cheap')}</option><option value="fast">{t('fast')}</option><option value="early">{t('early')}</option>
            </select>
            <button className="button mobile-filter-button" onClick={() => setMobileFilters(true)}><Filter size={17} />{t('filters')}</button>
          </div>
        </div>
        <div className="results-layout">
          <aside className="filters-desktop"><FilterPanel filters={filters} onChange={onFilters} count={filtered.length} t={t} /></aside>
          <div className="flight-list">
            {filtered.length ? filtered.map((flight) => <FlightCard key={flight.id} flight={flight} currency={currency} onChoose={setSelected} t={t} />) :
              <div className="empty-state"><img src="./brand/boarding-pass.png" alt="" /><h3>{t('noResults')}</h3><div className="button-row"><button className="button" onClick={() => onFilters(defaultFilters)}>{t('reset')}</button><button className="button secondary" onClick={onChangeSearch}>{t('changeSearch')}</button></div></div>}
          </div>
        </div>
      </div>
      <Modal open={mobileFilters} title={t('filters')} onClose={() => setMobileFilters(false)}><FilterPanel filters={filters} onChange={onFilters} count={filtered.length} t={t} /><button className="button button-full" onClick={() => setMobileFilters(false)}>{t('done')} · {filtered.length}</button></Modal>
      {selected && <FlightDetails flight={selected} currency={currency} t={t} onClose={() => setSelected(null)} />}
    </section>
  )
}
