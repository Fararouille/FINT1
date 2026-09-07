import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function CreationComptes() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employe');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { authAxios } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await authAxios.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('L\'email est requis');
      return;
    }

    if (!password || password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }

    try {
      await authAxios.post('/users', { email: email.trim(), role, password });
      setSuccess('Compte cree avec succes!');
      setEmail('');
      setPassword('');
      setRole('employe');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la creation du compte');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Etes-vous sur de vouloir supprimer cet utilisateur?')) {
      return;
    }

    try {
      await authAxios.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Creation de comptes</h1>
        <p>Gerez les comptes utilisateurs de l'entreprise</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px', color: '#1e3a5f' }}>
          Creer un nouveau compte
        </h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nouvel/utilisateur@supherman.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caracteres"
              required
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="employe">Employe</option>
              <option value="manager">Manager</option>
              <option value="comptable">Comptabilite</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Creer le compte
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '16px', marginBottom: '16px', color: '#1e3a5f' }}>
          Utilisateurs existants ({users.length})
        </h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Cree le</th>
                <th>1ere connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.email}</strong></td>
                  <td>
                    <span className={`navbar-role role-${u.role}`} style={{ fontSize: '12px' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{u.isFirstLogin ? 'En attente' : 'Effectuee'}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreationComptes;
