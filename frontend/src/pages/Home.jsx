import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import { Link } from 'react-router-dom'
import { literaryWorkService, workshopService, groupService } from '../services/api'
import '../styles/Home.css'

const Home = () => {
  const [recentWorks, setRecentWorks] = useState([])
  const [activeWorkshops, setActiveWorkshops] = useState([])
  const [featuredGroups, setFeaturedGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les œuvres récentes (limitées à 4)
        const works = await literaryWorkService.getAllWorks({ status: 'published' })
        setRecentWorks(works.slice(0, 4))
        
        // Récupérer les ateliers actifs (limités à 3)
        const workshops = await workshopService.getAllWorkshops({ status: 'active' })
        setActiveWorkshops(workshops.slice(0, 3))
        
        // Récupérer les groupes (limités à 3)
        const groups = await groupService.getAllGroups({ is_private: false })
        setFeaturedGroups(groups.slice(0, 3))
        
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des données')
        setLoading(false)
        console.error(err)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenue sur le Réseau Littéraire</h1>
          <p>Un espace pour partager, collaborer et grandir en tant qu'écrivain</p>
          <div className="hero-buttons">
            <Link to="/literary-works/create" className="primary-button">Publier une œuvre</Link>
            <Link to="/workshops" className="secondary-button">Rejoindre un atelier</Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Chargement...</div>
      ) : (
        <>
          <section className="home-section">
            <div className="section-header">
              <h2>Dernières Œuvres Publiées</h2>
              <Link to="/literary-works" className="see-all-link">Voir toutes les œuvres</Link>
            </div>
            <div className="works-grid">
              {recentWorks.length > 0 ? (
                recentWorks.map(work => (
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
                      <span>{work.likes_count} ❤️</span>
                      <span>{work.comments_count} 💬</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">Aucune œuvre publiée pour le moment</p>
              )}
            </div>
          </section>

          <section className="home-section">
            <div className="section-header">
              <h2>Ateliers d'Écriture Actifs</h2>
              <Link to="/workshops" className="see-all-link">Voir tous les ateliers</Link>
            </div>
            <div className="workshops-grid">
              {activeWorkshops.length > 0 ? (
                activeWorkshops.map(workshop => (
                  <div className="workshop-card" key={workshop.id}>
                    <h3 className="workshop-title">
                      <Link to={`/workshops/${workshop.id}`}>{workshop.title}</Link>
                    </h3>
                    <div className="workshop-theme">Thème : {workshop.theme}</div>
                    <p className="workshop-description">{workshop.description.substring(0, 100)}...</p>
                    <div className="workshop-meta">
                      <span>Animé par {workshop.creator.username}</span>
                      <span>{workshop.participants_count} participants</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">Aucun atelier actif pour le moment</p>
              )}
            </div>
          </section>

          <section className="home-section">
            <div className="section-header">
              <h2>Groupes Littéraires</h2>
              <Link to="/groups" className="see-all-link">Voir tous les groupes</Link>
            </div>
            <div className="groups-grid">
              {featuredGroups.length > 0 ? (
                featuredGroups.map(group => (
                  <div className="group-card" key={group.id}>
                    <h3 className="group-title">
                      <Link to={`/groups/${group.id}`}>{group.name}</Link>
                    </h3>
                    <p className="group-description">{group.description.substring(0, 100)}...</p>
                    <div className="group-meta">
                      <span>{group.members_count} membres</span>
                      <span>{group.works_count} œuvres</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">Aucun groupe créé pour le moment</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Home
