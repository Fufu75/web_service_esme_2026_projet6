import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/MainLayout.css';

const MainLayout = ({ children, isAuthenticated, user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="logo">
          <Link to="/">Réseau Littéraire</Link>
        </div>
        {isAuthenticated ? (
          <nav className="main-nav">
            <ul>
              <li className={isActive('/')}>
                <Link to="/">Accueil</Link>
              </li>
              <li className={isActive('/literary-works')}>
                <Link to="/literary-works">Œuvres</Link>
              </li>
              <li className={isActive('/workshops')}>
                <Link to="/workshops">Ateliers</Link>
              </li>
              <li className={isActive('/groups')}>
                <Link to="/groups">Groupes</Link>
              </li>
            </ul>
          </nav>
        ) : null}
        <div className="user-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <span>{user.username}</span>
                <div className="dropdown">
                  <Link to="/profile" className={isActive('/profile')}>Mon Profil</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin">Administration</Link>
                  )}
                  <button onClick={onLogout}>Se déconnecter</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Connexion</Link>
              <Link to="/register" className="register-btn">Inscription</Link>
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} Réseau Littéraire pour Ateliers d'Écriture</p>
      </footer>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired
};

export default MainLayout; 