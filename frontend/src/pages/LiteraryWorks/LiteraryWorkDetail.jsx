import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { literaryWorkService } from '../../services/api'
import '../../styles/LiteraryWorks.css'

const LiteraryWorkDetail = ({ user: currentUser }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentContent, setCommentContent] = useState('')
  const [commentRating, setCommentRating] = useState(0)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true)
        const data = await literaryWorkService.getWorkById(id)
        setWork(data)
        
        // Vérifier si l'utilisateur a déjà liké l'œuvre
        if (currentUser && data.likes) {
          const userLiked = data.likes.some(user => user.id === currentUser.id)
          setLiked(userLiked)
        }
        
        setLikesCount(data.likes_count || data.likes?.length || 0)
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement de l\'œuvre')
        setLoading(false)
        console.error(err)
      }
    }

    fetchWork()
  }, [id, currentUser])

  const handleLikeToggle = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/literary-works/${id}` } })
      return
    }
    
    try {
      setActionLoading(true)
      
      if (liked) {
        await literaryWorkService.unlikeWork(id)
        setLiked(false)
        setLikesCount(prev => prev - 1)
      } else {
        await literaryWorkService.likeWork(id)
        setLiked(true)
        setLikesCount(prev => prev + 1)
      }
      
      setActionLoading(false)
    } catch (err) {
      setError(liked ? 'Erreur lors du retrait du like' : 'Erreur lors de l\'ajout du like')
      setActionLoading(false)
      console.error(err)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!commentContent.trim()) {
      return
    }
    
    if (!currentUser) {
      navigate('/login', { state: { from: `/literary-works/${id}` } })
      return
    }
    
    try {
      setSubmittingComment(true)
      
      const commentData = {
        content: commentContent,
        rating: commentRating > 0 ? commentRating : null
      }
      
      const response = await literaryWorkService.addComment(id, commentData)
      
      // Mettre à jour l'œuvre avec le nouveau commentaire
      setWork(prev => ({
        ...prev,
        comments: [
          {
            id: response.comment.id,
            content: commentData.content,
            rating: commentData.rating,
            created_at: new Date().toISOString(),
            user: {
              id: currentUser.id,
              username: currentUser.username,
              profile_picture: currentUser.profile_picture
            }
          },
          ...prev.comments
        ],
        comments_count: (prev.comments_count || 0) + 1
      }))
      
      // Réinitialiser le formulaire
      setCommentContent('')
      setCommentRating(0)
      setSubmittingComment(false)
    } catch (err) {
      setError('Erreur lors de l\'ajout du commentaire')
      setSubmittingComment(false)
      console.error(err)
    }
  }

  const handleDeleteWork = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette œuvre ? Cette action est irréversible.')) {
      try {
        setActionLoading(true)
        await literaryWorkService.deleteWork(id)
        navigate('/literary-works')
      } catch (err) {
        setError('Erreur lors de la suppression de l\'œuvre')
        setActionLoading(false)
        console.error(err)
      }
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'poem': return 'Poème'
      case 'novel': return 'Roman'
      case 'short-story': return 'Nouvelle'
      case 'essay': return 'Essai'
      default: return type
    }
  }

  const renderStarRating = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className="star-icon"
        >
          {i <= rating ? '★' : '☆'}
        </span>
      )
    }
    return stars
  }

  if (loading) {
    return <div className="loading-spinner">Chargement de l'œuvre...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!work) {
    return <div className="not-found">Œuvre non trouvée</div>
  }

  const isAuthor = currentUser && work.author.id === currentUser.id

  return (
    <div className="literary-work-detail-page">
      <div className="work-detail-header">
        <div className={`work-type ${work.type}`}>
          {getTypeLabel(work.type)}
        </div>
        <h1>{work.title}</h1>
        <div className="work-meta">
          <div>
            Par <Link to={`/users/${work.author.id}`}>{work.author.username}</Link>
          </div>
          <div>
            Publié le {new Date(work.created_at).toLocaleDateString()}
          </div>
          {work.workshop && (
            <div>
              Atelier : <Link to={`/workshops/${work.workshop.id}`}>{work.workshop.title}</Link>
            </div>
          )}
          {work.group && (
            <div>
              Groupe : <Link to={`/groups/${work.group.id}`}>{work.group.name}</Link>
            </div>
          )}
          {work.book && (
            <div className="work-book">
              📚 Livre associé : <strong>{work.book.title}</strong> par {work.book.author}
            </div>
          )}
        </div>
        <div className="work-actions">
          <button 
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            disabled={actionLoading}
          >
            {liked ? '❤️' : '🤍'} {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </button>
          
          {isAuthor && (
            <div className="author-actions">
              <Link to={`/literary-works/${id}/edit`} className="btn btn-secondary">
                Modifier
              </Link>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteWork}
                disabled={actionLoading}
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="work-content">
        <pre>{work.content}</pre>
      </div>

      <div className="comments-section">
        <h3>Commentaires ({work.comments?.length || 0})</h3>
        
        {currentUser ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <div className="form-group">
              <label htmlFor="comment-content">Votre commentaire :</label>
            <textarea
                id="comment-content"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Partagez votre avis sur cette œuvre..."
                rows="4"
              required
            />
            </div>
            
            <div className="form-group">
              <label>Note (optionnelle) :</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= commentRating ? 'active' : ''}`}
                    onClick={() => setCommentRating(star === commentRating ? 0 : star)}
                  >
                    ★
                  </button>
                ))}
                {commentRating > 0 && (
                  <button
                    type="button"
                    className="clear-rating"
                    onClick={() => setCommentRating(0)}
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
            
              <button 
                type="submit" 
              className="btn btn-primary"
                disabled={submittingComment || !commentContent.trim()}
              >
              {submittingComment ? 'Envoi...' : 'Publier le commentaire'}
              </button>
          </form>
        ) : (
          <div className="login-prompt">
            <Link to="/login" state={{ from: `/literary-works/${id}` }}>
              Connectez-vous pour laisser un commentaire
            </Link>
          </div>
        )}
        
        <div className="comments-list">
          {work.comments && work.comments.length > 0 ? (
            work.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <div className="comment-author">
                    <img 
                      src={comment.user.profile_picture || '/default-avatar.png'} 
                      alt={comment.user.username}
                      className="author-avatar"
                    />
                    <span className="author-name">{comment.user.username}</span>
                  </div>
                  <div className="comment-meta">
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {comment.rating && (
                      <div className="comment-rating">
                        {renderStarRating(comment.rating)}
                        <span className="rating-text">({comment.rating}/5)</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="comment-content">
                  {comment.content}
                  </div>
              </div>
            ))
          ) : (
            <div className="no-comments">
              Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiteraryWorkDetail 