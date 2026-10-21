import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { logger } from './shared/utils/logger'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root application element is missing.')

createRoot(rootElement).render(<StrictMode><App/></StrictMode>)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
    logger.error('Service worker registration failed', { error: error instanceof Error ? error.message : 'unknown' })
  }))
}
