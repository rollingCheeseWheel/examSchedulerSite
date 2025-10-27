import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthPage from "./auth/auth"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthPage {...{loginUri: "login", signUpUri: "signup", imageUrl:"concept art.png"}}/>
  </StrictMode>,
)
