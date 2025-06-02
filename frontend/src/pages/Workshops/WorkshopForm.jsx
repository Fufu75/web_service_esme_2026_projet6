import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { workshopService } from '../../services/api'
import '../../styles/Workshops.css'

const WorkshopForm = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    status: 'planning',
    start_date: '',
    end_date: ''
  })
  
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (isEditMode) {
        try {
          setLoading(true)
          const data = await workshopService.getWorkshopById(id)
          
          // Vérifier si l'utilisateur est le créateur
          if (data.creator.id !== user?.id) {
            setError('Vous n\'êtes pas autorisé à modifier cet atelier')
            setLoading(false)
            return
          }
          
          // Formater les dates pour l'input de type date
          const formatDateForInput = (dateString) => {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toISOString().split('T')[0]
          }
          
          setFormData({
            title: data.title,
            description: data.description,
            theme: data.theme,
            status: data.status,
            start_date: formatDateForInput(data.start_date),
            end_date: formatDateForInput(data.end_date)
          })
          
          setLoading(false)
        } catch (err) {
          setError('Erreur lors du chargement de l\'atelier')
          setLoading(false)
          console.error(err)
        }
      }
    }

    fetchWorkshop()
  }, [id, isEditMode, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Effacer l'erreur pour ce champ
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Le titre est requis'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'La description est requise'
    }
    
    if (!formData.theme.trim()) {
      errors.theme = 'Le thème est requis'
    }
    
    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      errors.end_date = 'La date de fin doit être postérieure à la date de début'
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
      
      if (isEditMode) {
        await workshopService.updateWorkshop(id, formData)
        navigate(`/workshops/${id}`)
      } else {
        const response = await workshopService.createWorkshop(formData)
        navigate(`/workshops/${response.workshop.id}`)
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'atelier')
      setSubmitting(false)
      console.error(err)
    }
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  return (
    <div className="workshop-form-page">
      <div className="page-header">
        <h1>{isEditMode ? 'Modifier l\'atelier' : 'Créer un nouvel atelier'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form className="workshop-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre de l'atelier"
            required
          />
          {formErrors.title && <div className="field-error">{formErrors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="theme">Thème *</label>
          <input
            type="text"
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            placeholder="Thème de l'atelier"
            required
          />
          {formErrors.theme && <div className="field-error">{formErrors.theme}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_date">Date de début</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">Date de fin</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
            {formErrors.end_date && <div className="field-error">{formErrors.end_date}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Statut *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="planning">En préparation</option>
            <option value="active">En cours</option>
            <option value="completed">Terminé</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description détaillée de l'atelier"
            rows="8"
            required
          />
          {formErrors.description && <div className="field-error">{formErrors.description}</div>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(isEditMode ? `/workshops/${id}` : '/workshops')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer l\'atelier'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WorkshopForm 