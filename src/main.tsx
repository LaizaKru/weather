import React from 'react'
import ReactDOM from 'react-dom/client'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primeicons/primeicons.css'

import './styles.scss'
import App from './App.tsx'

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
