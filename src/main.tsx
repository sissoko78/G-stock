import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { AuthProvider } from './features/auth/AuthProvider'
import './shared/services/firebase'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root application element is missing.')

createRoot(rootElement).render(<StrictMode><AuthProvider><App/></AuthProvider></StrictMode>)
