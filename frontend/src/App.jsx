import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
// Pages
import Home from "./pages/Home"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import Profile from "./pages/Profile/Profile"
import EditProfile from "./pages/Profile/EditProfile"
import LiteraryWorks from "./pages/LiteraryWorks/LiteraryWorks"
import LiteraryWorkDetail from "./pages/LiteraryWorks/LiteraryWorkDetail"
import CreateLiteraryWork from "./pages/LiteraryWorks/CreateLiteraryWork"
import EditLiteraryWork from "./pages/LiteraryWorks/EditLiteraryWork"
import Workshops from "./pages/Workshops/Workshops"
import WorkshopDetail from "./pages/Workshops/WorkshopDetail"
import CreateWorkshop from "./pages/Workshops/CreateWorkshop"
import EditWorkshop from "./pages/Workshops/EditWorkshop"
import Groups from "./pages/Groups/Groups"
import GroupDetail from "./pages/Groups/GroupDetail"
import CreateGroup from "./pages/Groups/CreateGroup"
import EditGroup from "./pages/Groups/EditGroup"
// Layouts et composants
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/Auth/ProtectedRoute"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement de l'application
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
        } />

        {/* Routes protégées (nécessitant une authentification) */}
        <Route path="/" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          </MainLayout>
        } />

        {/* Profil utilisateur */}
        <Route path="/profile" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/profile/edit" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditProfile user={user} setUser={setUser} />
            </ProtectedRoute>
          </MainLayout>
        } />

        {/* Œuvres littéraires */}
        <Route path="/literary-works" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LiteraryWorks />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/literary-works/:id" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LiteraryWorkDetail user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/literary-works/create" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateLiteraryWork user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/literary-works/:id/edit" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditLiteraryWork user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />

        {/* Ateliers d'écriture */}
        <Route path="/workshops" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Workshops />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/workshops/:id" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WorkshopDetail user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/workshops/create" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateWorkshop user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/workshops/:id/edit" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditWorkshop user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />

        {/* Groupes */}
        <Route path="/groups" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Groups />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/groups/:id" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GroupDetail user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/groups/create" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateGroup user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
        <Route path="/groups/:id/edit" element={
          <MainLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout}>
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditGroup user={user} />
            </ProtectedRoute>
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
