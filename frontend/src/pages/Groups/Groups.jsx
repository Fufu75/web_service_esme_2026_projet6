import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { groupService } from '../../services/api';
import '../../styles/Groups.css';
import { FaPlus, FaUsers, FaBook } from 'react-icons/fa';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    is_private: '',
    creator_id: '',
    member_id: ''
  });

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        // Filtrer les valeurs non vides
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        );
        
        const data = await groupService.getAllGroups(activeFilters);
        setGroups(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des groupes:', err);
        setError('Impossible de charger les groupes. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>Groupes littéraires</h1>
        <Link to="/groups/create" className="groups-create-btn">
          <FaPlus style={{ marginRight: '0.5rem' }} /> Créer un groupe
        </Link>
      </div>

      <div className="groups-filters">
        <div className="filter-item">
          <label htmlFor="is_private">Statut</label>
          <select
            id="is_private"
            name="is_private"
            className="filter-select"
            value={filters.is_private}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="false">Public</option>
            <option value="true">Privé</option>
          </select>
        </div>
        
        <div className="filter-item">
          <label htmlFor="creator_id">Mes groupes</label>
          <select
            id="creator_id"
            name="creator_id"
            className="filter-select"
            value={filters.creator_id}
            onChange={handleFilterChange}
          >
            <option value="">Tous les groupes</option>
            <option value={JSON.parse(localStorage.getItem('user')).id}>Mes créations</option>
          </select>
        </div>
        
        <div className="filter-item">
          <label htmlFor="member_id">Participation</label>
          <select
            id="member_id"
            name="member_id"
            className="filter-select"
            value={filters.member_id}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value={JSON.parse(localStorage.getItem('user')).id}>Mes participations</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Chargement des groupes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : groups.length === 0 ? (
        <p>Aucun groupe trouvé. Créez votre premier groupe !</p>
      ) : (
        <div className="groups-list">
          {groups.map(group => (
            <div key={group.id} className="group-card">
              <div className="group-card-header">
                <h3>
                  {group.name}
                  <span className={`group-privacy-badge ${group.is_private ? 'private-group' : 'public-group'}`}>
                    {group.is_private ? 'Privé' : 'Public'}
                  </span>
                </h3>
              </div>
              <div className="group-card-content">
                <p>{group.description && group.description.length > 100 
                  ? `${group.description.substring(0, 100)}...` 
                  : group.description}
                </p>
                
                <div className="group-card-creator">
                  <img 
                    src={group.creator.profile_picture || '/default-avatar.png'} 
                    alt={`${group.creator.username}`} 
                  />
                  <span>Créé par {group.creator.username} le {formatDate(group.created_at)}</span>
                </div>
                
                <div className="group-card-stats">
                  <span><FaUsers style={{ marginRight: '0.3rem' }} /> {group.members_count} membres</span>
                  <span><FaBook style={{ marginRight: '0.3rem' }} /> {group.works_count} œuvres</span>
                </div>
              </div>
              <div className="group-card-footer">
                <Link to={`/groups/${group.id}`} className="view-group-btn">
                  Voir le groupe
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups; 