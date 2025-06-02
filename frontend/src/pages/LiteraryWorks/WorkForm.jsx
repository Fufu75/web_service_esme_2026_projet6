import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { literaryWorkService, workshopService, groupService } from '../../services/api'
import '../../styles/LiteraryWorks.css'

const WorkForm = ({ user, isEditMode = false }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'short-story',
    status: 'draft',
    workshop_id: queryParams.get('workshop_id') || '',
    group_id: queryParams.get('group_id') || '',
    book_id: ''  // Nouveau champ pour book_id
  })
  
  const [workshops, setWorkshops] = useState([])
  const [groups, setGroups] = useState([])
  const [publicationLimit, setPublicationLimit] = useState(null)  // Nouveau state pour la limite
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Vérifier la limite de publication (seulement en mode création)
        if (!isEditMode) {
          const limitData = await literaryWorkService.checkPublicationLimit()
          setPublicationLimit(limitData)
          
          if (!limitData.can_publish) {
            setError(`Vous avez atteint la limite de ${limitData.limit} publications par semaine. Vous pourrez publier à nouveau dans quelques jours.`)
          }
        }
        
        // Si en mode édition, récupérer les données de l'œuvre
        if (isEditMode && id) {
          const workData = await literaryWorkService.getWorkById(id)
          
          // Vérifier si l'utilisateur est l'auteur
          if (workData.author.id !== user?.id) {
            setError('Vous n\'êtes pas autorisé à modifier cette œuvre')
            setLoading(false)
            return
          }
          
          setFormData({
            title: workData.title,
            content: workData.content,
            type: workData.type,
            status: workData.status,
            workshop_id: workData.workshop?.id || '',
            group_id: workData.group?.id || '',
            book_id: workData.book?.id || ''
          })
        }
        
        // Récupérer les ateliers auxquels l'utilisateur participe
        const userWorkshops = await workshopService.getAllWorkshops({ participant_id: user.id })
        setWorkshops(userWorkshops)
        
        // Récupérer les groupes dont l'utilisateur est membre
        const userGroups = await groupService.getAllGroups({ member_id: user.id })
        setGroups(userGroups)
        
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des données')
        setLoading(false)
        console.error(err)
      }
    }
    
    if (user) {
      fetchData()
    }
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
    
    if (!formData.content.trim()) {
      errors.content = 'Le contenu est requis'
    }
    
    if (!formData.type) {
      errors.type = 'Le type d\'œuvre est requis'
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
      const workData = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        status: formData.status,
        workshop_id: formData.workshop_id || null,
        group_id: formData.group_id || null,
        book_id: formData.book_id || null
      }
      
      let response
      
      if (isEditMode) {
        response = await literaryWorkService.updateWork(id, workData)
        navigate(`/literary-works/${id}`)
      } else {
        response = await literaryWorkService.createWork(workData)
        navigate(`/literary-works/${response.work.id}`)
      }
      
      setSubmitting(false)
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'œuvre')
      setSubmitting(false)
      console.error(err)
    }
  }

  const handlePublish = () => {
    setFormData(prev => ({
      ...prev,
      status: 'published'
    }))
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  return (
    <div className="literary-work-form-page">
      <div className="page-header">
        <h1>{isEditMode ? 'Modifier une œuvre' : 'Publier une nouvelle œuvre'}</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="literary-work-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre de votre œuvre"
            required
          />
          {formErrors.title && <div className="field-error">{formErrors.title}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type d'œuvre *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="poem">Poème</option>
              <option value="novel">Roman</option>
              <option value="short-story">Nouvelle</option>
              <option value="essay">Essai</option>
              <option value="other">Autre</option>
            </select>
            {formErrors.type && <div className="field-error">{formErrors.type}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="workshop_id">Atelier d'écriture (optionnel)</label>
            <select
              id="workshop_id"
              name="workshop_id"
              value={formData.workshop_id}
              onChange={handleChange}
            >
              <option value="">Aucun</option>
              {workshops.map(workshop => (
                <option key={workshop.id} value={workshop.id}>
                  {workshop.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="group_id">Groupe (optionnel)</label>
            <select
              id="group_id"
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
            >
              <option value="">Aucun</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Contenu *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Écrivez votre texte ici..."
            rows="15"
            required
          />
          {formErrors.content && <div className="field-error">{formErrors.content}</div>}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(isEditMode ? `/literary-works/${id}` : '/literary-works')}
          >
            Annuler
          </button>
          
          {formData.status === 'draft' && (
            <button
              type="button"
              className="submit-button"
              onClick={handlePublish}
            >
              Publier
            </button>
          )}
          
          <button
            type="submit"
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WorkForm 