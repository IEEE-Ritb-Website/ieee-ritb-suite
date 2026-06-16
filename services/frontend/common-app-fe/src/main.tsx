import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from '@/routes'
import { registerTerminalLogger } from 'shared-clients'

// Forward shared-clients connection warnings to the Vite dev server terminal
// via the HMR WebSocket. In production, import.meta.hot is undefined so this is a no-op.
if (import.meta.hot) {
  registerTerminalLogger((message) => {
    import.meta.hot!.send("astranova:terminal-log", { message });
  });
}

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
