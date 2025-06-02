import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authService, userService, literaryWorkService } from '../../services/api'
import '../../styles/Profile.css'

const Profile = ({ user: currentUser, setUser }) => {
  const [profile, setProfile] = useState(null)
  const [activity, setActivity] = useState(null)
  const [publicationLimit, setPublicationLimit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer le profil
        const profileData = await authService.getProfile()
        setProfile(profileData)
        
        // Récupérer l'activité de l'utilisateur
        const activityData = await userService.getUserActivity(profileData.id)
        setActivity(activityData)
        
        // Récupérer la limite de publication
        const limitData = await literaryWorkService.checkPublicationLimit()
        setPublicationLimit(limitData)
        
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des données')
        setLoading(false)
        console.error(err)
      }
    }
    
    if (currentUser) {
    fetchData()
    }
  }, [currentUser])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTypeLabel = (type) => {
    const types = {
      'poem': 'Poème',
      'novel': 'Roman',
      'short-story': 'Nouvelle',
      'essay': 'Essai',
      'other': 'Autre'
    }
    return types[type] || type
  }

  const renderStarRating = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="star-icon">
          {i <= rating ? '★' : '☆'}
        </span>
      )
    }
    return stars
  }

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <img 
            src={profile?.profile_picture || '/default-avatar.png'} 
            alt={profile?.username}
            className="profile-avatar"
          />
          <div className="profile-details">
            <h1>{profile?.username}</h1>
            {profile?.first_name && profile?.last_name && (
              <p className="full-name">{profile.first_name} {profile.last_name}</p>
            )}
            {profile?.bio && (
              <p className="bio">{profile.bio}</p>
            )}
            <p className="member-since">
              Membre depuis {formatDate(profile?.created_at)}
            </p>
          </div>
        </div>
        
        <div className="profile-actions">
          <Link to="/profile/edit" className="btn btn-secondary">
            Modifier le profil
          </Link>
          <Link to="/literary-works/create" className="btn btn-primary">
            Publier une œuvre
          </Link>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="stats-overview">
        <div className="stat-card">
          <h3>{activity?.statistics?.total_publications || 0}</h3>
          <p>Publications</p>
        </div>
        <div className="stat-card">
          <h3>{activity?.statistics?.total_likes_received || 0}</h3>
          <p>Likes reçus</p>
        </div>
        <div className="stat-card">
          <h3>{activity?.statistics?.total_comments || 0}</h3>
          <p>Commentaires</p>
        </div>
        <div className="stat-card">
          <h3>{activity?.statistics?.total_likes_given || 0}</h3>
          <p>Likes donnés</p>
          </div>
          </div>

      {/* Limite de publication */}
      {publicationLimit && (
        <div className="publication-limit">
          <h3>Limite de publication</h3>
          <div className="limit-info">
            <p>
              Vous avez publié <strong>{publicationLimit.publications_this_week}</strong> œuvre(s) cette semaine.
            </p>
            <p>
              Il vous reste <strong>{publicationLimit.remaining_publications}</strong> publication(s) possible(s).
            </p>
            {!publicationLimit.can_publish && (
              <p className="limit-reached">
                ⚠️ Vous avez atteint la limite hebdomadaire de {publicationLimit.limit} publications.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button 
          className={`tab ${activeTab === 'publications' ? 'active' : ''}`}
          onClick={() => setActiveTab('publications')}
        >
          Mes publications
        </button>
        <button 
          className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Mes commentaires
        </button>
        <button 
          className={`tab ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          Mes likes
        </button>
      </div>
      
      {/* Contenu des onglets */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="recent-activity">
              <h3>Activité récente</h3>
              
              {/* Publications récentes */}
              {activity?.publications?.slice(0, 3).length > 0 && (
                <div className="activity-section">
                  <h4>Publications récentes</h4>
                  <div className="activity-list">
                    {activity.publications.slice(0, 3).map(work => (
                      <div key={work.id} className="activity-item">
                        <Link to={`/literary-works/${work.id}`} className="activity-link">
                          <strong>{work.title}</strong>
                          <span className="activity-meta">
                            {getTypeLabel(work.type)} • {formatDate(work.created_at)}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commentaires récents */}
              {activity?.comments?.slice(0, 3).length > 0 && (
                <div className="activity-section">
                  <h4>Commentaires récents</h4>
                  <div className="activity-list">
                    {activity.comments.slice(0, 3).map(comment => (
                      <div key={comment.id} className="activity-item">
                        <div className="comment-preview">
                          <p>"{comment.content.substring(0, 100)}..."</p>
                          <span className="activity-meta">
                            Sur <Link to={`/literary-works/${comment.literary_work.id}`}>
                              {comment.literary_work.title}
                            </Link> • {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'publications' && (
          <div className="publications-tab">
            <div className="tab-header">
              <h3>Mes publications ({activity?.publications?.length || 0})</h3>
              <Link to="/literary-works/create" className="btn btn-primary">
                Nouvelle publication
            </Link>
          </div>
          
            <div className="works-grid">
              {activity?.publications?.length > 0 ? (
                activity.publications.map(work => (
                  <div key={work.id} className="work-card">
                    <div className="work-header">
                      <h4>
                        <Link to={`/literary-works/${work.id}`}>
                          {work.title}
                        </Link>
                      </h4>
                      <span className="work-type">{getTypeLabel(work.type)}</span>
                    </div>
                    
                  <div className="work-meta">
                      <span className="work-date">{formatDate(work.created_at)}</span>
                      <span className="work-status">{work.status}</span>
                    </div>

                    <div className="work-stats">
                      <span>❤️ {work.likes_count}</span>
                      <span>💬 {work.comments_count}</span>
                    </div>

                    <div className="work-actions">
                      <Link to={`/literary-works/${work.id}/edit`} className="btn btn-sm btn-secondary">
                        Modifier
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>Vous n'avez pas encore publié d'œuvre.</p>
                  <Link to="/literary-works/create" className="btn btn-primary">
                    Publier votre première œuvre
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-tab">
            <h3>Mes commentaires ({activity?.comments?.length || 0})</h3>
            
            <div className="comments-list">
              {activity?.comments?.length > 0 ? (
                activity.comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <Link to={`/literary-works/${comment.literary_work.id}`} className="work-title">
                        {comment.literary_work.title}
            </Link>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    
                    <div className="comment-content">
                      {comment.content}
          </div>
          
                    {comment.rating && (
                      <div className="comment-rating">
                        {renderStarRating(comment.rating)}
                        <span>({comment.rating}/5)</span>
                      </div>
                    )}
                    
                    <div className="comment-meta">
                      <span>Sur l'œuvre de {comment.literary_work.author}</span>
                  </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>Vous n'avez pas encore laissé de commentaire.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="likes-tab">
            <h3>Œuvres que j'ai aimées ({activity?.liked_works?.length || 0})</h3>
            
            <div className="works-grid">
              {activity?.liked_works?.length > 0 ? (
                activity.liked_works.map(work => (
                  <div key={work.id} className="work-card">
                    <div className="work-header">
                      <h4>
                        <Link to={`/literary-works/${work.id}`}>
                          {work.title}
            </Link>
                      </h4>
                      <span className="work-type">{getTypeLabel(work.type)}</span>
                    </div>
                    
                    <div className="work-author">
                      <span>par {work.author}</span>
          </div>
          
                    <div className="work-stats">
                      <span>❤️ {work.likes_count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>Vous n'avez pas encore aimé d'œuvre.</p>
                  <Link to="/literary-works" className="btn btn-primary">
                    Explorer les œuvres
                  </Link>
                </div>
              )}
            </div>
          </div>
          )}
      </div>
    </div>
  )
}

export default Profile 