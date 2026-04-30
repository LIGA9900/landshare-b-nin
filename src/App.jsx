// On importe le système de navigation React Router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// On importe toutes nos pages
import Landing        from './pages/Landing'
import Login          from './pages/auth/Login'
import Register       from './pages/auth/Register'
import Dashboard      from './pages/investor/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

// ─────────────────────────────────────────────────────
// Barre de navigation TEMPORAIRE (juste pour les tests)
// On va la supprimer quand on fera la vraie navbar
// ─────────────────────────────────────────────────────
function DevNav() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                    flex gap-2 flex-wrap justify-center
                    bg-white rounded-2xl shadow-2xl px-4 py-3 border border-gray-100">

      {/* Label */}
      <span className="text-xs font-bold text-gray-400 flex items-center mr-2">
        🧭 Navigation dev :
      </span>

      {/* Liens de test */}
      <Link to="/"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#0F2558' }}>
        🏠 Landing
      </Link>

      <Link to="/connexion"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#0B7A75' }}>
        🔐 Connexion
      </Link>

      <Link to="/inscription"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#0B7A75' }}>
        📝 Inscription
      </Link>

      <Link to="/dashboard"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#1A56A0' }}>
        📊 Dashboard
      </Link>

      <Link to="/admin"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#B91C1C' }}>
        ⚙️ Admin
      </Link>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// Composant principal — définit les routes de l'app
// ─────────────────────────────────────────────────────
function App() {
  return (
    // BrowserRouter active la navigation dans toute l'app
    <BrowserRouter>

      {/* Barre de nav temporaire pour les tests */}
      <DevNav />

      {/* Routes = "si l'URL est /X, affiche le composant Y" */}
      <Routes>
        <Route path="/"           element={<Landing />} />
        <Route path="/connexion"  element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/admin"      element={<AdminDashboard />} />

        {/* Page 404 — si l'URL n'existe pas */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-8xl mb-4">🏚️</p>
              <h1 className="text-4xl font-bold mb-2"
                  style={{ color: '#0F2558', fontFamily: 'Sora, sans-serif' }}>
                Page introuvable
              </h1>
              <p className="text-gray-500 mb-6">Cette page n'existe pas</p>
              <Link to="/"
                    className="px-6 py-3 rounded-xl text-white font-semibold"
                    style={{ backgroundColor: '#E07B00' }}>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        } />
      </Routes>

    </BrowserRouter>
  )
}

export default App