import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateExpense() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { authAxios } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Le montant doit etre superieur a 0');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('amount', amount);
      formData.append('description', description.trim());

      files.forEach((file) => {
        formData.append('receipts', file);
      });

      await authAxios.post('/expenses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Nouvelle note de frais</h1>
        <p>Remplissez les informations de votre depense</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Deplacement client Paris"
              required
            />
          </div>

          <div className="form-group">
            <label>Montant (EUR) *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details de la depense..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Justificatifs (JPG, PNG, PDF — max 5 Mo chacun)</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                {files.length} fichier(s) selectionne(s)
              </small>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creation...' : 'Creer la note de frais'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExpense;
