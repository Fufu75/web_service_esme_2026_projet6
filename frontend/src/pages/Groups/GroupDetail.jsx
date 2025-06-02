import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { groupService } from '../../services/api';
import { FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import '../../styles/Groups.css';

const GroupDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setLoading(true);
      try {
        const data = await groupService.getGroupById(id);
        setGroup(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement du groupe:', err);
        setError('Impossible de charger les détails du groupe. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleJoinGroup = async () => {
    try {
      await groupService.joinGroup(id);
      // Mettre à jour le groupe après l'avoir rejoint
      const updatedGroup = await groupService.getGroupById(id);
      setGroup(updatedGroup);
    } catch (err) {
      console.error('Erreur lors de la tentative de rejoindre le groupe:', err);
      setError('Impossible de rejoindre le groupe. Veuillez réessayer plus tard.');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await groupService.leaveGroup(id);
      // Mettre à jour le groupe après l'avoir quitté
      const updatedGroup = await groupService.getGroupById(id);
      setGroup(updatedGroup);
    } catch (err) {
      console.error('Erreur lors de la tentative de quitter le groupe:', err);
      setError('Impossible de quitter le groupe. Veuillez réessayer plus tard.');
    }
  };

  const handleDeleteGroup = async () => {
    if (confirmDelete) {
      try {
        await groupService.deleteGroup(id);
        navigate('/groups');
      } catch (err) {
        console.error('Erreur lors de la suppression du groupe:', err);
        setError('Impossible de supprimer le groupe. Veuillez réessayer plus tard.');
      }
    } else {
      setConfirmDelete(true);
      // Réinitialisation après 3 secondes si l'utilisateur ne confirme pas
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const isCreator = group && user && group.creator.id === user.id;
  const isMember = group && user && group.members.some(member => member.id === user.id);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <p>Chargement des détails du groupe...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!group) return <p>Groupe non trouvé.</p>;

  return (
    <div className="group-detail-container">
      <div className="group-detail-header">
        <div className="group-info">
          <h1>
            {group.name}
            <span className={`group-privacy-badge ${group.is_private ? 'private-group' : 'public-group'}`}>
              {group.is_private ? 'Privé' : 'Public'}
            </span>
          </h1>
          <p className="group-description">{group.description}</p>
          <p>Créé par {group.creator.username} le {formatDate(group.created_at)}</p>
        </div>
        
        <div className="group-actions">
          {!isCreator && !isMember && (
            <button 
              className="join-btn" 
              onClick={handleJoinGroup}
              disabled={group.is_private}
              title={group.is_private ? "Ce groupe est privé. Contactez le créateur pour y être ajouté." : ""}
            >
              Rejoindre
            </button>
          )}
          
          {!isCreator && isMember && (
            <button className="leave-btn" onClick={handleLeaveGroup}>
              Quitter
            </button>
          )}
          
          {isCreator && (
            <>
              <Link to={`/groups/${id}/edit`} className="edit-btn">
                <FaEdit style={{ marginRight: '0.3rem' }} /> Modifier
              </Link>
              <button className="delete-btn" onClick={handleDeleteGroup}>
                <FaTrash style={{ marginRight: '0.3rem' }} />
                {confirmDelete ? 'Confirmer' : 'Supprimer'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="group-detail-content">
        <div className="group-works">
          <h2 className="group-section-header">Œuvres du groupe</h2>
          {group.works.length === 0 ? (
            <p>Aucune œuvre dans ce groupe pour le moment.</p>
          ) : (
            <div className="works-list">
              {group.works.map(work => (
                <div key={work.id} className="work-card">
                  <Link to={`/literary-works/${work.id}`} className="work-title">
                    {work.title}
                  </Link>
                  <div className="work-meta">
                    <span>{work.type}</span>
                    <span className={`status-${work.status.toLowerCase()}`}>{work.status}</span>
                  </div>
                  <div className="work-author">
                    <span>Par {work.author.username}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="group-members">
          <h2 className="group-section-header">Membres ({group.members.length})</h2>
          <div className="members-list">
            {group.members.map(member => (
              <div key={member.id} className="member-item">
                <img 
                  src={member.profile_picture || '/default-avatar.png'} 
                  alt={member.username} 
                />
                <span className="member-name">{member.username}</span>
                {member.id === group.creator.id && (
                  <span className="group-creator-badge">Créateur</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail; 