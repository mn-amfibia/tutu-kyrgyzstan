import { useEffect, useState } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import type { Currency, Language } from '../types'
import type { Translator } from '../translations'

interface HeaderProps {
  language: Language
  currency: Currency
  onLanguage: (language: Language) => void
  onCurrency: (currency: Currency) => void
  t: Translator
}

export function Header({ language, currency, onLanguage, onCurrency, t }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#top" aria-label="Туту" className="logo-link">
          <img src="./brand/logo.svg" alt="Туту" className="logo" />
        </a>
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Основная навигация">
          <a href="#contact">{t('help')}</a>
          <a href="#frequent"><Heart size={16} /> {t('favorites')}</a>
          <div className="segmented compact" aria-label="Language">
            {(['ru', 'ky', 'en'] as Language[]).map((item) => (
              <button key={item} className={language === item ? 'active' : ''} onClick={() => onLanguage(item)}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="segmented compact" aria-label="Currency">
            {(['RUB', 'KGS'] as Currency[]).map((item) => (
              <button key={item} className={currency === item ? 'active' : ''} onClick={() => onCurrency(item)}>
                {item}
              </button>
            ))}
          </div>
          <button className="button button-small">{t('signIn')}</button>
        </nav>
        <button className="mobile-menu" aria-label={t('menu')} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
