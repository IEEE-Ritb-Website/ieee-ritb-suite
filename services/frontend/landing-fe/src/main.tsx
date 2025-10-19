import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './index.css'
import App from './App.tsx'

// Font Loading API - Add class when fonts are loaded
if ('fonts' in document) {
  document.documentElement.classList.add('fonts-loading');

  const fontLoader = (document as Document & { fonts?: { load: (font: string) => Promise<unknown> } }).fonts;

  if (fontLoader) {
    Promise.all([
      fontLoader.load('400 1em Inter'),
      fontLoader.load('700 1em Space Grotesk'),
      fontLoader.load('400 1em JetBrains Mono'),
    ]).then(() => {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    }).catch((error) => {
      console.warn('Font loading failed:', error);
      // Remove loading class and use system fonts
      document.documentElement.classList.remove('fonts-loading');
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
