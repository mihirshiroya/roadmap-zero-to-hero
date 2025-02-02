"use client"

import { useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Tab"

export const projectsData = {
  frontend: {
    easy: [
      { id: 1, title: "Simple Landing Page", description: "Create a responsive landing page using HTML and CSS" },
      { id: 2, title: "To-Do List App", description: "Build a basic to-do list app with vanilla JavaScript" },
      { id: 3, title: "Portfolio Header", description: "Design a simple portfolio header with navigation" },
      { id: 4, title: "Login Form", description: "Create a login form with validation using JavaScript" },
      { id: 5, title: "Digital Clock", description: "Build a real-time digital clock using JavaScript" },
      { id: 6, title: "Image Slider", description: "Develop an image slider/carousel with controls" },
      { id: 7, title: "Responsive Grid", description: "Create a responsive grid layout using CSS Grid" },
      { id: 8, title: "Interactive FAQ", description: "Build an FAQ section with collapsible items" },
      { id: 9, title: "Countdown Timer", description: "Implement a countdown timer for an event" },
      { id: 10, title: "Color Picker", description: "Develop a simple color picker tool with JavaScript" },
    ],
    medium: [
      { id: 11, title: "Weather App", description: "Develop a weather app that fetches data from an API" },
      { id: 12, title: "Portfolio Website", description: "Create a personal portfolio website with multiple pages" },
      { id: 13, title: "Movie Search App", description: "Build a movie search app using a third-party API" },
      { id: 14, title: "Blog Page", description: "Create a blog page with dynamic content using JavaScript" },
      { id: 15, title: "Quiz App", description: "Develop a quiz application with multiple-choice questions" },
      { id: 16, title: "Expense Tracker", description: "Create a simple app to track expenses and calculate totals" },
      { id: 17, title: "Infinite Scroll", description: "Implement infinite scrolling for a list of items" },
      { id: 18, title: "Recipe App", description: "Build a recipe app with search and filter functionality" },
      { id: 19, title: "Gallery Viewer", description: "Create an image gallery with a lightbox effect" },
      { id: 20, title: "Drag-and-Drop App", description: "Develop a drag-and-drop interface for organizing items" },
    ],
    hard: [
      { id: 21, title: "E-commerce Site", description: "Build a full-fledged e-commerce site with product listings and cart functionality" },
      { id: 22, title: "Social Media Dashboard", description: "Develop a complex dashboard with various data visualizations" },
      { id: 23, title: "Kanban Board", description: "Build a Kanban board with drag-and-drop task management" },
      { id: 24, title: "Video Streaming App", description: "Create a basic video streaming platform" },
      { id: 25, title: "Multiplayer Game UI", description: "Design the UI for a real-time multiplayer game" },
      { id: 26, title: "Interactive Maps", description: "Develop an application with interactive map functionality" },
      { id: 27, title: "Code Editor", description: "Build a web-based code editor with syntax highlighting" },
      { id: 28, title: "Form Builder", description: "Create a drag-and-drop form builder tool" },
      { id: 29, title: "3D Product Viewer", description: "Develop a 3D product viewer using WebGL" },
      { id: 30, title: "Job Board", description: "Create a job board with listings and application functionality" },
    ],
  },
  backend: {
    easy: [
      { id: 31, title: "RESTful API", description: "Create a simple RESTful API with CRUD operations" },
      { id: 32, title: "File Upload Service", description: "Build a service that handles file uploads and storage" },
      { id: 33, title: "Database Backup Script", description: "Develop a script to automate database backups" },
      { id: 34, title: "Mailing Service", description: "Implement a backend service for sending emails" },
      { id: 35, title: "User Roles API", description: "Create an API for managing user roles and permissions" },
      { id: 36, title: "Simple Chat Server", description: "Build a basic chat server with REST endpoints" },
      { id: 37, title: "Logger Service", description: "Develop a service for logging application events" },
      { id: 38, title: "Task Tracker API", description: "Create an API for managing tasks and projects" },
      { id: 39, title: "Weather Data API", description: "Develop an API for fetching and storing weather data" },
      { id: 40, title: "Session Manager", description: "Build a service to manage user sessions securely" },
    ],
    medium: [
      { id: 41, title: "Authentication System", description: "Implement a user authentication system with JWT" },
      { id: 42, title: "Task Scheduler", description: "Develop a background task scheduler for periodic jobs" },
      { id: 43, title: "Blog API", description: "Create an API for managing blog posts and comments" },
      { id: 44, title: "E-commerce Backend", description: "Develop the backend for an e-commerce platform" },
      { id: 45, title: "Notification System", description: "Build a system for sending notifications to users" },
      { id: 46, title: "Payment Gateway Integration", description: "Integrate a payment gateway for processing payments" },
      { id: 47, title: "Game Leaderboard API", description: "Create an API for managing game leaderboards" },
      { id: 48, title: "Real-time Updates", description: "Develop a backend to push real-time updates to clients" },
      { id: 49, title: "Survey Builder Backend", description: "Create a backend service for building and managing surveys" },
      { id: 50, title: "File Compression API", description: "Implement an API for compressing and decompressing files" },
    ],
    hard: [
      { id: 51, title: "Microservices Architecture", description: "Design and implement a microservices-based application" },
      { id: 52, title: "Real-time Chat Server", description: "Build a scalable real-time chat server using WebSockets" },
      { id: 53, title: "Recommendation System", description: "Develop a recommendation system for personalized content" },
      { id: 54, title: "AI Chatbot Backend", description: "Create a backend service for an AI-driven chatbot" },
      { id: 55, title: "Blockchain Application", description: "Build a simple blockchain application with transaction support" },
      { id: 56, title: "Event-driven System", description: "Develop an event-driven architecture with message queues" },
      { id: 57, title: "Image Processing API", description: "Create an API for image processing tasks" },
      { id: 58, title: "Data Pipeline", description: "Build a data pipeline for processing and storing large datasets" },
      { id: 59, title: "IoT Device Manager", description: "Develop a backend for managing IoT devices and data" },
      { id: 60, title: "High-load System", description: "Design and implement a backend for a high-load application" },
    ],
  },
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("frontend")
  const [activeDifficulty, setActiveDifficulty] = useState("easy")

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary">Projects</h1>
      <Tabs>
        <TabsList fullWidth>
          <TabsTrigger isActive={activeCategory === "frontend"} onClick={() => setActiveCategory("frontend")} fullWidth>
            Frontend
          </TabsTrigger>
          <TabsTrigger isActive={activeCategory === "backend"} onClick={() => setActiveCategory("backend")} fullWidth>
            Backend
          </TabsTrigger>
        </TabsList>
        <TabsContent isActive={activeCategory === "frontend"}>
          <DifficultyTabs
            projects={projectsData.frontend}
            activeDifficulty={activeDifficulty}
            setActiveDifficulty={setActiveDifficulty}
          />
        </TabsContent>
        <TabsContent isActive={activeCategory === "backend"}>
          <DifficultyTabs
            projects={projectsData.backend}
            activeDifficulty={activeDifficulty}
            setActiveDifficulty={setActiveDifficulty}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DifficultyTabs({ projects, activeDifficulty, setActiveDifficulty }) {
  return (
    <Tabs>
      <TabsList fullWidth>
        <TabsTrigger isActive={activeDifficulty === "easy"} onClick={() => setActiveDifficulty("easy")} fullWidth>
          Easy
        </TabsTrigger>
        <TabsTrigger isActive={activeDifficulty === "medium"} onClick={() => setActiveDifficulty("medium")} fullWidth>
          Medium
        </TabsTrigger>
        <TabsTrigger isActive={activeDifficulty === "hard"} onClick={() => setActiveDifficulty("hard")} fullWidth>
          Hard
        </TabsTrigger>
      </TabsList>
      <TabsContent isActive={activeDifficulty === "easy"}>
        <ProjectGrid projects={projects.easy} />
      </TabsContent>
      <TabsContent isActive={activeDifficulty === "medium"}>
        <ProjectGrid projects={projects.medium} />
      </TabsContent>
      <TabsContent isActive={activeDifficulty === "hard"}>
        <ProjectGrid projects={projects.hard} />
      </TabsContent>
    </Tabs>
  )
}

function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

