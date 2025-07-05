import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './app/globals.css'
import { ColorModeProvider } from './app/context/themeContext'

console.log('main.tsx is executing...')

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
  throw new Error('Root element not found!')
}

console.log('Root element found:', rootElement)

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </StrictMode>,
)