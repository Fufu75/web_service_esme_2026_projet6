import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/api'
import '../../styles/Profile.css'

const EditProfile = ({ user: currentUser, setUser: setCurrentUser }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
    profile_picture: '',
    password: '',
    password_confirm: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userData = await authService.getProfile()
        
        // Initialiser les champs du formulaire avec les données utilisateur
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          bio: userData.bio || '',
          profile_picture: userData.profile_picture || '',
          password: '',
          password_confirm: ''
        })
        
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des données utilisateur')
        setLoading(false)
        console.error(err)
      }
    }
    
    fetchUserData()
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Effacer l'erreur associée à ce champ
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Le nom d\'utilisateur est requis'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'L\'adresse email est requise'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'L\'adresse email n\'est pas valide'
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Les mots de passe ne correspondent pas'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setSubmitting(true)
      
      // Préparer les données à envoyer
      const updateData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        profile_picture: formData.profile_picture
      }
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        updateData.password = formData.password
      }
      
      // Mettre à jour le profil
      const response = await authService.updateProfile(updateData)
      
      // Mettre à jour l'utilisateur dans le contexte global
      if (setCurrentUser) {
        setCurrentUser(response.user)
      }
      
      // Rediriger vers la page de profil
      navigate('/profile')
    } catch (err) {
      if (err.error) {
        setError(err.error)
      } else {
        setError('Erreur lors de la mise à jour du profil')
      }
      setSubmitting(false)
      console.error(err)
    }
  }

  if (loading) {
    return <div className="loading-spinner">Chargement du profil...</div>
  }

  return (
    <div className="edit-profile-page">
      <div className="page-header">
        <h1>Modifier mon profil</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="avatar-upload">
          <div className="avatar-preview">
            {formData.profile_picture ? (
              <img src={formData.profile_picture} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                {formData.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="profile_picture">URL de la photo de profil</label>
            <input
              type="text"
              id="profile_picture"
              name="profile_picture"
              value={formData.profile_picture}
              onChange={handleChange}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">Prénom</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Votre prénom"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="last_name">Nom</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Votre nom"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
            required
          />
          {formErrors.username && <div className="field-error">{formErrors.username}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Adresse email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre.email@exemple.com"
            required
          />
          {formErrors.email && <div className="field-error">{formErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Biographie</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Parlez-nous de vous en quelques mots..."
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Laissez vide pour conserver le même"
            />
            {formErrors.password && <div className="field-error">{formErrors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password_confirm">Confirmer le mot de passe</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Confirmer le nouveau mot de passe"
            />
            {formErrors.password_confirm && (
              <div className="field-error">{formErrors.password_confirm}</div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/profile')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile 