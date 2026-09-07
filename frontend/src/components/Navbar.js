import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = (role) => {
    switch (role) {
      case 'manager':
        return 'Manager';
      case 'comptable':
        return 'Comptable';
      default:
        return 'Employe';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>FINT1</h2>
        <p>Notes de Frais</p>
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Tableau de bord</span>
        </NavLink>

        <NavLink to="/nouvelle-note" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Nouvelle note</span>
        </NavLink>

        {(user.role === 'manager' || user.role === 'comptable') && (
          <NavLink to="/toutes-les-notes" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Toutes les notes</span>
          </NavLink>
        )}

        {user.role === 'manager' && (
          <NavLink to="/creation-comptes" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Creation de comptes</span>
          </NavLink>
        )}

        <NavLink to="/profil" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Mon profil</span>
        </NavLink>
      </div>

      <div className="navbar-footer">
        <div className="navbar-user">
          <strong>{user.email}</strong>
          <span className={`navbar-role role-${user.role}`}>{roleLabel(user.role)}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Deconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
