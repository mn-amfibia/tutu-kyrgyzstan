import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Footer, PopularRoutes, Programs, SpecialOffers, TripPurpose, TrustContactFaq } from './components/ProductSections'
import { defaultFilters, SearchResults } from './components/SearchResults'
import { Modal } from './components/Modal'
import { mockFlights } from './mockFlights'
import type { Currency, Filters, Language, SearchState, SortKey } from './types'
import { getTranslation, type TranslationKey } from './translations'
import { loadStored, saveStored } from './storage'
import type { PopularRoute } from './popularRoutes'

const initialSearch: SearchState = {
  from: 'Бишкек',
  to: 'Москва',
  departureDate: '2026-10-14',
  returnDate: '2026-10-27',
  passengers: { adults: 1, children: 0, infants: 0 },
}

function App() {
  const [language, setLanguage] = useState<Language>(() => loadStored('tutu-language', 'ru'))
  const [currency, setCurrency] = useState<Currency>(() => loadStored('tutu-currency', 'RUB'))
  const [search, setSearch] = useState<SearchState>(initialSearch)
  const [activeSearch, setActiveSearch] = useState<SearchState>(initialSearch)
  const [filters, setFilters] = useState<Filters>(() => loadStored('tutu-filters', defaultFilters))
  const [sort, setSort] = useState<SortKey>('recommended')
  const [loading, setLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertDone, setAlertDone] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const t = (key: TranslationKey) => getTranslation(language, key)

  useEffect(() => saveStored('tutu-language', language), [language])
  useEffect(() => saveStored('tutu-currency', currency), [currency])
  useEffect(() => saveStored('tutu-filters', filters), [filters])
  useEffect(() => { document.documentElement.lang = language }, [language])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const routeFlights = useMemo(() => mockFlights.filter((flight) =>
    flight.departureCity.toLocaleLowerCase().includes(activeSearch.from.toLocaleLowerCase()) &&
    flight.arrivalCity.toLocaleLowerCase().includes(activeSearch.to.toLocaleLowerCase())
  ), [activeSearch])

  const runSearch = (nextSearch = search) => {
    if (!nextSearch.from.trim() || !nextSearch.to.trim()) {
      setToast(language === 'en' ? 'Select both cities' : language === 'ky' ? 'Эки шаарды тандаңыз' : 'Выберите города отправления и назначения')
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      setActiveSearch(nextSearch)
      setLoading(false)
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 750)
  }

  const runRoute = (route: PopularRoute) => {
    const next = { ...search, from: route.from, to: route.to }
    setSearch(next)
    runSearch(next)
  }

  const repeatDefault = () => {
    const next = { ...search, from: 'Бишкек', to: 'Москва' }
    setSearch(next)
    runSearch(next)
  }

  const showToast = (message = t('saved')) => setToast(message)

  return (
    <>
      <Header language={language} currency={currency} onLanguage={setLanguage} onCurrency={setCurrency} t={t} />
      <main>
        <Hero search={search} loading={loading} onChange={setSearch} onSearch={() => runSearch()} t={t} />
        <PopularRoutes currency={currency} t={t} onRoute={runRoute} />
        <TripPurpose language={language} t={t} onGroup={() => document.querySelector('.group-section')?.scrollIntoView({ behavior: 'smooth' })} />
        <SpecialOffers currency={currency} language={language} />
        <SearchResults
          route={`${activeSearch.from} → ${activeSearch.to}`}
          flights={routeFlights}
          filters={filters}
          onFilters={setFilters}
          sort={sort}
          onSort={setSort}
          currency={currency}
          onAlert={() => { setAlertDone(false); setAlertOpen(true) }}
          onChangeSearch={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}
          t={t}
        />
        <Programs
          currency={currency}
          t={t}
          onAlert={() => { setAlertDone(false); setAlertOpen(true) }}
          onResults={() => { setFilters({ ...defaultFilters, freeBooking: true }); document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }) }}
          onRepeat={repeatDefault}
        />
        <TrustContactFaq language={language} t={t} />
      </main>
      <Footer t={t} />

      <Modal open={alertOpen} title={t('alertTitle')} onClose={() => setAlertOpen(false)}>
        {alertDone ? <div className="success-panel"><CheckCircle2 /><h3>{t('alertDone')}</h3></div> :
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setAlertDone(true) }}>
            <label>{t('contact')}<input required placeholder="+996 555 000 000" /></label>
            <label>{t('route')}<input readOnly value={`${activeSearch.from} → ${activeSearch.to}`} /></label>
            <label>{t('alertCurrency')}<select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}><option>RUB</option><option>KGS</option></select></label>
            <button className="button button-full"><Bell size={17} />{t('subscribe')}</button>
          </form>}
      </Modal>
      {toast && <div className="toast" role="status"><CheckCircle2 />{toast}</div>}
      <button className="screen-reader-only" onClick={() => showToast()} aria-hidden="true">toast</button>
    </>
  )
}

export default App
