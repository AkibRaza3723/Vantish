import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute, OnboardingRoute, PublicRoute } from './components/RouteGuards';
import Layout from './components/Layout';
import Home from './pages/Home';
import Network from './pages/Network';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Guest/Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signin" 
              element={
                <PublicRoute>
                  <Signin />
                </PublicRoute>
              } 
            />

            {/* Onboarding Flow Route */}
            <Route 
              path="/onboarding" 
              element={
                <OnboardingRoute>
                  <Onboarding />
                </OnboardingRoute>
              } 
            />

            {/* Authenticated Routes with Shell Layout */}
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <Layout><Home /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/network" 
              element={
                <ProtectedRoute>
                  <Layout><Network /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Layout><Notifications /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } 
            />

            {/* Fallback to Feed (if logged in) or Landing */}
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
