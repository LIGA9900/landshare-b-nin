// On importe le système de navigation React Router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// On importe toutes nos pages
import Landing        from './pages/Landing'
import Login          from './pages/auth/Login'
import Register       from './pages/auth/Register'
import Dashboard      from './pages/investor/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import TerrainDetail  from './pages/investor/TerrainDetail'
import Payment from './pages/investor/Payment'
import PaymentSuccess from './pages/investor/PaymentSuccess'

// ─────────────────────────────────────────────────────
// Barre de navigation temporaire pour les tests
// ─────────────────────────────────────────────────────
function DevNav() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                    flex gap-2 flex-wrap justify-center
                    bg-white rounded-2xl shadow-2xl px-4 py-3
                    border border-gray-100">

      <span className="text-xs font-bold text-gray-400 flex items-center mr-2">
        🧭 Navigation dev :
      </span>

      <Link to="/"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                       text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#1E3A2F' }}>
        🏠 Landing
      </Link>

      <Link to="/connexion"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                       text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#2D5241' }}>
        🔐 Connexion
      </Link>

      <Link to="/inscription"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                       text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#2D5241' }}>
        📝 Inscription
      </Link>

      <Link to="/dashboard"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                       text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#1E3A2F' }}>
        📊 Dashboard
      </Link>

      {/* ✅ CORRIGÉ — même style que les autres boutons */}
      <Link to="/terrains/1"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                       text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#B8972A' }}>
        🏡 Terrain
      </Link>

      <Link to="/admin"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                       text-white transition-all hover:opacity-80"
            style={{ backgroundColor: '#B91C1C' }}>
        ⚙️ Admin
      </Link>
      <Link to="/paiement"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                 text-white transition-all hover:opacity-80"
             style={{ backgroundColor: '#635BFF' }}>
         💳 Paiement
      </Link>
      <Link to="/paiement/succes"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold
                 text-white transition-all hover:opacity-80"
             style={{ backgroundColor: '#27AE60' }}>
         ✅ Succès
      </Link>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <Routes>
        <Route path="/"             element={<Landing />}        />
        <Route path="/connexion"    element={<Login />}          />
        <Route path="/inscription"  element={<Register />}       />
        <Route path="/dashboard"    element={<Dashboard />}      />
        <Route path="/admin"        element={<AdminDashboard />} />
        <Route path="/terrains/:id" element={<TerrainDetail />}  />
        <Route path="/paiement" element={<Payment />} />
        <Route path="/paiement/succes" element={<PaymentSuccess />} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center
                          justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-8xl mb-4">🏚️</p>
              <h1 className="text-4xl font-bold mb-2"
                  style={{ color: '#1E3A2F',
                           fontFamily: 'Playfair Display, serif' }}>
                Page introuvable
              </h1>
              <p className="text-gray-500 mb-6">
                Cette page n'existe pas
              </p>
              <Link to="/"
                    className="px-6 py-3 rounded-xl
                               text-white font-semibold"
                    style={{ backgroundColor: '#B8972A' }}>
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