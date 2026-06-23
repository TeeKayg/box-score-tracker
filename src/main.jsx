// main.jsx — The entry point of the whole app.
//
// Its only job is to find the <div id="root"> in index.html and tell React
// to take over that div. Everything rendered after this point is React.
//
// StrictMode is a development helper — it intentionally double-runs certain
// things to help catch bugs early. It has no effect in a production build.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
