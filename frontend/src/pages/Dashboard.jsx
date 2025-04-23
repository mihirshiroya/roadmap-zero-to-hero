import React, { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
  Bars3Icon,
  ChartPieIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import Header from '../components/Header'
import {  Menu, X, ChevronLeft, ChevronRight, Compass, Home } from 'lucide-react'
import { UserButton, useUser } from '@clerk/clerk-react';
import MetricCard from '../components/MetricCard';
import { useLocation, Link,Outlet } from "react-router-dom"

const navigation = [
  { name: "Overview", href: "/overview", icon: HomeIcon },
  { name: "Roadmaps", href: "/roadmaps", icon: FolderIcon },
  { name: "Quizzes", href: "/quizzes", icon: ClipboardDocumentCheckIcon },
  { name: "Projects", href: "/projects", icon: RocketLaunchIcon },
  { name: "Analytics", href: "/analytics", icon: ChartPieIcon },
  { name: "FAQs", href: "/faqs", icon: QuestionMarkCircleIcon },
]



function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useUser();
  const location = useLocation()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Function to check if a route is active
  const isActiveRoute = (href) => {
    if (location.pathname === '/' && href === '/overview') return true
    return location.pathname.startsWith(href)
  }

  // Function to handle mobile menu item click
  const handleMobileMenuClick = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      <div className="bg-background min-h-screen">
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-background/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background border-r border-color px-6 pb-4">
                    {/* Mobile Go Back Button */}
                    <div className="pt-6 border-b border-color pb-4 mb-2">
                      <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Home className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          Go Back to Landing Page
                        </span>
                      </Link>
                    </div>

                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  onClick={handleMobileMenuClick}
                                  className={classNames(
                                    isActiveRoute(item.href)
                                      ? "bg-primary text-white"
                                      : "text-secondary hover:text-primary hover:bg-surface/80",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-secondary hover:text-primary"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop Sidebar - Updated without logo */}
        <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} transition-all duration-300`}>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background border-r border-color px-6 pb-4">
            {/* Go Back Button */}
            <div className="pt-6 border-b border-color pb-4 mb-2">
              <Link
                to="/"
                className={`flex items-center justify-center gap-2 ${
                  isCollapsed ? 'px-2' : 'px-4'
                } py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors`}
              >
                <Home className="h-5 w-5 text-primary" />
                {!isCollapsed && (
                  <span className="text-sm font-medium text-primary">
                    Go Back to Landing Page
                  </span>
                )}
              </Link>
            </div>

            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            isActiveRoute(item.href)
                              ? "bg-primary text-white"
                              : "text-secondary hover:text-primary hover:bg-surface/80",
                            "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                            isCollapsed && "justify-center"
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
          {/* Collapse Button - Adjusted position */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-4 top-4 hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-background border border-color text-secondary hover:text-primary"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className={`${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'} transition-all duration-300`}>
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-40 bg-surface border-b border-color">
            <div className="flex h-16 items-center">
              {/* Mobile Menu Button */}
              <button
                type="button"
                className="lg:hidden p-2.5 text-secondary hover:text-primary"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Header */}
              <div className="w-full">
                <Header />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}