import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEmail, setFilterEmail] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [refuseModal, setRefuseModal] = useState(null);
  const [refuseComment, setRefuseComment] = useState('');
  const [error, setError] = useState('');

  const { user, authAxios } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await authAxios.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      await authAxios.put(`/expenses/${id}/validate`);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la validation');
    }
  };

  const handleRefuse = async () => {
    if (!refuseComment.trim()) {
      setError('Le commentaire est obligatoire pour refuser');
      return;
    }

    try {
      await authAxios.put(`/expenses/${refuseModal._id}/refuse`, {
        comment: refuseComment.trim(),
      });
      setRefuseModal(null);
      setRefuseComment('');
      setError('');
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du refus');
    }
  };

  const handleProcess = async (id) => {
    try {
      await authAxios.put(`/expenses/${id}/process`);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du traitement');
    }
  };

  const getStatusBadge = (status) => {
    const labels = {
      creee: 'Creee',
      validee: 'Validee',
      refusee: 'Refusee',
      traitee: 'Traitee',
    };
    return <span className={`badge badge-${status}`}>{labels[status]}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    // Comptable only sees 'validee'
    if (user.role === 'comptable' && expense.status !== 'validee') {
      return false;
    }

    // Status filter
    if (filterStatus !== 'all' && expense.status !== filterStatus) {
      return false;
    }

    // Email filter
    if (filterEmail && expense.user?.email && !expense.user.email.toLowerCase().includes(filterEmail.toLowerCase())) {
      return false;
    }

    return true;
  });

  if (loading) {
    return <div className="loading">Chargement des notes de frais...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>{user.role === 'manager' ? 'Toutes les notes de frais' : 'Notes a traiter'}</h1>
        <p>
          {user.role === 'manager'
            ? 'Validez ou refusez les demandes de vos employes'
            : 'Traitez les notes de frais validees'}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div className="filter-bar">
        {user.role === 'manager' && (
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="creee">Creee</option>
            <option value="validee">Validee</option>
            <option value="refusee">Refusee</option>
            <option value="traitee">Traitee</option>
          </select>
        )}
        <input
          type="text"
          placeholder="Rechercher par email..."
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="card empty-state">
          <p>Aucune note de frais a afficher</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Employe</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedExpense(expense)}>
                  <td>
                    <strong>{expense.title}</strong>
                  </td>
                  <td>{expense.user?.email || 'N/A'}</td>
                  <td>{getStatusBadge(expense.status)}</td>
                  <td>{formatDate(expense.createdAt)}</td>
                  <td><strong>{formatAmount(expense.amount)}</strong></td>
                  <td>
                    {user.role === 'manager' && expense.status === 'creee' && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleValidate(expense._id)}
                        >
                          Valider
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setRefuseModal(expense)}
                        >
                          Refuser
                        </button>
                      </div>
                    )}
                    {user.role === 'comptable' && expense.status === 'validee' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleProcess(expense._id)}
                      >
                        Traiter
                      </button>
                    )}
                    {expense.status === 'refusee' && expense.comment && (
                      <span style={{ color: '#dc2626', fontSize: '12px' }}>Refusee</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selectedExpense && (
        <div className="modal-overlay" onClick={() => setSelectedExpense(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedExpense.title}</h2>
            <div className="profile-card" style={{ maxWidth: '100%' }}>
              <div className="profile-field">
                <span className="label">Employe</span>
                <span className="value">{selectedExpense.user?.email}</span>
              </div>
              <div className="profile-field">
                <span className="label">Statut</span>
                <span className="value">{getStatusBadge(selectedExpense.status)}</span>
              </div>
              <div className="profile-field">
                <span className="label">Montant</span>
                <span className="value">{formatAmount(selectedExpense.amount)}</span>
              </div>
              <div className="profile-field">
                <span className="label">Date</span>
                <span className="value">{formatDate(selectedExpense.createdAt)}</span>
              </div>
              <div className="profile-field">
                <span className="label">Description</span>
                <span className="value">{selectedExpense.description || 'Aucune description'}</span>
              </div>
              {selectedExpense.receipts && selectedExpense.receipts.length > 0 && (
                <div className="profile-field">
                  <span className="label">Justificatifs ({selectedExpense.receipts.length})</span>
                  <div className="value">
                    <div className="receipts-list">
                      {selectedExpense.receipts.map((receipt, idx) => {
                        const isImage = /\.(jpg|jpeg|png)$/i.test(receipt.path);
                        const fileUrl = `http://localhost:5000/uploads/${receipt.path}`;
                        return (
                          <div key={idx} className="receipt-item">
                            {isImage ? (
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <img src={fileUrl} alt={receipt.filename} className="receipt-thumb" />
                              </a>
                            ) : (
                              <div className="receipt-pdf-icon">PDF</div>
                            )}
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="receipt-link"
                            >
                              {receipt.filename}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {selectedExpense.comment && (
                <div className="profile-field">
                  <span className="label">Commentaire</span>
                  <span className="value">{selectedExpense.comment}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedExpense(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refuse modal */}
      {refuseModal && (
        <div className="modal-overlay" onClick={() => { setRefuseModal(null); setRefuseComment(''); setError(''); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Refuser la note de frais</h2>
            <p style={{ marginBottom: '12px', color: '#6b7280' }}>
              Note: <strong>{refuseModal.title}</strong> — {formatAmount(refuseModal.amount)}
            </p>

            <div className="form-group">
              <label>Commentaire (obligatoire) *</label>
              <textarea
                value={refuseComment}
                onChange={(e) => setRefuseComment(e.target.value)}
                placeholder="Expliquez la raison du refus..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => { setRefuseModal(null); setRefuseComment(''); setError(''); }}
              >
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleRefuse}>
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllExpenses;
