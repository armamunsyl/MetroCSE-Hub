import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './index.css'
import router from './Routs/Router.jsx'
import AuthProvider from './Provider/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: { borderRadius: '12px', background: '#0F172A', color: '#FFFFFF' },
        }}
      />
    </AuthProvider>
    
  </StrictMode>,
)
