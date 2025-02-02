import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import App from './App'
import './index.css'
import { dark, neobrutalism } from '@clerk/themes'
import { setAuthToken } from './Slicers/authSlice'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const ThemedClerkProvider = ({ children }) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === 'dark' ? dark : neobrutalism,
        variables: {
          colorPrimary: theme === 'dark' ? '#ffffff' : '#000000',
          colorText: theme === 'dark' ? '#ffffff' : '#000000',
        }
      }}
      publishableKey={PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ThemedClerkProvider>
            <App />
          </ThemedClerkProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
