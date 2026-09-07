import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function EmployeDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { authAxios } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await authAxios.get('/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">Chargement des notes de frais...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Mes notes de frais</h1>
        <p>Consultez et suivez vos demandes</p>
      </div>

      {expenses.length === 0 ? (
        <div className="card empty-state">
          <p>Aucune note de frais</p>
          <small>Creer votre premiere note de frais depuis le menu</small>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Statut</th>
                <th>Date de soumission</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} onClick={() => setSelectedExpense(expense)}>
                  <td><strong>{expense.title}</strong></td>
                  <td>{getStatusBadge(expense.status)}</td>
                  <td>{formatDate(expense.createdAt)}</td>
                  <td><strong>{formatAmount(expense.amount)}</strong></td>
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
                <span className="label">Statut</span>
                <span className="value">{getStatusBadge(selectedExpense.status)}</span>
              </div>
              <div className="profile-field">
                <span className="label">Montant</span>
                <span className="value">{formatAmount(selectedExpense.amount)}</span>
              </div>
              <div className="profile-field">
                <span className="label">Date de soumission</span>
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
    </div>
  );
}

export default EmployeDashboard;
