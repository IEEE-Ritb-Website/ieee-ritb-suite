/**
 * Purpose: Application entry point. Mounts the React app with required providers.
 * Exports: None (side-effect only - renders to DOM)
 * Side effects:
 *   - Imports Fontsource fonts (Inter, Space Grotesk, JetBrains Mono)
 *   - Renders React app to #root element
 *   - Wraps app in StrictMode, and RouterProvider
 */

import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { GlobalLoader } from "@/components/common/GlobalLoader"
import { PerformanceProvider } from "./contexts/PerformanceContext"

// Fontsource managed fonts
import "@fontsource/inter/latin-400.css"
import "@fontsource/inter/latin-700.css"
import "@fontsource/space-grotesk/latin-600.css"
import "@fontsource/space-grotesk/latin-700.css"
import "@fontsource/jetbrains-mono/latin-400.css"
import "@fontsource/jetbrains-mono/latin-500.css"

import './styles/fonts.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <PerformanceProvider>
        <Suspense fallback={<GlobalLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </PerformanceProvider>
  </StrictMode>,
)
