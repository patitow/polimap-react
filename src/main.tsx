import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { ClerkProviderWrapper } from './providers/clerkProviderWrapper.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProviderWrapper>
        <App />
      </ClerkProviderWrapper>
    </BrowserRouter>
  </StrictMode>,
)
