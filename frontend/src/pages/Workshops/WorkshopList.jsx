import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { workshopService } from '../../services/api'
import '../../styles/Workshops.css'

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    theme: ''
  })

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        const data = await workshopService.getAllWorkshops(filters)
        setWorkshops(data)
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des ateliers')
        setLoading(false)
        console.error(err)
      }
    }

    fetchWorkshops()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'planning': return 'En préparation'
      case 'active': return 'En cours'
      case 'completed': return 'Terminé'
      default: return status
    }
  }

  return (
    <div className="workshops-page">
      <div className="workshops-header">
        <h1>Ateliers d'écriture</h1>
        <Link to="/workshops/create" className="create-button">Créer un atelier</Link>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status">Statut:</label>
          <select 
            id="status" 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="planning">En préparation</option>
            <option value="active">En cours</option>
            <option value="completed">Terminés</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="theme">Thème:</label>
          <input 
            type="text" 
            id="theme" 
            name="theme" 
            value={filters.theme} 
            onChange={handleFilterChange}
            placeholder="Filtrer par thème" 
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Chargement des ateliers...</div>
      ) : (
        <div className="workshops-grid">
          {workshops.length > 0 ? (
            workshops.map(workshop => (
              <div className="workshop-card" key={workshop.id}>
                <div className={`workshop-status ${workshop.status}`}>
                  {getStatusLabel(workshop.status)}
                </div>
                <h2 className="workshop-title">
                  <Link to={`/workshops/${workshop.id}`}>{workshop.title}</Link>
                </h2>
                <div className="workshop-theme">Thème : {workshop.theme}</div>
                <p className="workshop-description">
                  {workshop.description.length > 150 
                    ? `${workshop.description.substring(0, 150)}...` 
                    : workshop.description}
                </p>
                <div className="workshop-meta">
                  <span className="workshop-creator">
                    Animé par {workshop.creator.username}
                  </span>
                  <span className="workshop-participants">
                    {workshop.participants_count} participants
                  </span>
                </div>
                <div className="workshop-dates">
                  {workshop.start_date && (
                    <span>Début: {new Date(workshop.start_date).toLocaleDateString()}</span>
                  )}
                  {workshop.end_date && (
                    <span>Fin: {new Date(workshop.end_date).toLocaleDateString()}</span>
                  )}
                </div>
                <Link to={`/workshops/${workshop.id}`} className="view-button">
                  Voir les détails
                </Link>
              </div>
            ))
          ) : (
            <div className="no-data-message">
              Aucun atelier ne correspond à vos critères
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkshopList 