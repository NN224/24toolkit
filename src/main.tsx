import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from 'react-helmet-async'
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
)
