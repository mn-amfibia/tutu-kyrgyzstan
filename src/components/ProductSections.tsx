import { useState } from 'react'
import { Award, Bell, Briefcase, ChevronDown, CircleCheck, CreditCard, Headphones, HeartHandshake, RefreshCw, ShieldCheck, Sparkles, Ticket, Users } from 'lucide-react'
import { formatMoney, secondaryMoney } from '../currency'
import { popularRoutes, type PopularRoute } from '../popularRoutes'
import type { Currency, Language } from '../types'
import type { Translator } from '../translations'
import { Modal } from './Modal'

interface PopularRoutesProps {
  currency: Currency
  t: Translator
  onRoute: (route: PopularRoute) => void
}

export function PopularRoutes({ currency, t, onRoute }: PopularRoutesProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head"><span className="eyebrow">Кыргызстан ↔ Россия</span><h2>{t('popular')}</h2></div>
        <div className="route-grid">
          {popularRoutes.map((route, index) => (
            <article className="route-card" key={`${route.from}-${route.to}`}>
              <span className="route-number">0{index + 1}</span><div className="route-plane">✈</div>
              <h3>{route.from} <span>→</span> {route.to}</h3>
              <p>{t('fromPrice')} <strong>{formatMoney(route.priceRUB, currency)}</strong><small>≈ {secondaryMoney(route.priceRUB, currency)}</small></p>
              <button className="button secondary" onClick={() => onRoute(route)}>{t('tickets')}</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const recommendationIcons = [<Ticket />, <Briefcase />, <RefreshCw />, <ShieldCheck />]
export function TripPurpose({ language, t, onGroup }: { language: Language; t: Translator; onGroup: () => void }) {
  const [selected, setSelected] = useState(0)
  const labels = [t('purposeWork'), t('purposeFamily'), t('purposeHome'), t('purposeGroup'), t('purposeFrequent')]
  const recommendations = {
    ru: [['Выгодная цена', 'Багаж', 'Сохранение маршрута', 'Гибкая обратная дата'], ['Удобное время', 'Багаж', 'Туда и обратно', 'Возможность возврата'], ['Ближайшие рейсы', 'В одну сторону', 'Изменение даты', 'Проверка цены'], ['Несколько пассажиров', 'Сохранение данных', 'Программа организаторов', 'Поддержка'], ['Повтор поиска', 'Уведомления о цене', 'Золотой маршрут', 'Бонусы']],
    ky: [['Ыңгайлуу баа', 'Жүк', 'Каттамды сактоо', 'Ийкемдүү кайтуу күнү'], ['Ыңгайлуу убакыт', 'Жүк', 'Эки тарапка', 'Кайтаруу мүмкүнчүлүгү'], ['Жакынкы каттамдар', 'Бир тарапка', 'Күндү өзгөртүү', 'Бааны текшерүү'], ['Бир нече жүргүнчү', 'Маалыматты сактоо', 'Уюштуруучулар программасы', 'Колдоо'], ['Издөөнү кайталоо', 'Баа билдирмелери', 'Алтын каттам', 'Бонустар']],
    en: [['Good price', 'Baggage', 'Saved route', 'Flexible return'], ['Convenient time', 'Baggage', 'Round trip', 'Refund option'], ['Nearest flights', 'One way', 'Date changes', 'Price check'], ['Multiple passengers', 'Saved details', 'Organiser program', 'Support'], ['Repeat search', 'Price alerts', 'Golden Route', 'Rewards']],
  }[language]
  return (
    <section className="section purpose-section">
      <div className="container purpose-card">
        <div><span className="eyebrow">Персонализация</span><h2>{t('purposeTitle')}</h2>
          <div className="purpose-tabs">{labels.map((label, index) => <button className={selected === index ? 'active' : ''} key={label} onClick={() => { setSelected(index); if (index === 3) onGroup() }}>{label}</button>)}</div>
        </div>
        <div className="recommendation-grid">{recommendations[selected].map((text, index) => <div key={text}>{recommendationIcons[index]}<span>{text}</span></div>)}</div>
      </div>
    </section>
  )
}

export function SpecialOffers({ currency, language }: { currency: Currency; language: Language }) {
  const title = language === 'ru' ? 'Специальные предложения' : language === 'ky' ? 'Атайын сунуштар' : 'Special offers'
  const offers = [
    { title: language === 'en' ? 'Flexible round trip' : language === 'ky' ? 'Ийкемдүү эки тараптуу билет' : 'Гибкий билет туда и обратно', route: 'Бишкек — Москва', price: 27890, tone: 'purple' },
    { title: language === 'en' ? 'Baggage included' : language === 'ky' ? 'Жүк баага кирет' : 'Багаж включён', route: 'Ош — Москва', price: 18520, tone: 'blue' },
    { title: language === 'en' ? 'Free 24-hour hold' : language === 'ky' ? '24 саатка акысыз бронь' : 'Бронь на 24 часа', route: 'Бишкек — Екатеринбург', price: 15890, tone: 'orange' },
  ]
  return <section className="section"><div className="container"><div className="section-head"><span className="eyebrow">Туту</span><h2>{title}</h2></div><div className="offer-grid">{offers.map((offer) => <article className={`offer-card ${offer.tone}`} key={offer.title}><div><span>{offer.title}</span><h3>{offer.route}</h3><p>{formatMoney(offer.price, currency)} <small>≈ {secondaryMoney(offer.price, currency)}</small></p></div><PlaneArt /></article>)}</div></div></section>
}
function PlaneArt() { return <div className="plane-art">✈</div> }

interface ProgramsProps {
  currency: Currency
  t: Translator
  onAlert: () => void
  onResults: () => void
  onRepeat: () => void
}

export function Programs({ currency, t, onAlert, onResults, onRepeat }: ProgramsProps) {
  const [saved, setSaved] = useState<string[]>([])
  const [groupOpen, setGroupOpen] = useState(false)
  const [groupDone, setGroupDone] = useState(false)
  const toggleSaved = (value: string) => setSaved((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value])

  return (
    <>
      <section className="section frequent-section" id="frequent"><div className="container">
        <div className="section-head"><span className="eyebrow">Smart repeat</span><h2>{t('frequentTitle')}</h2></div>
        <article className="frequent-card"><div><small>{t('savedExample')}</small><h3>Бишкек <span>→</span> Москва</h3><p>1 взрослый · эконом · {formatMoney(14220, currency)} · ≈ {secondaryMoney(14220, currency)}</p></div>
          <div className="action-grid"><button onClick={onRepeat}><RefreshCw />{t('repeat')}</button><button onClick={() => { document.getElementById('top')?.scrollIntoView(); toggleSaved('dates') }}><Ticket />{t('editDates')}</button><button onClick={onAlert}><Bell />{t('watchPrice')}</button><button onClick={() => toggleSaved('passengers')}><Users />{saved.includes('passengers') ? t('saved') : t('savePassengers')}</button><button onClick={() => toggleSaved('return')}><Bell />{saved.includes('return') ? t('saved') : t('remindReturn')}</button></div>
        </article>
      </div></section>

      <section className="section golden-section"><div className="container golden-card">
        <div className="golden-copy"><span className="golden-label"><Sparkles size={15} /> Персональная программа</span><h2>{t('goldenTitle')}</h2><p>{t('goldenText')}</p>
          <ul><li>Персональные предложения</li><li>Ранние уведомления о снижении цены</li><li>Бесплатная бронь на 24 часа</li><li>Бонусы за повторные покупки</li><li>Гибкие условия обмена или возврата</li><li>Сохранённые пассажиры</li></ul>
          <div className="button-row"><button className="button gold-button" onClick={() => toggleSaved('route')}>{saved.includes('route') ? t('routeSaved') : t('saveRoute')}</button><button className="button secondary-dark" onClick={onResults}>{t('viewOffers')}</button><button className="link-light" onClick={onAlert}>{t('watchPrice')}</button></div>
          <small>{formatMoney(14220, currency)} · ≈ {secondaryMoney(14220, currency)}</small>
        </div><img src="./brand/trophy.png" alt="" aria-hidden="true" />
      </div></section>

      <section className="section"><div className="container loyalty-grid">
        <div className="loyalty-copy"><span className="eyebrow">Tutu Bonus</span><h2>{t('loyaltyTitle')}</h2><p>{t('demo')}</p><div className="bonus-meter"><strong>{t('yourBonuses')}</strong><div><i /></div><span>{t('nextReward')}</span></div></div>
        <div className="mechanic-grid"><div><Award /><strong>+ бонус за каждую покупку</strong></div><div><Ticket /><strong>Промокод после нескольких поездок</strong></div><div><Sparkles /><strong>Больше за билет туда и обратно</strong></div></div>
      </div></section>

      <section className="section group-section"><div className="container group-card">
        <div><span className="eyebrow">Tutu Teams</span><h2>{t('groupTitle')}</h2><p>{t('groupText')}</p><div className="feature-list"><span><CircleCheck />Персональный промокод</span><span><CircleCheck />Сохранённые пассажиры</span><span><CircleCheck />Помощь при групповой покупке</span><span><CircleCheck />Бонусы за поездки</span></div><button className="button" onClick={() => setGroupOpen(true)}>{t('join')}</button></div>
        <img src="./brand/suitcase.png" alt="" aria-hidden="true" />
      </div></section>

      <Modal open={groupOpen} title={t('groupTitle')} onClose={() => { setGroupOpen(false); setGroupDone(false) }}>
        {groupDone ? <div className="success-panel"><CircleCheck /><h3>{t('groupDone')}</h3></div> :
          <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setGroupDone(true) }}>
            <label>{t('name')}<input required /></label><label>{t('phone')}<input required type="tel" /></label><label>{t('city')}<input required /></label><label>{t('frequentRoute')}<input placeholder="Бишкек — Москва" /></label><label>{t('groupSize')}<input required type="number" min="2" /></label><button className="button button-full">{t('send')}</button>
          </form>}
      </Modal>
    </>
  )
}

export function TrustContactFaq({ language, t }: { language: Language; t: Translator }) {
  const [open, setOpen] = useState<number | null>(0)
  const questions = {
    ru: [
      ['Можно ли оплатить билет картой кыргызского банка?', 'Для отмеченных предложений доступна такая возможность. Перед оформлением мы повторно проверим поддержку выбранной карты.'],
      ['В какой валюте спишутся деньги?', 'В прототипе предполагаемая валюта списания — RUB. Банк может выполнить конвертацию по своему курсу.'],
      ['Что означает бесплатная бронь?', 'Предложение фиксируется на 24 часа без оплаты, если это доступно для тарифа.'],
      ['Можно ли вернуть билет?', 'Это зависит от тарифа. Возвратные условия и возможные удержания видны в карточке до оформления.'],
      ['Можно ли изменить дату?', 'Если тариф гибкий, дату можно изменить по правилам авиакомпании.'],
      ['Почему цена может измениться?', 'Авиакомпания может обновить доступность тарифа. Мы проверяем цену перед переходом к оформлению.'],
      ['Как работает «Золотой маршрут»?', 'Это персональная подборка и ранние уведомления для часто используемого направления, а не VIP-тариф.'],
      ['Как купить билеты для группы?', 'Оставьте заявку в программе для организаторов: команда поможет подобрать рейсы и сохранить данные пассажиров.'],
    ],
    ky: [
      ['Кыргыз банкынын картасы менен төлөсө болобу?', 'Белгиленген сунуштар үчүн мүмкүн. Сатып алууга чейин картанын колдоосун кайра текшеребиз.'],
      ['Акча кайсы валютада чыгарылат?', 'Прототипте болжолдуу валюта — RUB. Банк өз курсу менен конвертация жасай алат.'],
      ['Акысыз бронь деген эмне?', 'Тарифте жеткиликтүү болсо, сунуш 24 саатка төлөмсүз бекитилет.'],
      ['Билетти кайтарса болобу?', 'Тарифке жараша. Шарттар жана кармоолор сатып алууга чейин көрсөтүлөт.'],
      ['Күндү өзгөртсө болобу?', 'Ийкемдүү тарифте авиакомпаниянын эрежеси боюнча өзгөртүүгө болот.'],
      ['Эмне үчүн баа өзгөрүшү мүмкүн?', 'Авиакомпания тарифтин жеткиликтүүлүгүн жаңыртышы мүмкүн.'],
      ['«Алтын каттам» кантип иштейт?', 'Бул көп колдонулган багыт үчүн жеке сунуштар, VIP-тариф эмес.'],
      ['Топко билетти кантип алса болот?', 'Уюштуруучулар программасына өтүнмө калтырыңыз.'],
    ],
    en: [
      ['Can I pay with a Kyrgyz bank card?', 'This is available for marked offers. We will verify support again before checkout.'],
      ['Which currency will be charged?', 'The expected charge currency in this prototype is RUB. Your bank may convert at its own rate.'],
      ['What is a free hold?', 'If the fare allows it, the offer is held for 24 hours without payment.'],
      ['Can I refund a ticket?', 'It depends on the fare. Terms and possible deductions are visible before checkout.'],
      ['Can I change the date?', 'Flexible fares can be changed under the airline’s rules.'],
      ['Why can the price change?', 'The airline may update fare availability. We recheck before checkout.'],
      ['How does Golden Route work?', 'It provides personalised offers for a frequent route; it is not a VIP fare.'],
      ['How do I buy tickets for a group?', 'Apply to the organiser program for route and passenger support.'],
    ],
  }[language]
  return (
    <>
      <section className="section trust-section"><div className="container trust-card">
        <img src="./brand/boarding-pass.png" alt="" aria-hidden="true" /><div><span className="eyebrow">23 года рядом</span><h2>{t('trustTitle')}</h2><div className="trust-grid"><span><ShieldCheck />{t('trustYears')}</span><span><Headphones />{t('trustSupport')}</span><span><RefreshCw />{t('trustConditions')}</span><span><CreditCard />{t('trustCheck')}</span></div></div>
      </div></section>
      <section className="section contact-section" id="contact"><div className="container contact-card"><div><span className="eyebrow">{t('support')}</span><h2>{t('contactTitle')}</h2><p>{t('contactText')}</p><button className="button">{t('goHelp')}</button></div><img src="./brand/boarding-pass.png" alt="" /></div></section>
      <section className="section faq-section"><div className="container"><div className="section-head"><span className="eyebrow">FAQ</span><h2>{t('faq')}</h2></div><div className="faq-list">{questions.map(([question, answer], index) => <div className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}><span>{question}</span><ChevronDown /></button>{open === index && <p>{answer}</p>}</div>)}</div></div></section>
    </>
  )
}

export function Footer({ t }: { t: Translator }) {
  return <footer className="footer"><div className="container footer-grid"><div className="footer-brand"><img src="./brand/logo.svg" alt="Туту" /><p>Кыргызстан ↔ Россия</p></div><div><strong>{t('company')}</strong><a>{t('about')}</a><a>{t('vacancies')}</a><a>{t('contacts')}</a><a>{t('news')}</a></div><div><strong>{t('travelers')}</strong><a>{t('support')}</a><a>{t('feedback')}</a><a>{t('legal')}</a></div><div><strong>{t('partners')}</strong><a>{t('becomePartner')}</a><a>{t('legal')}</a></div></div><div className="container concept-note">{t('concept')}</div></footer>
}
