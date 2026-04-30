// ═══════════════════════════════════════════════════════════════════
// AdminDashboard.jsx — Backoffice Administrateur · LandShare Bénin
// Design System : identique Dashboard investisseur + Landing
// Palette : Crème #F5F0E8 · Vert forêt #1E3A2F · Or #B8972A
// Polices : Playfair Display (titres) · DM Sans (corps)
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// ─── Google Fonts (même hook que Dashboard.jsx) ──────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])
}

// ─── Hook compteur animé (identique Dashboard.jsx) ───────────────
function useCountUp(target, duration = 1800, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, trigger])
  return val
}

// ─── Hook InView ─────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

// ═══════════════════════════════════════════════════════════════════
// DONNÉES SIMULÉES
// ═══════════════════════════════════════════════════════════════════
const revenueData = [
  { month: 'Nov', revenue: 1250000, transactions: 14 },
  { month: 'Déc', revenue: 1890000, transactions: 22 },
  { month: 'Jan', revenue: 1540000, transactions: 18 },
  { month: 'Fév', revenue: 2100000, transactions: 27 },
  { month: 'Mar', revenue: 1780000, transactions: 21 },
  { month: 'Avr', revenue: 2450000, transactions: 31 },
  { month: 'Mai', revenue: 2890000, transactions: 38 },
  { month: 'Jun', revenue: 2640000, transactions: 35 },
  { month: 'Jul', revenue: 3210000, transactions: 42 },
  { month: 'Aoû', revenue: 2980000, transactions: 39 },
  { month: 'Sep', revenue: 3650000, transactions: 48 },
  { month: 'Oct', revenue: 4120000, transactions: 54 },
]

const pendingKYC = [
  { id: 'KYC-0091', name: 'Mariama Diallo',    country: '🇫🇷 France',    submitted: 'Il y a 2h',   doc: 'Passeport' },
  { id: 'KYC-0090', name: 'Ibrahim Touré',     country: '🇨🇦 Canada',    submitted: 'Il y a 5h',   doc: 'CNI' },
  { id: 'KYC-0089', name: 'Fatoumata Bah',     country: '🇧🇪 Belgique',  submitted: 'Il y a 8h',   doc: 'Passeport' },
  { id: 'KYC-0088', name: 'Serge Ahoménou',    country: '🇧🇯 Bénin',     submitted: 'Il y a 1j',   doc: 'CNI' },
  { id: 'KYC-0087', name: 'Aminata Kouyaté',   country: '🇺🇸 USA',       submitted: 'Il y a 1j',   doc: 'Passeport' },
]

const recentTransactions = [
  { id: 'LS-0054', user: 'Aisha Koné',       terrain: 'Calavi Nord',    sqm: 10, amount: 154500,  status: 'confirmed', method: 'MTN MoMo',   date: '28 Oct 2025' },
  { id: 'LS-0053', user: 'Romaric Hounsou',  terrain: 'Fidjrossè',      sqm: 5,  amount: 77250,   status: 'confirmed', method: 'Stripe',      date: '27 Oct 2025' },
  { id: 'LS-0052', user: 'Aïcha Traoré',     terrain: 'Porto-Novo Est', sqm: 3,  amount: 46500,   status: 'pending',   method: 'MTN MoMo',   date: '27 Oct 2025' },
  { id: 'LS-0051', user: 'Kevin Agossa',     terrain: 'Parakou Nord',   sqm: 8,  amount: 68000,   status: 'confirmed', method: 'Moov Money', date: '26 Oct 2025' },
  { id: 'LS-0050', user: 'Sylvie Dossou',    terrain: 'Calavi Nord',    sqm: 15, amount: 231750,  status: 'failed',    method: 'Stripe',      date: '26 Oct 2025' },
  { id: 'LS-0049', user: 'Jean-Paul Koudjo', terrain: 'Fidjrossè',      sqm: 20, amount: 309000,  status: 'confirmed', method: 'Paystack',   date: '25 Oct 2025' },
]

const terrains = [
  { id: 'TRN-001', name: 'Calavi Nord – Lot 12',     city: 'Abomey-Calavi', status: 'disponible',   totalSqm: 1000, soldSqm: 680, pricePerSqm: 15450, progress: 68,  docs: 3 },
  { id: 'TRN-002', name: 'Fidjrossè Balnéaire',       city: 'Cotonou',       status: 'en_cours',     totalSqm: 500,  soldSqm: 455, pricePerSqm: 15450, progress: 91,  docs: 4 },
  { id: 'TRN-003', name: 'Porto-Novo Est – Zone Com.', city: 'Porto-Novo',   status: 'disponible',   totalSqm: 1500, soldSqm: 420, pricePerSqm: 15500, progress: 28,  docs: 2 },
  { id: 'TRN-004', name: 'Parakou Nord – Lot B',      city: 'Parakou',       status: 'brouillon',    totalSqm: 800,  soldSqm: 0,   pricePerSqm: 8500,  progress: 0,   docs: 1 },
  { id: 'TRN-005', name: 'Ouidah Historique',         city: 'Ouidah',        status: 'complet',      totalSqm: 600,  soldSqm: 600, pricePerSqm: 18900, progress: 100, docs: 5 },
]

const recentUsers = [
  { id: 'USR-0241', name: 'Mariama Diallo',   email: 'mariama@gmail.com',   country: '🇫🇷', kyc: 'en_attente', joined: '28 Oct 2025', investments: 0 },
  { id: 'USR-0240', name: 'Aisha Koné',       email: 'aisha.k@yahoo.fr',    country: '🇧🇯', kyc: 'valide',     joined: '15 Sep 2025', investments: 4 },
  { id: 'USR-0239', name: 'Romaric Hounsou',  email: 'romaric.h@gmail.com', country: '🇧🇯', kyc: 'valide',     joined: '10 Sep 2025', investments: 2 },
  { id: 'USR-0238', name: 'Ibrahim Touré',    email: 'ib.toure@outlook.com',country: '🇨🇦', kyc: 'en_attente', joined: '05 Sep 2025', investments: 0 },
  { id: 'USR-0237', name: 'Sylvie Dossou',    email: 'sylvie.d@gmail.com',  country: '🇧🇯', kyc: 'rejete',     joined: '01 Sep 2025', investments: 1 },
]

const alerts = [
  { id: 1, type: 'warning', icon: '⏳', text: '5 dossiers KYC en attente de validation', time: 'Maintenant', link: 'KYC' },
  { id: 2, type: 'error',   icon: '❌', text: 'Transaction LS-0050 échouée — intervention requise', time: 'Il y a 2h', link: 'transactions' },
  { id: 3, type: 'info',    icon: '📋', text: 'Terrain TRN-004 en attente de vérification documentaire', time: 'Il y a 4h', link: 'terrains' },
  { id: 4, type: 'success', icon: '✅', text: 'Terrain Ouidah Historique a atteint 100% de financement', time: 'Il y a 6h', link: 'terrains' },
]

// ═══════════════════════════════════════════════════════════════════
// ICÔNES SVG (même style que Dashboard.jsx)
// ═══════════════════════════════════════════════════════════════════
const Icon = ({ d, size = 20, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  grid:    () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  users:   () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  map:     () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  credit:  () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  shield:  () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  bar:     () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  bell:    () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  logout:  () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  check:   () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  eye:     () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  plus:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  refresh: () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  filter:  () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  down:    () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
const fmt = n => n >= 1000000
  ? (n / 1000000).toFixed(1).replace('.0', '') + 'M F'
  : n >= 1000 ? (n / 1000).toFixed(0) + 'k F'
  : n + ' F'

const statusConfig = {
  confirmed:  { label: 'Confirmé',  bg: 'rgba(30,58,47,0.1)',   color: '#1E3A2F', dot: '#2D5241' },
  pending:    { label: 'En attente',bg: 'rgba(184,151,42,0.1)', color: '#8B6D14', dot: '#B8972A' },
  failed:     { label: 'Échoué',    bg: 'rgba(220,53,69,0.09)', color: '#B02A37', dot: '#DC3545' },
  disponible: { label: 'Disponible',bg: 'rgba(30,58,47,0.1)',   color: '#1E3A2F', dot: '#2D5241' },
  en_cours:   { label: 'En cours',  bg: 'rgba(184,151,42,0.1)', color: '#8B6D14', dot: '#B8972A' },
  brouillon:  { label: 'Brouillon', bg: 'rgba(140,130,120,0.1)',color: '#6B5B4E', dot: '#9A8880' },
  complet:    { label: 'Complet',   bg: 'rgba(45,82,65,0.15)',  color: '#1E3A2F', dot: '#2D5241' },
  valide:     { label: 'Validé',    bg: 'rgba(30,58,47,0.1)',   color: '#1E3A2F', dot: '#2D5241' },
  en_attente: { label: 'En attente',bg: 'rgba(184,151,42,0.1)', color: '#8B6D14', dot: '#B8972A' },
  rejete:     { label: 'Rejeté',    bg: 'rgba(220,53,69,0.09)', color: '#B02A37', dot: '#DC3545' },
}

function StatusBadge({ status }) {
  const c = statusConfig[status] || { label: status, bg: 'rgba(0,0,0,0.05)', color: '#555', dot: '#888' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 50,
      background: c.bg, color: c.color,
      fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.02em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Logo (identique Dashboard.jsx)
// ═══════════════════════════════════════════════════════════════════
function Logo({ collapsed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 32, height: 32, background: '#1E3A2F', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{ width: 13, height: 13, background: '#B8972A', clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
      </div>
      {!collapsed && (
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#F5F0E8', whiteSpace: 'nowrap' }}>
          Land<span style={{ color: '#B8972A' }}>Share</span>
          <span style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.7rem', fontWeight: 400, marginLeft: 6, letterSpacing: '0.05em' }}>ADMIN</span>
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Sidebar Admin
// ═══════════════════════════════════════════════════════════════════
const navItems = [
  { id: 'dashboard',     label: 'Tableau de bord',  Icon: icons.grid,   badge: null },
  { id: 'users',         label: 'Utilisateurs',      Icon: icons.users,  badge: '241' },
  { id: 'terrains',      label: 'Terrains',          Icon: icons.map,    badge: '1' },
  { id: 'transactions',  label: 'Transactions',      Icon: icons.credit, badge: '1' },
  { id: 'kyc',           label: 'Validation KYC',    Icon: icons.shield, badge: '5' },
  { id: 'statistiques',  label: 'Statistiques',      Icon: icons.bar,    badge: null },
]

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const hoverStyle = (isActive) => ({
    width: '100%', display: 'flex', alignItems: 'center',
    gap: collapsed ? 0 : 10,
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? '11px 0' : '11px 14px',
    borderRadius: 10, border: 'none', cursor: 'pointer',
    background: isActive ? 'rgba(184,151,42,0.15)' : 'transparent',
    color: isActive ? '#D4AD3A' : 'rgba(245,240,232,0.55)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
    transition: 'all 0.2s',
    marginBottom: 2,
    position: 'relative',
  })

  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      background: '#111810',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
      flexShrink: 0, overflow: 'hidden',
      position: 'relative', zIndex: 10,
      borderRight: '1px solid rgba(245,240,232,0.04)',
    }}>
      {/* Logo row */}
      <div style={{
        padding: collapsed ? '22px 20px' : '22px 20px',
        borderBottom: '1px solid rgba(245,240,232,0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        <Logo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)',
            borderRadius: 8, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(245,240,232,0.4)',
            transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,232,0.12)'; e.currentTarget.style.color = '#F5F0E8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,240,232,0.06)'; e.currentTarget.style.color = 'rgba(245,240,232,0.4)' }}
        >
          <span style={{ fontSize: '0.85rem' }}>{collapsed ? '→' : '←'}</span>
        </button>
      </div>

      {/* Rôle badge */}
      {!collapsed && (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(184,151,42,0.12)', border: '1px solid rgba(184,151,42,0.2)',
            borderRadius: 50, padding: '3px 10px',
            fontSize: '0.7rem', fontWeight: 700, color: '#D4AD3A',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B8972A' }} />
            Administrateur
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflow: 'hidden' }}>
        {!collapsed && (
          <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.25)', textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '4px 14px 8px', fontWeight: 600 }}>
            Navigation
          </p>
        )}
        {navItems.map(({ id, label, Icon, badge }) => {
          const isActive = active === id
          return (
            <button
              key={id} onClick={() => setActive(id)} title={collapsed ? label : ''}
              style={hoverStyle(isActive)}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(245,240,232,0.06)'; e.currentTarget.style.color = '#F5F0E8' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(245,240,232,0.55)' } }}
            >
              {/* Active bar */}
              {isActive && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#B8972A', borderRadius: '0 2px 2px 0' }} />}
              <span style={{ flexShrink: 0, display: 'flex' }}><Icon /></span>
              {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>}
              {!collapsed && badge && (
                <span style={{
                  background: isActive ? '#B8972A' : 'rgba(245,240,232,0.1)',
                  color: isActive ? '#111810' : 'rgba(245,240,232,0.6)',
                  fontSize: '0.68rem', fontWeight: 700,
                  padding: '1px 7px', borderRadius: 10, minWidth: 20, textAlign: 'center',
                }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Admin profile */}
      <div style={{
        padding: collapsed ? '16px 10px' : '16px 20px',
        borderTop: '1px solid rgba(245,240,232,0.06)',
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#B8972A',
              border: '2px solid rgba(184,151,42,0.3)',
            }}>
              AD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#F5F0E8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Admin Principal
              </p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)' }}>admin@landshare.bj</p>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.3)', padding: 4, transition: 'color 0.2s' }}
              title="Déconnexion"
              onMouseEnter={e => e.currentTarget.style.color = '#DC3545'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.3)'}
            >
              {icons.logout()}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#B8972A',
            }}>AD</div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Topbar Admin
// ═══════════════════════════════════════════════════════════════════
function Topbar({ active, notifOpen, setNotifOpen }) {
  const pageTitles = {
    dashboard:    'Tableau de bord',
    users:        'Gestion des utilisateurs',
    terrains:     'Gestion des terrains',
    transactions: 'Transactions',
    kyc:          'Validation KYC',
    statistiques: 'Statistiques & Rapports',
  }

  return (
    <header style={{
      height: 64, background: '#FDFAF5',
      borderBottom: '1px solid rgba(30,58,47,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
    }}>
      <div>
        <h1 style={{
          margin: 0, fontFamily: "'Playfair Display', serif",
          fontSize: '1.15rem', fontWeight: 700, color: '#1A1A1A',
        }}>
          {pageTitles[active]}
        </h1>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#8C8278' }}>
          Lundi 28 Octobre 2025 · Backoffice LandShare Bénin
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            placeholder="Rechercher…"
            style={{
              background: 'rgba(30,58,47,0.05)', border: '1px solid rgba(30,58,47,0.1)',
              borderRadius: 50, padding: '8px 16px 8px 38px',
              fontSize: '0.82rem', color: '#1A1A1A', outline: 'none',
              fontFamily: "'DM Sans', sans-serif", width: 200,
            }}
          />
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#8C8278', fontSize: '0.9rem' }}>🔍</span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => { e.stopPropagation(); setNotifOpen(!notifOpen) }}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifOpen ? 'rgba(184,151,42,0.1)' : 'rgba(30,58,47,0.05)',
              border: '1px solid rgba(30,58,47,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#4A4033', position: 'relative', transition: 'all 0.2s',
            }}
          >
            {icons.bell()}
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: '#DC3545', border: '1.5px solid #FDFAF5',
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: 46, right: 0, zIndex: 200,
              background: '#FFF', borderRadius: 14, width: 340,
              boxShadow: '0 8px 40px rgba(30,58,47,0.15), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(30,58,47,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(30,58,47,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.95rem', color: '#1A1A1A' }}>Alertes</span>
                <span style={{ fontSize: '0.72rem', color: '#B8972A', fontWeight: 600, cursor: 'pointer' }}>Tout marquer lu</span>
              </div>
              {alerts.map(a => (
                <div key={a.id} style={{
                  padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'flex-start',
                  borderBottom: '1px solid rgba(30,58,47,0.04)', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#1A1A1A', lineHeight: 1.45 }}>{a.text}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.7rem', color: '#B0A99F' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick action */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 50,
          background: '#1E3A2F', color: '#F5F0E8', border: 'none',
          fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#2D5241'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.transform = 'none' }}>
          {icons.plus()}
          Nouveau terrain
        </button>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : KPI Widget Admin (style unifié Dashboard.jsx)
// ═══════════════════════════════════════════════════════════════════
function AdminKpi({ label, rawValue, displayValue, sub, icon, delta, color, bg, index }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: '#FFF', borderRadius: 14,
      border: '1px solid rgba(30,58,47,0.08)',
      padding: '20px 22px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(14px)',
      transition: `opacity 0.5s ${index * 0.08}s, transform 0.5s ${index * 0.08}s`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#8C8278', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <div style={{ width: 34, height: 34, background: bg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
          {icon}
        </div>
      </div>
      <p style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 700, color: color, lineHeight: 1 }}>
        {displayValue}
      </p>
      <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>{sub}</p>
      {delta !== null && (
        <p style={{ margin: '10px 0 0', fontSize: '0.75rem', fontWeight: 600, color: delta >= 0 ? '#1E3A2F' : '#DC3545', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span>{delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%</span>
          <span style={{ color: '#B0A99F', fontWeight: 400 }}>vs mois dernier</span>
        </p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Graphique Revenus
// ═══════════════════════════════════════════════════════════════════
function RevenueChart() {
  const [ref, inView] = useInView()
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: '#FFF', border: '1px solid rgba(30,58,47,0.1)', borderRadius: 10, padding: '10px 16px', boxShadow: '0 4px 16px rgba(30,58,47,0.1)' }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#8C8278', fontWeight: 600 }}>{label}</p>
        <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1E3A2F' }}>
          {payload[0]?.value?.toLocaleString('fr-FR')} FCFA
        </p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#B8972A', fontWeight: 600 }}>
          {payload[1]?.value} transactions
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} style={{
      background: '#FFF', borderRadius: 14, border: '1px solid rgba(30,58,47,0.08)',
      padding: '22px 24px',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(14px)',
      transition: 'opacity 0.6s 0.2s, transform 0.6s 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A' }}>
            Revenus & Transactions
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#8C8278' }}>12 derniers mois · FCFA</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['#1E3A2F', 'Revenus'], ['#B8972A', 'Transactions']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#6B6459' }}>
              <span style={{ width: 10, height: 3, background: c, borderRadius: 2 }} />
              {l}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E3A2F" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B8972A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#B8972A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,47,0.06)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#B0A99F', fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#B0A99F' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? v / 1000000 + 'M' : v >= 1000 ? v / 1000 + 'k' : v} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#1E3A2F" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#1E3A2F' }} />
          <Area type="monotone" dataKey="transactions" stroke="#B8972A" strokeWidth={1.5} fill="url(#txGrad)" dot={false} activeDot={{ r: 4, fill: '#B8972A' }} yAxisId="right" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Section KYC
// ═══════════════════════════════════════════════════════════════════
function KycQueue({ setActive }) {
  const [items, setItems] = useState(pendingKYC)
  const [decisions, setDecisions] = useState({})

  const decide = (id, action) => {
    setDecisions(d => ({ ...d, [id]: action }))
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 800)
  }

  return (
    <div style={{ background: '#FFF', borderRadius: 14, border: '1px solid rgba(30,58,47,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(30,58,47,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>
            File KYC en attente
          </p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>{items.length} dossier{items.length > 1 ? 's' : ''} à traiter</p>
        </div>
        <button onClick={() => setActive('kyc')} style={{
          background: 'rgba(184,151,42,0.08)', border: '1px solid rgba(184,151,42,0.2)',
          borderRadius: 50, padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600,
          color: '#8B6D14', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          Voir tout →
        </button>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '36px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>✅</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>File vide !</p>
          <p style={{ fontSize: '0.8rem', color: '#8C8278', margin: 0 }}>Tous les dossiers KYC ont été traités.</p>
        </div>
      ) : items.map((k, i) => (
        <div key={k.id} style={{
          padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: i < items.length - 1 ? '1px solid rgba(30,58,47,0.04)' : 'none',
          opacity: decisions[k.id] ? 0 : 1,
          transform: decisions[k.id] ? 'translateX(20px)' : 'none',
          transition: 'opacity 0.4s, transform 0.4s',
        }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: `hsl(${(k.name.charCodeAt(0) * 37) % 360},30%,88%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: '#1E3A2F',
          }}>
            {k.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.name}</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>{k.country} · {k.doc} · {k.submitted}</p>
          </div>
          <span style={{ fontSize: '0.7rem', background: 'rgba(30,58,47,0.06)', color: '#4A4033', borderRadius: 6, padding: '2px 8px', flexShrink: 0 }}>{k.id}</span>
          {/* Actions */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button title="Voir le document"
              style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(30,58,47,0.05)', border: '1px solid rgba(30,58,47,0.1)', cursor: 'pointer', color: '#4A4033', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,58,47,0.05)'}
            >{icons.eye()}</button>
            <button title="Valider" onClick={() => decide(k.id, 'accept')}
              style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.12)', cursor: 'pointer', color: '#1E3A2F', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.color = '#F5F0E8' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,58,47,0.06)'; e.currentTarget.style.color = '#1E3A2F' }}
            >{icons.check()}</button>
            <button title="Rejeter" onClick={() => decide(k.id, 'reject')}
              style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(220,53,69,0.05)', border: '1px solid rgba(220,53,69,0.12)', cursor: 'pointer', color: '#DC3545', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#DC3545'; e.currentTarget.style.color = '#FFF' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.05)'; e.currentTarget.style.color = '#DC3545' }}
            >{icons.x()}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Tableau Transactions
// ═══════════════════════════════════════════════════════════════════
function TransactionsTable() {
  const thStyle = {
    padding: '10px 14px', textAlign: 'left',
    fontSize: '0.7rem', fontWeight: 700, color: '#8C8278',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    background: 'rgba(30,58,47,0.03)',
    borderBottom: '1px solid rgba(30,58,47,0.08)',
    whiteSpace: 'nowrap',
  }
  const tdStyle = { padding: '13px 14px', borderBottom: '1px solid rgba(30,58,47,0.05)', fontSize: '0.82rem', color: '#1A1A1A', verticalAlign: 'middle' }

  return (
    <div style={{ background: '#FFF', borderRadius: 14, border: '1px solid rgba(30,58,47,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(30,58,47,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>Transactions récentes</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>6 dernières opérations</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'rgba(30,58,47,0.05)', border: '1px solid rgba(30,58,47,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', color: '#4A4033', fontFamily: "'DM Sans', sans-serif" }}>
            {icons.filter()} Filtrer
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'rgba(30,58,47,0.05)', border: '1px solid rgba(30,58,47,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', color: '#4A4033', fontFamily: "'DM Sans', sans-serif" }}>
            {icons.refresh()} Actualiser
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Investisseur', 'Terrain', 'Surface', 'Montant', 'Méthode', 'Date', 'Statut', ''].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t, i) => (
              <tr key={t.id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                style={{ transition: 'background 0.15s' }}
              >
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.75rem', color: '#8C8278' }}>{t.id}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${t.user.charCodeAt(0) * 40 % 360},28%,88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: '#1E3A2F', flexShrink: 0 }}>
                      {t.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{t.user}</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, color: '#4A4033', fontSize: '0.78rem' }}>{t.terrain}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{t.sqm} m²</td>
                <td style={{ ...tdStyle, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1E3A2F', whiteSpace: 'nowrap' }}>
                  {t.amount.toLocaleString('fr-FR')} F
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(30,58,47,0.05)', borderRadius: 6, padding: '3px 8px', color: '#4A4033', whiteSpace: 'nowrap' }}>
                    {t.method}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#8C8278', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>{t.date}</td>
                <td style={tdStyle}><StatusBadge status={t.status} /></td>
                <td style={tdStyle}>
                  <button style={{ background: 'rgba(30,58,47,0.05)', border: '1px solid rgba(30,58,47,0.1)', borderRadius: 8, padding: '5px 10px', fontSize: '0.72rem', color: '#4A4033', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
                    Détails →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Terrains Overview
// ═══════════════════════════════════════════════════════════════════
function TerrainsOverview() {
  return (
    <div style={{ background: '#FFF', borderRadius: 14, border: '1px solid rgba(30,58,47,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(30,58,47,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>Terrains</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>5 parcelles · Vue globale</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          background: '#1E3A2F', color: '#F5F0E8', border: 'none', borderRadius: 8,
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#2D5241'}
        onMouseLeave={e => e.currentTarget.style.background = '#1E3A2F'}>
          {icons.plus()} Ajouter
        </button>
      </div>
      {terrains.map((t, i) => (
        <div key={t.id} style={{
          padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16,
          borderBottom: i < terrains.length - 1 ? '1px solid rgba(30,58,47,0.05)' : 'none',
          transition: 'background 0.15s', cursor: 'pointer',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {/* Color swatch */}
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: t.status === 'complet' ? 'linear-gradient(135deg,#1E3A2F,#2D5241)' :
                        t.status === 'brouillon' ? 'linear-gradient(135deg,#9A8880,#B0A99F)' :
                        'linear-gradient(135deg,#2D5241,#B8972A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>
            {t.status === 'complet' ? '✓' : t.status === 'brouillon' ? '✏' : '🗺'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: '0 0 1px', fontSize: '0.85rem', fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>📍 {t.city} · {t.docs} doc{t.docs > 1 ? 's' : ''}</p>
              </div>
              <StatusBadge status={t.status} />
            </div>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: 'rgba(30,58,47,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: t.progress + '%',
                  background: t.progress === 100 ? '#1E3A2F' : t.progress > 60 ? 'linear-gradient(90deg,#1E3A2F,#B8972A)' : '#B8972A',
                  transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8C8278', flexShrink: 0, fontWeight: 600, minWidth: 30 }}>{t.progress}%</span>
              <span style={{ fontSize: '0.72rem', color: '#8C8278', flexShrink: 0 }}>{t.soldSqm}/{t.totalSqm} m²</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Utilisateurs récents
// ═══════════════════════════════════════════════════════════════════
function RecentUsers() {
  return (
    <div style={{ background: '#FFF', borderRadius: 14, border: '1px solid rgba(30,58,47,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(30,58,47,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A1A' }}>Derniers inscrits</p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#8C8278' }}>5 utilisateurs récents</p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#B8972A', fontWeight: 600, cursor: 'pointer' }}>Voir tout →</span>
      </div>
      {recentUsers.map((u, i) => (
        <div key={u.id} style={{
          padding: '13px 22px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(30,58,47,0.04)' : 'none',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: `hsl(${u.name.charCodeAt(0) * 43 % 360},28%,88%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.78rem', fontWeight: 700, color: '#1E3A2F',
          }}>
            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 1px', fontSize: '0.82rem', fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {u.country} {u.name}
            </p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#8C8278' }}>{u.email} · {u.investments} inv.</p>
          </div>
          <StatusBadge status={u.kyc} />
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Alertes panneau
// ═══════════════════════════════════════════════════════════════════
function AlertsPanel() {
  const colors = { warning: '#8B6D14', error: '#B02A37', info: '#1E5A8A', success: '#1E3A2F' }
  const bgs = { warning: 'rgba(184,151,42,0.07)', error: 'rgba(220,53,69,0.06)', info: 'rgba(30,90,138,0.06)', success: 'rgba(30,58,47,0.07)' }
  const borders = { warning: 'rgba(184,151,42,0.2)', error: 'rgba(220,53,69,0.18)', info: 'rgba(30,90,138,0.18)', success: 'rgba(30,58,47,0.2)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ margin: '0 0 8px', fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: '#1A1A1A' }}>Alertes actives</p>
      {alerts.map(a => (
        <div key={a.id} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
          background: bgs[a.type], border: `1px solid ${borders[a.type]}`,
          borderRadius: 10, cursor: 'pointer', transition: 'transform 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{a.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: colors[a.type], fontWeight: 500, lineHeight: 1.4 }}>{a.text}</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.68rem', color: colors[a.type], opacity: 0.7 }}>{a.time}</p>
          </div>
          <span style={{ fontSize: '0.8rem', color: colors[a.type], opacity: 0.6, flexShrink: 0 }}>→</span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PAGE : Dashboard principal
// ═══════════════════════════════════════════════════════════════════
function DashboardPage({ setActive }) {
  const [kpiRef, kpiInView] = useInView()

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalTx = revenueData.reduce((s, d) => s + d.transactions, 0)

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Colonne principale */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Greeting */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)',
          borderRadius: 16, padding: '24px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 24px rgba(30,58,47,0.2)',
        }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: 'rgba(245,240,232,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Lundi 28 Octobre 2025
            </p>
            <h2 style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#F5F0E8' }}>
              Bonjour, Admin 👋
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(245,240,232,0.6)' }}>
              5 dossiers KYC attendent votre validation · 1 transaction en échec
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <div style={{ background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)', borderRadius: 12, padding: '12px 18px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.68rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenus Oct.</p>
              <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#D4AD3A' }}>4,12M F</p>
            </div>
            <div style={{ background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.25)', borderRadius: 12, padding: '12px 18px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.68rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Utilisateurs</p>
              <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#F5F0E8' }}>241</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div ref={kpiRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <AdminKpi index={0} label="Revenus totaux"    displayValue="28,5M F"  sub="Depuis lancement"   icon="💰" color="#1E3A2F" bg="rgba(30,58,47,0.08)"   delta={12.4} />
          <AdminKpi index={1} label="Investisseurs"     displayValue="241"       sub="Comptes actifs"     icon="👥" color="#B8972A" bg="rgba(184,151,42,0.1)"  delta={8.1}  />
          <AdminKpi index={2} label="m² vendus"         displayValue="4 870 m²"  sub="5 terrains"         icon="📐" color="#2D5241" bg="rgba(45,82,65,0.1)"    delta={18.3} />
          <AdminKpi index={3} label="KYC en attente"    displayValue="5"         sub="À traiter urgemment"icon="⏳" color="#B02A37" bg="rgba(220,53,69,0.06)"  delta={null} />
        </div>

        {/* Graphique */}
        <RevenueChart />

        {/* Transactions */}
        <TransactionsTable />
      </div>

      {/* Colonne droite */}
      <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AlertsPanel />
        <KycQueue setActive={setActive} />
        <TerrainsOverview />
        <RecentUsers />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PAGE : Placeholder (pages à développer — même pattern que Dashboard.jsx)
// ═══════════════════════════════════════════════════════════════════
function PlaceholderPage({ emoji, label }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, minHeight: 400 }}>
      <span style={{ fontSize: '4rem' }}>{emoji}</span>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{label}</h2>
      <p style={{ color: '#8C8278', fontSize: '0.9rem', margin: 0 }}>Cette section sera développée prochainement 🚧</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : AdminDashboard
// ═══════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  useFonts()
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const close = () => setNotifOpen(false)
    if (notifOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [notifOpen])

  const placeholders = {
    users:        { emoji: '👥', label: 'Gestion des utilisateurs' },
    terrains:     { emoji: '🗺️', label: 'Gestion des terrains'     },
    transactions: { emoji: '💳', label: 'Toutes les transactions'   },
    kyc:          { emoji: '🔐', label: 'Validation KYC complète'   },
    statistiques: { emoji: '📊', label: 'Statistiques & Rapports'   },
  }

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: '#F5F0E8',
    }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          active={active}
          notifOpen={notifOpen}
          setNotifOpen={v => { if (v && event) event.stopPropagation(); setNotifOpen(v) }}
        />

        <main style={{ flex: 1, overflow: 'auto', padding: 20, background: '#F5F0E8' }}>
          {active === 'dashboard'
            ? <DashboardPage setActive={setActive} />
            : <PlaceholderPage {...placeholders[active]} />
          }
        </main>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(30,58,47,0.15); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(30,58,47,0.3); }
      `}</style>
    </div>
  )
}