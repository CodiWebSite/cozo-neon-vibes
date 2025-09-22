import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { SiteDataProvider } from './hooks/useContent.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteDataProvider>
      <App />
      <Toaster />
    </SiteDataProvider>
  </React.StrictMode>,
)
