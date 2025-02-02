import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthPageLayout from "./components/AuthPageLayout"
import LoadingSpinner from "./components/LoadingSpinner"
import { useTheme } from "./context/ThemeContext"
import { dark, neobrutalism } from '@clerk/themes'
import { createRoutes } from "./routes"
import AuthTokenSync from "./components/AuthTokenSync"

function App() {
  const { isLoaded, isSignedIn } = useAuth()
  const { theme } = useTheme()

  // Conditional appearance for Clerk
  const clerkAppearance = {
    appearance: {
      theme: theme === 'dark' ? dark : neobrutalism,
    },
    layout: {
      socialButtonsPlacement: "top",
      socialButtonsVariant: "blockButton",
      privacyPageUrl: false,
      termsPageUrl: false,
      helpPageUrl: false,
      showPoweredBy: false,
    },
    elements: {
      footer: "hidden",
      rootBox: "w-full",
      card: "shadow-none",
      header: "hidden",
      socialButtons: {
        iconButton: "hidden",
        provider: "hidden",
      },
      dividerRow: "hidden",
      formButtonPrimary: "bg-primary text-white w-full py-2 rounded hover:opacity-90 transition-opacity",
      formFieldInput: "w-full rounded border-color bg-background text-primary",
      footerAction: "hidden",
      identityPreview: "hidden",
      otpCodeFieldInput: "bg-background text-primary",
      badge: "hidden",
    },
  }

  if (!isLoaded) {
    return <LoadingSpinner />
  }

  const routes = createRoutes(clerkAppearance)

  return (
    <div className="min-h-screen bg-background">
      <AuthTokenSync />
      <Routes>
        {routes.map((route, index) => {
          if (route.children) {
            return (
              <Route key={index} path={route.path} element={route.element}>
                {route.children.map((child, childIndex) => (
                  <Route
                    key={`${index}-${childIndex}`}
                    index={child.index}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            );
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          );
        })}
      </Routes>
    </div>
  )
}

export default App
