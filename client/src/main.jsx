import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error('Frontend Error:', error);
  // Optional: show error on screen if blank
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">
       <h1>Runtime Error</h1>
       <p>${msg}</p>
       <pre>${error?.stack || ''}</pre>
     </div>`;
  }
};

import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
