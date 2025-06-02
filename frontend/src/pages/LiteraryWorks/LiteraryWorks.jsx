import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { literaryWorkService } from '../../services/api'
import '../../styles/LiteraryWorks.css'

const LiteraryWorks = ({ user }) => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cache, setCache] = useState({}) // Cache pour éviter les requêtes répétées
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    type: '',
    sort_by: 'recent',
    status: 'published'
  })

  // Debouncing pour éviter trop de requêtes
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300) // Attendre 300ms avant d'appliquer les filtres

    return () => clearTimeout(timer)
  }, [filters])

  // Clé de cache basée sur les filtres
  const cacheKey = useMemo(() => {
    return JSON.stringify(debouncedFilters)
  }, [debouncedFilters])

  useEffect(() => {
    fetchWorks()
  }, [debouncedFilters, cacheKey])

  const fetchWorks = useCallback(async () => {
    // Vérifier le cache d'abord
    if (cache[cacheKey]) {
      setWorks(cache[cacheKey])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await literaryWorkService.getAllWorks(debouncedFilters)
      setWorks(data)
      
      // Mettre en cache les résultats
      setCache(prev => ({
        ...prev,
        [cacheKey]: data
      }))
      
      setLoading(false)
    } catch (err) {
      setError('Erreur lors du chargement des œuvres')
      setLoading(false)
      console.error(err)
    }
  }, [debouncedFilters, cacheKey, cache])

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }, [])

  const handleLike = useCallback(async (workId) => {
    try {
      await literaryWorkService.likeWork(workId)
      // Mettre à jour le state local et le cache
      const updateWorks = (works) => works.map(work => 
        work.id === workId 
          ? { ...work, likes_count: work.likes_count + 1, is_liked: true }
          : work
      )
      
      setWorks(updateWorks)
      
      // Mettre à jour le cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: updateWorks(prev[cacheKey] || [])
      }))
    } catch (err) {
      console.error('Erreur lors du like:', err)
    }
  }, [cacheKey])

  const handleUnlike = useCallback(async (workId) => {
    try {
      await literaryWorkService.unlikeWork(workId)
      // Mettre à jour le state local et le cache
      const updateWorks = (works) => works.map(work => 
        work.id === workId 
          ? { ...work, likes_count: work.likes_count - 1, is_liked: false }
          : work
      )
      
      setWorks(updateWorks)
      
      // Mettre à jour le cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: updateWorks(prev[cacheKey] || [])
      }))
    } catch (err) {
      console.error('Erreur lors du unlike:', err)
    }
  }, [cacheKey])

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const getTypeLabel = useCallback((type) => {
    const types = {
      'poem': 'Poème',
      'novel': 'Roman',
      'short-story': 'Nouvelle',
      'essay': 'Essai',
      'other': 'Autre'
    }
    return types[type] || type
  }, [])

  // Composant WorkCard mémorisé pour éviter les re-renders inutiles
  const WorkCard = useMemo(() => ({ work }) => (
    <div className="work-card">
      <div className="work-header">
        <h3>
          <Link to={`/literary-works/${work.id}`}>
            {work.title}
          </Link>
        </h3>
        <span className="work-type">{getTypeLabel(work.type)}</span>
      </div>
      
      <div className="work-author">
        <img 
          src={work.author.profile_picture || '/default-avatar.png'} 
          alt={work.author.username}
          className="author-avatar"
          loading="lazy" // Lazy loading des images
        />
        <span>par {work.author.username}</span>
      </div>

      <div className="work-meta">
        <span className="work-date">{formatDate(work.created_at)}</span>
        {work.book && (
          <span className="work-book">
            📚 {work.book.title}
          </span>
        )}
      </div>

      <div className="work-stats">
        <div className="stat">
          <button 
            className="like-btn"
            onClick={() => work.is_liked ? handleUnlike(work.id) : handleLike(work.id)}
          >
            ❤️ {work.likes_count}
          </button>
        </div>
        <div className="stat">
          💬 {work.comments_count}
        </div>
      </div>
    </div>
  ), [getTypeLabel, formatDate, handleLike, handleUnlike])

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  return (
    <div className="literary-works-page">
      <div className="page-header">
        <h1>Explorer les œuvres</h1>
        <Link to="/literary-works/create" className="btn btn-primary">
          Publier une œuvre
        </Link>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Genre :</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Tous les genres</option>
              <option value="poem">Poèmes</option>
              <option value="novel">Romans</option>
              <option value="short-story">Nouvelles</option>
              <option value="essay">Essais</option>
              <option value="other">Autres</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Trier par :</label>
            <select 
              value={filters.sort_by} 
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            >
              <option value="recent">Plus récents</option>
              <option value="popularity">Popularité</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Liste des œuvres */}
      <div className="works-grid">
        {works.length === 0 ? (
          <div className="no-works">
            <p>Aucune œuvre trouvée avec ces filtres.</p>
          </div>
        ) : (
          works.map(work => (
            <WorkCard key={work.id} work={work} />
          ))
        )}
      </div>
    </div>
  )
}

export default LiteraryWorks 