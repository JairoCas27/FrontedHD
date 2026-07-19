import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from "./context/AuthContext"
import { CondominioProvider } from "./context/CondominioContext"

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <CondominioProvider>
                <App />
            </CondominioProvider>
        </AuthProvider>
    </StrictMode>
)