import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { workshopService, literaryWorkService } from '../../services/api'
import '../../styles/Workshops.css'

const WorkshopDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workshop, setWorkshop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isParticipant, setIsParticipant] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true)
        const data = await workshopService.getWorkshopById(id)
        setWorkshop(data)
        
        // Vérifier si l'utilisateur est participant
        const isUserParticipant = data.participants.some(p => p.id === user?.id)
        setIsParticipant(isUserParticipant)
        
        // Vérifier si l'utilisateur est le créateur
        setIsCreator(data.creator.id === user?.id)
        
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement de l\'atelier')
        setLoading(false)
        console.error(err)
      }
    }

    fetchWorkshop()
  }, [id, user])

  const handleJoinWorkshop = async () => {
    try {
      setActionLoading(true)
      await workshopService.joinWorkshop(id)
      // Mettre à jour l'état local
      setIsParticipant(true)
      setWorkshop(prev => ({
        ...prev,
        participants: [...prev.participants, {
          id: user.id,
          username: user.username,
          profile_picture: user.profile_picture
        }]
      }))
      setActionLoading(false)
    } catch (err) {
      setError('Erreur lors de la participation à l\'atelier')
      setActionLoading(false)
      console.error(err)
    }
  }

  const handleLeaveWorkshop = async () => {
    try {
      setActionLoading(true)
      await workshopService.leaveWorkshop(id)
      // Mettre à jour l'état local
      setIsParticipant(false)
      setWorkshop(prev => ({
        ...prev,
        participants: prev.participants.filter(p => p.id !== user.id)
      }))
      setActionLoading(false)
    } catch (err) {
      setError('Erreur lors du départ de l\'atelier')
      setActionLoading(false)
      console.error(err)
    }
  }

  const handleDeleteWorkshop = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet atelier ? Cette action est irréversible.')) {
      try {
        setActionLoading(true)
        await workshopService.deleteWorkshop(id)
        navigate('/workshops')
      } catch (err) {
        setError('Erreur lors de la suppression de l\'atelier')
        setActionLoading(false)
        console.error(err)
      }
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'planning': return 'En préparation'
      case 'active': return 'En cours'
      case 'completed': return 'Terminé'
      default: return status
    }
  }

  if (loading) {
    return <div className="loading-spinner">Chargement de l'atelier...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!workshop) {
    return <div className="not-found">Atelier non trouvé</div>
  }

  return (
    <div className="workshop-detail-page">
      <div className="workshop-detail-header">
        <div className={`workshop-status ${workshop.status}`}>
          {getStatusLabel(workshop.status)}
        </div>
        <h1>{workshop.title}</h1>
        <div className="workshop-meta">
          <span>Créé par {workshop.creator.username}</span>
          <span>Thème : {workshop.theme}</span>
          {workshop.start_date && (
            <span>Début : {new Date(workshop.start_date).toLocaleDateString()}</span>
          )}
          {workshop.end_date && (
            <span>Fin : {new Date(workshop.end_date).toLocaleDateString()}</span>
          )}
        </div>
        <div className="workshop-actions">
          {isCreator ? (
            <>
              <Link to={`/workshops/${id}/edit`} className="edit-button">
                Modifier l'atelier
              </Link>
              <button 
                className="delete-button" 
                onClick={handleDeleteWorkshop}
                disabled={actionLoading}
              >
                Supprimer l'atelier
              </button>
            </>
          ) : isParticipant ? (
            <button 
              className="leave-button" 
              onClick={handleLeaveWorkshop}
              disabled={actionLoading}
            >
              Quitter l'atelier
            </button>
          ) : (
            <button 
              className="join-button" 
              onClick={handleJoinWorkshop}
              disabled={actionLoading || workshop.status === 'completed'}
            >
              Rejoindre l'atelier
            </button>
          )}
          {isParticipant && (
            <Link 
              to={`/literary-works/create?workshop_id=${id}`} 
              className="submit-work-button"
            >
              Soumettre une œuvre
            </Link>
          )}
        </div>
      </div>

      <div className="workshop-description-section">
        <h2>Description</h2>
        <p>{workshop.description}</p>
      </div>

      <div className="workshop-participants-section">
        <h2>Participants ({workshop.participants.length})</h2>
        <div className="participants-grid">
          {workshop.participants.map(participant => (
            <div className="participant-card" key={participant.id}>
              <div className="participant-avatar">
                {participant.profile_picture ? (
                  <img src={participant.profile_picture} alt={participant.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {participant.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <Link to={`/users/${participant.id}`}>
                {participant.username}
              </Link>
              {participant.id === workshop.creator.id && (
                <span className="creator-badge">Animateur</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="workshop-works-section">
        <h2>Œuvres soumises ({workshop.works.length})</h2>
        {workshop.works.length > 0 ? (
          <div className="works-grid">
            {workshop.works.map(work => (
              <div className="work-card" key={work.id}>
                <div className="work-type">{work.type}</div>
                <h3 className="work-title">
                  <Link to={`/literary-works/${work.id}`}>{work.title}</Link>
                </h3>
                <div className="work-author">
                  <span>Par {work.author.username}</span>
                </div>
                <div className="work-meta">
                  <span>{new Date(work.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data-message">
            Aucune œuvre n'a encore été soumise pour cet atelier.
            {isParticipant && " Soyez le premier à soumettre quelque chose !"}
          </p>
        )}
      </div>
    </div>
  )
}

export default WorkshopDetail 