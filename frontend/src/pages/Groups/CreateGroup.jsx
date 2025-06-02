import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { groupService } from '../../services/api';
import '../../styles/Groups.css';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur pour ce champ s'il est modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du groupe est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Le nom ne doit pas dépasser 50 caractères';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description du groupe est requise';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await groupService.createGroup(formData);
      navigate('/groups');
    } catch (err) {
      console.error('Erreur lors de la création du groupe:', err);
      setError(err.error || 'Une erreur est survenue lors de la création du groupe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-form-container">
      <form className="group-form" onSubmit={handleSubmit}>
        <h1>Créer un nouveau groupe</h1>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="name">Nom du groupe*</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le but de votre groupe, les thèmes abordés, etc."
          />
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>
        
        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="is_private"
              name="is_private"
              checked={formData.is_private}
              onChange={handleChange}
            />
            <label htmlFor="is_private">Groupe privé (seuls les membres invités peuvent rejoindre)</label>
          </div>
        </div>
        
        <div className="form-footer">
          <Link to="/groups" className="form-cancel-btn">Annuler</Link>
          <button type="submit" className="form-submit-btn" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le groupe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup; 