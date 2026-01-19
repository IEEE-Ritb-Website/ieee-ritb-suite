/**
 * Purpose: Application entry point. Mounts the React app with required providers.
 * Exports: None (side-effect only - renders to DOM)
 * Side effects:
 *   - Imports Fontsource fonts (Inter, Space Grotesk, JetBrains Mono)
 *   - Renders React app to #root element
 *   - Wraps app in StrictMode, HelmetProvider (SEO), and RouterProvider
 */

import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

// Fontsource managed fonts
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import "@fontsource/space-grotesk/600.css"
import "@fontsource/space-grotesk/700.css"
import "@fontsource/jetbrains-mono/400.css"
import "@fontsource/jetbrains-mono/500.css"

import './styles/fonts.css'
import './index.css'

// Global loading fallback for lazy-loaded routes
const GlobalLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<GlobalLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </StrictMode>,
)
