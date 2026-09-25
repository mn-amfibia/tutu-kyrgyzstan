import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { keepTypography } from './typography'
import './styles.css'

const root = document.getElementById('root')!
keepTypography(root)

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
