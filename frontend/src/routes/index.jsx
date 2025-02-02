import { Navigate } from "react-router-dom"
import { SignIn, SignUp } from "@clerk/clerk-react"
import Dashboard from "../pages/Dashboard"
import ProtectedRoute from "../components/ProtectedRoute"
import AuthPageLayout from "../components/AuthPageLayout"
import Landing from "../pages/Landing"
import Home from "../pages/Home"
import Overview from "../pages/Overview"
import Roadmaps from "../pages/Roadmaps"
import RoadmapDetail from "../pages/RoadmapDetail"
import Quizzes from "../pages/Quizzes"
import Projects from "../pages/Projects"
import Analytics from "../pages/Analytics"
import QuizScreen from "../pages/QuizScreen"
import QuizResults from "../pages/QuizResults"

export const createRoutes = (clerkAppearance) => [
  {
    // Landing Page Route
    path: "/",
    element: <Landing />,
    children: [
      { index: true, element: <Home /> }
    ]
  },
  {
    // Auth Routes
    path: "/sign-in",
    element: (
      <AuthPageLayout>
        <SignIn 
          appearance={clerkAppearance} 
          signUpUrl="/sign-up" 
          redirectUrl="/overview" 
        />
      </AuthPageLayout>
    )
  },
  {
    path: "/sign-up",
    element: (
      <AuthPageLayout>
        <SignUp 
          appearance={clerkAppearance} 
          signInUrl="/sign-in" 
          redirectUrl="/overview" 
        />
      </AuthPageLayout>
    )
  },
  {
    // Protected Dashboard Routes
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: "/overview", element: <Overview /> },
      { path: "/roadmaps", element: <Roadmaps /> },
      { path: "/roadmaps/:id", element: <RoadmapDetail /> },
      { path: "/quizzes", element: <Quizzes /> },
      { path: "/projects", element: <Projects /> },
      { path: "/analytics", element: <Analytics /> },
    ]
  },
  {
    path: "/quiz/:categoryId/:difficulty",
    element: <QuizScreen />
  },
  {
    path: "/results",
    element: <QuizResults />
  },
  {
    // Catch all redirect
    path: "*",
    element: <Navigate to="/" replace />
  }
] 