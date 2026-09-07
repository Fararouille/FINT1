import React from 'react';
import { useAuth } from '../context/AuthContext';

function Profil() {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  const roleLabel = (role) => {
    switch (role) {
      case 'manager':
        return 'Manager';
      case 'comptable':
        return 'Comptable';
      case 'employe':
        return 'Employe';
      default:
        return role;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Mon profil</h1>
        <p>Informations de votre compte</p>
      </div>

      <div className="card profile-card">
        <div className="profile-field">
          <span className="label">Adresse email</span>
          <span className="value">{user.email}</span>
        </div>

        <div className="profile-field">
          <span className="label">Role</span>
          <span className="value">
            <span className={`navbar-role role-${user.role}`} style={{ fontSize: '13px' }}>
              {roleLabel(user.role)}
            </span>
          </span>
        </div>

        <div className="profile-field">
          <span className="label">Date de creation du compte</span>
          <span className="value">{formatDate(user.createdAt)}</span>
        </div>

        <div className="profile-field">
          <span className="label">Premiere connexion</span>
          <span className="value">{user.isFirstLogin ? 'Oui' : 'Non'}</span>
        </div>
      </div>
    </div>
  );
}

export default Profil;
