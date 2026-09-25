# Туту — Кыргызстан ↔ Россия

Одностраничный интерактивный исследовательский прототип поиска авиабилетов между Кыргызстаном и Россией. Все рейсы, цены, программы и формы демонстрационные; backend и настоящая оплата отсутствуют.

## Запуск

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Production-сборка:

```bash
npm run build
npm run preview
```

## Технологии

- React + TypeScript
- Vite
- CSS variables и адаптивный CSS
- Lucide React для служебных иконок
- localStorage для языка, валюты и фильтров

## GitHub Pages

Сайт публикуется по адресу https://mn-amfibia.github.io/tutu-kyrgyzstan/.

Workflow `.github/workflows/deploy.yml` запускается после push в `main`: выполняет `npm ci`, `npm run build` и публикует папку `dist`. В `vite.config.ts` задан `base: '/tutu-kyrgyzstan/'`.

Для первой публикации в настройках репозитория откройте Settings → Pages и выберите Source: GitHub Actions.

Фирменные ассеты в `public/brand` скопированы из `references`; исходные референсы не изменены.
