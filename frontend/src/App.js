import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TaskDetail from './components/TaskDetail';
import { isTokenValid } from './services/auth';

function PrivateRoute({ children }) {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
