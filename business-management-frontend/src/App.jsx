import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Tickets from '@/pages/Tickets';
import Customers from '@/pages/Customers';
import ProjectsEnhanced from '@/pages/Projects_Enhanced';
import ProjectsDemo from '@/pages/ProjectsDemo';
import CustomersEnhanced from '@/pages/Customers_Enhanced';
import CustomersDemo from '@/pages/CustomersDemo';
import Users from '@/pages/Users';
import UsersEnhanced from '@/pages/Users_Enhanced';
import UsersDemo from '@/pages/UsersDemo';
import Roles from '@/pages/Roles';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<UsersDemo />} />
          <Route path="/customers-demo" element={<CustomersDemo />} />
          <Route path="/projects-demo" element={<ProjectsDemo />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users-enhanced" element={<UsersEnhanced />} />
            <Route path="roles" element={<Roles />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers-enhanced" element={<CustomersEnhanced />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
