import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import Tickets from '@/pages/Tickets';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
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
            <Route path="users" element={<div className="p-6">用户管理页面开发中...</div>} />
            <Route path="roles" element={<div className="p-6">角色权限页面开发中...</div>} />
            <Route path="customers" element={<div className="p-6">客户管理页面开发中...</div>} />
            <Route path="projects" element={<Projects />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="reports" element={<div className="p-6">数据报表页面开发中...</div>} />
            <Route path="settings" element={<div className="p-6">系统设置页面开发中...</div>} />
            <Route path="profile" element={<div className="p-6">个人资料页面开发中...</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
