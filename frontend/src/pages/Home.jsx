import React from "react"
import {
  UserPlus,
  PresentationIcon as PresentationChart,
  BookOpen,
  Trophy,
  BarChart,
  MessageSquare,
  Lightbulb,
  GraduationCap,
  Users,
  Star,
  Heart,
  Mail, MapPin, Clock
} from "lucide-react"
import { useState } from "react"

const features = [
  {
    name: "Personalized Onboarding",
    description:
      "Start your journey with a tailored experience. Sign up easily and set your preferences to get a learning path that fits your goals.",
    icon: UserPlus,
  },
  {
    name: "Smart Dashboard",
    description: "Track your progress, find suggested quizzes, and discover recommended projects all in one place.",
    icon: PresentationChart,
  },
  {
    name: "Comprehensive Content",
    description:
      "Dive into structured roadmaps, reinforce your knowledge with quizzes, and apply your skills through guided projects.",
    icon: BookOpen,
  },
  {
    name: "Gamified Learning",
    description:
      "Stay motivated with points, badges, and a supportive community as you progress through your learning journey.",
    icon: Trophy,
  },
  {
    name: "Progress Tracking",
    description: "Visualize your growth with detailed analytics and charts that showcase your achievements.",
    icon: BarChart,
  },
  {
    name: "AI-Powered Feedback",
    description:
      "Receive instant, personalized feedback on your quizzes and projects to continuously improve your skills.",
    icon: MessageSquare,
  },
]



export default function Home() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission

    try {
      // Here you can add your form submission logic
      console.log('Form submitted:', formData)

      // Optional: Clear form after submission
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your Journey from Zero to Hero
          </h1>
          <p className="mt-6 text-xl max-w-3xl text-white/90">
            Master new skills with our comprehensive roadmaps. Whether you're starting from scratch or leveling up,
            we've got you covered.
          </p>
          <div className="mt-10">
            <button className="bg-surface text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-surface/90 transition-colors">
              Get Started
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Info Section */}
      <div className="bg-background max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-primary sm:text-5xl">Our Roadmaps</h2>
        <p className="mt-4 text-xl text-secondary">
          Choose your path and start your journey to becoming a hero in your field.
        </p>
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <RoadmapCard title="Web Development" description="From HTML basics to full-stack mastery" icon="💻" />
          <RoadmapCard title="UI/UX Design" description="Create stunning and user-friendly interfaces" icon="🎨" />
          <RoadmapCard title="Data Science" description="Harness the power of data and machine learning" icon="📊" />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-surface border-y border-color">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary sm:text-5xl">Why Choose Zero to Hero?</h2>
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-xl font-semibold text-primary">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-surface">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-lg text-secondary">{feature.description}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>



      <div className="mt-20">
        <h3 className="text-2xl font-bold tracking-tight text-primary text-center">Your Path to Success</h3>
        <div className="mt-10 flex justify-center">
          <ol className="relative border-l border-color">
            {[
              "Sign up and set your learning preferences",
              "Explore your personalized dashboard",
              "Follow roadmaps and complete quizzes",
              "Work on real-world projects",
              "Engage with the community",
              "Track your progress and receive AI feedback",
            ].map((step, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-2 ring-white">
                  <span className="text-surface font-bold">{index + 1}</span>
                </span>
                <p className="text-base ml-4 font-normal text-secondary hover:text-primary transition-colors">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-surface border-y border-color">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div>
              <h2 className="text-4xl font-bold text-primary sm:text-5xl">Get in Touch</h2>
              <p className="mt-4 text-xl text-secondary">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-primary">Email</p>
                    <p className="text-secondary">support@zerotohero.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-primary">Location</p>
                    <p className="text-secondary">123 Learning Lane, Education City</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-primary">Office Hours</p>
                    <p className="text-secondary">Monday - Friday, 9AM - 6PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-background border border-color rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-primary font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-color bg-surface text-primary p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-primary font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-color bg-surface text-primary p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-primary font-medium mb-2">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-color bg-surface text-primary p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary text-surface px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            <span className="block">Ready to start your journey?</span>
            <span className="block text-white/90 mt-2">Join Zero to Hero today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-lg">
              <button className="bg-surface text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-surface/90 transition-colors">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RoadmapCard({ title, description, icon }) {
  return (
    <div className="bg-surface border border-color rounded-lg p-8 hover:border-primary transition-colors">
      <div className="text-4xl mb-6">
        <div className="inline-block p-3 bg-primary/10 rounded-lg">
          <span className="text-primary">{icon}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 text-primary">{title}</h3>
      <p className="text-lg text-secondary mb-6">{description}</p>
      <button className="w-full bg-primary text-surface px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
        View Roadmap
        <span className="ml-2">→</span>
      </button>
    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-surface border border-color rounded-lg p-8 hover:border-primary transition-colors">
      <h3 className="text-2xl font-bold mb-3 text-primary">{title}</h3>
      <p className="text-lg text-secondary">{description}</p>
    </div>
  )
}

