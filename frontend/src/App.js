import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import EmployeDashboard from './pages/EmployeDashboard';
import CreateExpense from './pages/CreateExpense';
import AllExpenses from './pages/AllExpenses';
import Profil from './pages/Profil';
import CreationComptes from './pages/CreationComptes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <EmployeDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/nouvelle-note"
                element={
                  <PrivateRoute>
                    <CreateExpense />
                  </PrivateRoute>
                }
              />
              <Route
                path="/toutes-les-notes"
                element={
                  <PrivateRoute>
                    <AllExpenses />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profil"
                element={
                  <PrivateRoute>
                    <Profil />
                  </PrivateRoute>
                }
              />
              <Route
                path="/creation-comptes"
                element={
                  <PrivateRoute>
                    <CreationComptes />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
