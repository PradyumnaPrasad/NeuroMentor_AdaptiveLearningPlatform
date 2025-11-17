import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { StudentProvider } from "@/contexts/StudentContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";
import SplashScreen from "./components/SplashScreen";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardSkeleton, TopicsSkeleton, QuizSkeleton, RewardsSkeleton, SettingsSkeleton } from "./components/SkeletonLoaders";

// Lazy load pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Topics = lazy(() => import("./pages/Topics"));
const ChapterQuizzes = lazy(() => import("./pages/ChapterQuizzes"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Rewards = lazy(() => import("./pages/Rewards"));
const SessionComplete = lazy(() => import("./pages/SessionComplete"));
const Profile = lazy(() => import("./pages/Profile"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <PageTransition><Landing /></PageTransition>
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <PageTransition><Login /></PageTransition>
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/topics/:subject" element={
          <Suspense fallback={<TopicsSkeleton />}>
            <ProtectedRoute>
              <PageTransition><Topics /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/chapter/:chapterId" element={
          <Suspense fallback={<QuizSkeleton />}>
            <ProtectedRoute>
              <PageTransition><ChapterQuizzes /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/quiz/:chapterId/:quizSetId" element={
          <Suspense fallback={<QuizSkeleton />}>
            <ProtectedRoute>
              <PageTransition><Quiz /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/rewards" element={
          <Suspense fallback={<RewardsSkeleton />}>
            <ProtectedRoute>
              <PageTransition><Rewards /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/session-complete" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <ProtectedRoute>
              <PageTransition><SessionComplete /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/profile" element={
          <Suspense fallback={<SettingsSkeleton />}>
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/settings" element={
          <Suspense fallback={<SettingsSkeleton />}>
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          </Suspense>
        } />
        <Route path="/teacher-dashboard" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <PageTransition><TeacherDashboard /></PageTransition>
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <PageTransition><NotFound /></PageTransition>
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if user has already seen splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StudentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              {showSplash ? (
                <SplashScreen key="splash" onComplete={handleSplashComplete} />
              ) : (
                <BrowserRouter key="app">
                  <AnimatedRoutes />
                </BrowserRouter>
              )}
            </AnimatePresence>
          </TooltipProvider>
        </StudentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
