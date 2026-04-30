// ═══════════════════════════════════════════════════════════════════
// AdminDashboard.jsx — Backoffice Admin · LandShare Bénin
// Design System : identique Dashboard.jsx + Landing.jsx
// Palette : #F5F0E8 crème · #1E3A2F vert forêt · #B8972A or · #111810 sidebar
// Polices : Playfair Display · DM Sans
// Responsive : sidebar desktop ↔ bottom nav mobile
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'

// ═══════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════
function useFonts() {
  useEffect(() => {
    const l = document.createElement('link')
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'
    l.rel = 'stylesheet'
    document.head.appendChild(l)
  }, [])
}

function useCountUp(target, duration = 1600, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let s = null
    const step = ts => {
      if (!s) s = ts
      const p = Math.min((ts - s) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, trigger])
  return val
}

function useInView() {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, v]
}

function useMediaQuery(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const h = e => setM(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [q])
  return m
}

// ═══════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════
const revenueData = [
  { month: 'Nov', revenue: 1250, tx: 14 },
  { month: 'Déc', revenue: 1890, tx: 22 },
  { month: 'Jan', revenue: 1540, tx: 18 },
  { month: 'Fév', revenue: 2100, tx: 27 },
  { month: 'Mar', revenue: 1780, tx: 21 },
  { month: 'Avr', revenue: 2450, tx: 31 },
  { month: 'Mai', revenue: 2890, tx: 38 },
  { month: 'Jun', revenue: 2640, tx: 35 },
  { month: 'Jul', revenue: 3210, tx: 42 },
  { month: 'Aoû', revenue: 2980, tx: 39 },
  { month: 'Sep', revenue: 3650, tx: 48 },
  { month: 'Oct', revenue: 4120, tx: 54 },
]

const kycQueue = [
  { id: 'KYC-091', name: 'Mariama Diallo',   flag: '🇫🇷', doc: 'Passeport', ago: '2h'  },
  { id: 'KYC-090', name: 'Ibrahim Touré',    flag: '🇨🇦', doc: 'CNI',       ago: '5h'  },
  { id: 'KYC-089', name: 'Fatoumata Bah',    flag: '🇧🇪', doc: 'Passeport', ago: '8h'  },
  { id: 'KYC-088', name: 'Serge Ahoménou',   flag: '🇧🇯', doc: 'CNI',       ago: '1j'  },
  { id: 'KYC-087', name: 'Aminata Kouyaté',  flag: '🇺🇸', doc: 'Passeport', ago: '1j'  },
]

const transactions = [
  { id: 'LS-054', user: 'Aisha Koné',      terrain: 'Calavi Nord',    sqm: 10, amount: 154500, status: 'confirmed', method: 'MTN MoMo',   date: '28 Oct' },
  { id: 'LS-053', user: 'Romaric H.',      terrain: 'Fidjrossè',      sqm: 5,  amount: 77250,  status: 'confirmed', method: 'Stripe',      date: '27 Oct' },
  { id: 'LS-052', user: 'Aïcha Traoré',    terrain: 'Porto-Novo Est', sqm: 3,  amount: 46500,  status: 'pending',   method: 'MTN MoMo',   date: '27 Oct' },
  { id: 'LS-051', user: 'Kevin Agossa',    terrain: 'Parakou Nord',   sqm: 8,  amount: 68000,  status: 'confirmed', method: 'Moov Money', date: '26 Oct' },
  { id: 'LS-050', user: 'Sylvie Dossou',   terrain: 'Calavi Nord',    sqm: 15, amount: 231750, status: 'failed',    method: 'Stripe',      date: '26 Oct' },
  { id: 'LS-049', user: 'Jean-Paul K.',    terrain: 'Fidjrossè',      sqm: 20, amount: 309000, status: 'confirmed', method: 'Paystack',   date: '25 Oct' },
]

const terrains = [
  { id: 'TRN-001', name: 'Calavi Nord – Lot 12',      city: 'Abomey-Calavi', status: 'disponible', progress: 68,  total: 1000, sold: 680 },
  { id: 'TRN-002', name: 'Fidjrossè Balnéaire',        city: 'Cotonou',       status: 'en_cours',   progress: 91,  total: 500,  sold: 455 },
  { id: 'TRN-003', name: 'Porto-Novo Est – Zone Com.', city: 'Porto-Novo',    status: 'disponible', progress: 28,  total: 1500, sold: 420 },
  { id: 'TRN-004', name: 'Parakou Nord – Lot B',       city: 'Parakou',       status: 'brouillon',  progress: 0,   total: 800,  sold: 0   },
  { id: 'TRN-005', name: 'Ouidah Historique',           city: 'Ouidah',        status: 'complet',    progress: 100, total: 600,  sold: 600 },
]

const alerts = [
  { id: 1, type: 'warning', msg: '5 dossiers KYC en attente de validation' },
  { id: 2, type: 'error',   msg: 'Transaction LS-050 échouée — intervention requise' },
  { id: 3, type: 'info',    msg: 'Terrain TRN-004 en attente de vérification docs' },
  { id: 4, type: 'success', msg: 'Ouidah Historique a atteint 100% de financement' },
]

// ═══════════════════════════════════════════════
// STYLES GLOBAUX (tokens identiques Dashboard.jsx)
// ═══════════════════════════════════════════════
const C = {
  bg:       '#F5F0E8',
  surface:  '#FFFFFF',
  sidebar:  '#111810',
  green:    '#1E3A2F',
  green2:   '#2D5241',
  gold:     '#B8972A',
  goldText: '#D4AD3A',
  cream:    '#F5F0E8',
  text:     '#1A1A1A',
  muted:    '#8C8278',
  border:   'rgba(30,58,47,0.09)',
  red:      '#DC3545',
  redBg:    'rgba(220,53,69,0.07)',
  pending:  '#8B6D14',
  pendBg:   'rgba(184,151,42,0.10)',
}

// ═══════════════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════════════
function Avatar({ name, size = 32 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const hue = (name.charCodeAt(0) * 47 + name.charCodeAt(1) * 13) % 360
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue},28%,86%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, color: C.green,
    }}>{initials}</div>
  )
}

const statusMap = {
  confirmed:  { label: 'Confirmé',  bg: 'rgba(30,58,47,0.09)',   color: C.green   },
  pending:    { label: 'En attente',bg: C.pendBg,                 color: C.pending },
  failed:     { label: 'Échoué',    bg: C.redBg,                  color: '#B02A37' },
  disponible: { label: 'Disponible',bg: 'rgba(30,58,47,0.09)',   color: C.green   },
  en_cours:   { label: 'En cours',  bg: C.pendBg,                 color: C.pending },
  brouillon:  { label: 'Brouillon', bg: 'rgba(140,130,120,0.1)', color: '#6B5B4E' },
  complet:    { label: 'Complet',   bg: 'rgba(45,82,65,0.13)',   color: C.green   },
  valide:     { label: 'Validé',    bg: 'rgba(30,58,47,0.09)',   color: C.green   },
  en_attente: { label: 'En attente',bg: C.pendBg,                 color: C.pending },
  rejete:     { label: 'Rejeté',    bg: C.redBg,                  color: '#B02A37' },
}

function Badge({ status }) {
  const s = statusMap[status] || { label: status, bg: 'rgba(0,0,0,0.06)', color: '#555' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20,
      background: s.bg, color: s.color,
      fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  )
}

function Card({ children, style }) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
    }}>
      <div>
        <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: C.text }}>{title}</p>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: C.muted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function Btn({ children, variant = 'ghost', onClick, style }) {
  const variants = {
    primary: { background: C.green,   color: C.cream,  border: 'none' },
    ghost:   { background: 'rgba(30,58,47,0.05)', color: C.text, border: `1px solid ${C.border}` },
    gold:    { background: 'rgba(184,151,42,0.1)', color: C.pending, border: `1px solid rgba(184,151,42,0.22)` },
    danger:  { background: C.redBg,    color: '#B02A37', border: `1px solid rgba(220,53,69,0.2)` },
  }
  const v = variants[variant]
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 13px', borderRadius: 8,
      ...v,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '0.76rem', fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.18s',
      ...style,
    }}>
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════
// SVG ICONS — même style que Dashboard.jsx
// ═══════════════════════════════════════════════
const Ico = ({ d, size = 18, s = 2, extra = null }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d} />}
    {extra}
  </svg>
)

const IcoGrid = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IcoUsers = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IcoMap = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
const IcoCredit = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoShield = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IcoBar = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IcoBell = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const IcoCheck = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoX = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoEye = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcoPlus = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcoLogout = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcoMenu = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const IcoChevL = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>

const navItems = [
  { id: 'dashboard',    label: 'Tableau de bord', Icon: IcoGrid,   badge: null  },
  { id: 'users',        label: 'Utilisateurs',    Icon: IcoUsers,  badge: '241' },
  { id: 'terrains',     label: 'Terrains',         Icon: IcoMap,    badge: '1'   },
  { id: 'transactions', label: 'Transactions',     Icon: IcoCredit, badge: '1'   },
  { id: 'kyc',          label: 'KYC',              Icon: IcoShield, badge: '5'   },
  { id: 'stats',        label: 'Statistiques',     Icon: IcoBar,    badge: null  },
]

// ═══════════════════════════════════════════════
// SIDEBAR (desktop)
// ═══════════════════════════════════════════════
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const btnStyle = (isActive) => ({
    width: '100%',
    display: 'flex', alignItems: 'center',
    gap: collapsed ? 0 : 10,
    justifyContent: collapsed ? 'center' : 'flex-start',
    padding: collapsed ? '11px 0' : '10px 12px',
    borderRadius: 10, border: 'none', cursor: 'pointer',
    borderLeft: `3px solid ${isActive ? C.gold : 'transparent'}`,
    background: isActive ? 'rgba(184,151,42,0.13)' : 'transparent',
    color: isActive ? C.goldText : 'rgba(245,240,232,0.52)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
    transition: 'all 0.2s', marginBottom: 2,
    overflow: 'hidden', whiteSpace: 'nowrap',
  })

  return (
    <aside style={{
      width: collapsed ? 68 : 236,
      background: C.sidebar,
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
      transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid rgba(245,240,232,0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between', gap: 8,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, background: C.green, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 12, height: 12, background: C.gold, clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#F5F0E8', whiteSpace: 'nowrap' }}>
              Land<span style={{ color: C.gold }}>Share</span>
              <span style={{ color: 'rgba(245,240,232,0.35)', fontSize: '0.62rem', fontWeight: 400, marginLeft: 5 }}>ADMIN</span>
            </span>
          </div>
        )}
        {collapsed && (
          <div style={{ width: 30, height: 30, background: C.green, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 12, height: 12, background: C.gold, clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)',
          borderRadius: 7, width: 26, height: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(245,240,232,0.45)', flexShrink: 0, fontSize: '0.7rem',
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Badge rôle */}
      {!collapsed && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(184,151,42,0.12)', border: '1px solid rgba(184,151,42,0.2)',
            borderRadius: 20, padding: '2px 10px',
            fontSize: '0.62rem', fontWeight: 700, color: C.goldText, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.gold }} />
            Administrateur
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflow: 'hidden' }}>
        {!collapsed && <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.22)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px 8px', fontWeight: 600 }}>Navigation</p>}
        {navItems.map(({ id, label, Icon, badge }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={() => setActive(id)} title={collapsed ? label : ''} style={btnStyle(isActive)}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(245,240,232,0.05)'; e.currentTarget.style.color = '#F5F0E8' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(245,240,232,0.52)' } }}
            >
              <span style={{ flexShrink: 0 }}><Icon size={17} /></span>
              {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>}
              {!collapsed && badge && (
                <span style={{
                  background: isActive ? C.gold : 'rgba(220,53,69,0.75)',
                  color: isActive ? C.sidebar : '#fff',
                  fontSize: '0.62rem', fontWeight: 700,
                  padding: '1px 7px', borderRadius: 10,
                }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Admin user */}
      <div style={{ padding: '14px 14px', borderTop: '1px solid rgba(245,240,232,0.06)' }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700, color: C.gold,
              border: '2px solid rgba(184,151,42,0.28)',
            }}>AD</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#F5F0E8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin Principal</p>
              <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(245,240,232,0.33)' }}>admin@landshare.bj</p>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.28)', padding: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = C.red}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.28)'}
            ><IcoLogout size={16} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: C.gold }}>AD</div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════
function Topbar({ active, isMobile, onMenuOpen, notifOpen, setNotifOpen }) {
  const titles = { dashboard: 'Tableau de bord', users: 'Utilisateurs', terrains: 'Terrains', transactions: 'Transactions', kyc: 'Validation KYC', stats: 'Statistiques' }

  return (
    <header style={{
      height: 60,
      background: '#FDFAF5',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isMobile && (
          <button onClick={onMenuOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text, display: 'flex' }}>
            <IcoMenu />
          </button>
        )}
        <div>
          <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text }}>{titles[active]}</p>
          {!isMobile && <p style={{ margin: 0, fontSize: '0.68rem', color: C.muted }}>Lundi 28 Oct 2025 · LandShare Bénin</p>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!isMobile && (
          <div style={{ position: 'relative' }}>
            <input placeholder="Rechercher…" style={{
              background: 'rgba(30,58,47,0.05)', border: `1px solid ${C.border}`,
              borderRadius: 20, padding: '7px 14px 7px 34px',
              fontSize: '0.78rem', color: C.text, outline: 'none',
              fontFamily: "'DM Sans', sans-serif", width: 180,
            }} />
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: '0.85rem' }}>🔍</span>
          </div>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={e => { e.stopPropagation(); setNotifOpen(!notifOpen) }} style={{
            width: 36, height: 36, borderRadius: 9,
            background: notifOpen ? 'rgba(184,151,42,0.1)' : 'rgba(30,58,47,0.05)',
            border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: C.text, position: 'relative',
          }}>
            <IcoBell size={17} />
            <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: C.red, border: '1.5px solid #FDFAF5' }} />
          </button>
          {notifOpen && (
            <div style={{
              position: 'absolute', top: 44, right: 0, zIndex: 300,
              background: C.surface, borderRadius: 12, width: 310,
              boxShadow: '0 8px 32px rgba(30,58,47,0.14)',
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '0.9rem' }}>Alertes</span>
                <span style={{ fontSize: '0.7rem', color: C.gold, fontWeight: 600, cursor: 'pointer' }}>Tout marquer lu</span>
              </div>
              {alerts.map(a => {
                const cfg = { warning: { bg: C.pendBg, color: C.pending }, error: { bg: C.redBg, color: '#B02A37' }, info: { bg: 'rgba(30,90,138,0.07)', color: '#18568A' }, success: { bg: 'rgba(30,58,47,0.08)', color: C.green } }
                const s = cfg[a.type]
                return (
                  <div key={a.id} style={{ padding: '11px 16px', background: s.bg, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{a.type === 'warning' ? '⚠️' : a.type === 'error' ? '❌' : a.type === 'success' ? '✅' : 'ℹ️'}</span>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: s.color, lineHeight: 1.45 }}>{a.msg}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {!isMobile && (
          <Btn variant="primary" style={{ borderRadius: 20, padding: '8px 16px' }}>
            <IcoPlus size={14} /> Nouveau terrain
          </Btn>
        )}
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════
// BOTTOM NAV (mobile)
// ═══════════════════════════════════════════════
function BottomNav({ active, setActive }) {
  const shown = navItems.slice(0, 5)
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: C.sidebar,
      display: 'flex',
      borderTop: '1px solid rgba(245,240,232,0.08)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {shown.map(({ id, label, Icon, badge }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => setActive(id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 3, padding: '10px 4px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: isActive ? C.goldText : 'rgba(245,240,232,0.42)',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', fontWeight: isActive ? 600 : 400,
            borderTop: `2px solid ${isActive ? C.gold : 'transparent'}`,
            transition: 'all 0.2s',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon size={19} />
              {badge && <span style={{ position: 'absolute', top: -3, right: -5, background: C.red, color: '#fff', fontSize: '0.5rem', fontWeight: 800, padding: '1px 4px', borderRadius: 6 }}>{badge}</span>}
            </div>
            {label.split(' ')[0]}
          </button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════
// MOBILE DRAWER (sidebar as overlay)
// ═══════════════════════════════════════════════
function MobileDrawer({ open, onClose, active, setActive }) {
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)' }} />
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 500,
        width: 260, background: C.sidebar,
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn .25s ease',
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(245,240,232,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, background: C.green, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, background: C.gold, clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#F5F0E8' }}>
              Land<span style={{ color: C.gold }}>Share</span>
              <span style={{ color: 'rgba(245,240,232,0.35)', fontSize: '0.6rem', fontWeight: 400, marginLeft: 4 }}>ADMIN</span>
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.5)', fontSize: '1.1rem' }}>✕</button>
        </div>
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {navItems.map(({ id, label, Icon, badge }) => {
            const isActive = active === id
            return (
              <button key={id} onClick={() => { setActive(id); onClose() }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                borderLeft: `3px solid ${isActive ? C.gold : 'transparent'}`,
                background: isActive ? 'rgba(184,151,42,0.13)' : 'transparent',
                color: isActive ? C.goldText : 'rgba(245,240,232,0.52)',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.87rem',
                fontWeight: isActive ? 600 : 400, marginBottom: 2,
              }}>
                <Icon size={18} />
                <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                {badge && <span style={{ background: isActive ? C.gold : 'rgba(220,53,69,0.75)', color: isActive ? C.sidebar : '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>{badge}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(245,240,232,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: C.gold, border: '2px solid rgba(184,151,42,0.28)' }}>AD</div>
          <div><p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#F5F0E8' }}>Admin Principal</p><p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(245,240,232,0.33)' }}>admin@landshare.bj</p></div>
        </div>
      </aside>
    </>
  )
}

// ═══════════════════════════════════════════════
// KPI CARD
// ═══════════════════════════════════════════════
function KpiCard({ label, value, sub, icon, delta, color, bgColor, index }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 20px',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)',
      transition: `opacity .45s ${index * 0.08}s, transform .45s ${index * 0.08}s`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <div style={{ width: 32, height: 32, background: bgColor, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>{icon}</div>
      </div>
      <p style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
      <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted }}>{sub}</p>
      {delta !== null && delta !== undefined && (
        <p style={{ margin: '8px 0 0', fontSize: '0.72rem', fontWeight: 600, color: delta >= 0 ? C.green : C.red, display: 'flex', alignItems: 'center', gap: 3 }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% <span style={{ color: C.muted, fontWeight: 400 }}>vs mois dernier</span>
        </p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// GRAPHIQUE REVENUS
// ═══════════════════════════════════════════════
function RevenueChart() {
  const [ref, inView] = useInView()
  const CustomTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(30,58,47,0.1)' }}>
        <p style={{ margin: '0 0 3px', fontSize: '0.7rem', color: C.muted, fontWeight: 600 }}>{label} 2025</p>
        <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: C.green }}>{(payload[0]?.value || 0).toLocaleString('fr-FR')}k FCFA</p>
        <p style={{ margin: 0, fontSize: '0.7rem', color: C.gold, fontWeight: 600 }}>{payload[1]?.value} transactions</p>
      </div>
    )
  }
  return (
    <Card style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)', transition: 'opacity .5s .15s, transform .5s .15s' }}>
      <div ref={ref} />
      <CardHeader
        title="Revenus & Transactions"
        subtitle="12 derniers mois · en milliers de FCFA"
        action={
          <div style={{ display: 'flex', gap: 12 }}>
            {[['#1E3A2F', 'Revenus'], ['#B8972A', 'Transactions']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: C.muted }}>
                <span style={{ width: 10, height: 3, background: c, borderRadius: 2 }} /> {l}
              </div>
            ))}
          </div>
        }
      />
      <div style={{ padding: '16px 12px 12px' }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A2F" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8972A" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#B8972A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,47,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#B0A99F', fontFamily: "'DM Sans'" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#B0A99F' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTip />} />
            <Area type="monotone" dataKey="revenue" stroke="#1E3A2F" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: '#1E3A2F' }} />
            <Area type="monotone" dataKey="tx" stroke="#B8972A" strokeWidth={1.5} fill="url(#gTx)" dot={false} activeDot={{ r: 4, fill: '#B8972A' }} yAxisId="r" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ═══════════════════════════════════════════════
// FILE KYC — interactive
// ═══════════════════════════════════════════════
function KycQueue() {
  const [items, setItems] = useState(kycQueue)
  const decide = (id, action) => {
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 400)
  }
  return (
    <Card>
      <CardHeader
        title="File KYC en attente"
        subtitle={`${items.length} dossier${items.length !== 1 ? 's' : ''} à traiter`}
        action={<Btn variant="gold">Voir tout →</Btn>}
      />
      {items.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>✅</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: '0 0 4px' }}>File vide !</p>
          <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0 }}>Tous les dossiers ont été traités.</p>
        </div>
      ) : items.map((k, i) => (
        <div key={k.id} style={{
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
          transition: 'opacity .35s', flexWrap: 'wrap',
        }}>
          <Avatar name={k.name} size={34} />
          <div style={{ flex: 1, minWidth: 120 }}>
            <p style={{ margin: '0 0 1px', fontSize: '0.83rem', fontWeight: 600, color: C.text }}>{k.flag} {k.name}</p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted }}>{k.id} · {k.doc} · il y a {k.ago}</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button title="Voir" style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(30,58,47,0.05)', border: `1px solid ${C.border}`, cursor: 'pointer', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoEye />
            </button>
            <button title="Valider" onClick={() => decide(k.id, 'accept')} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(30,58,47,0.06)', border: `1px solid rgba(30,58,47,0.14)`, cursor: 'pointer', color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = C.cream }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,58,47,0.06)'; e.currentTarget.style.color = C.green }}>
              <IcoCheck />
            </button>
            <button title="Rejeter" onClick={() => decide(k.id, 'reject')} style={{ width: 30, height: 30, borderRadius: 8, background: C.redBg, border: `1px solid rgba(220,53,69,0.18)`, cursor: 'pointer', color: '#B02A37', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.redBg; e.currentTarget.style.color = '#B02A37' }}>
              <IcoX />
            </button>
          </div>
        </div>
      ))}
    </Card>
  )
}

// ═══════════════════════════════════════════════
// TABLEAU TRANSACTIONS
// ═══════════════════════════════════════════════
function TransactionsTable({ isMobile }) {
  return (
    <Card>
      <CardHeader
        title="Transactions récentes"
        subtitle="6 dernières opérations"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" style={{ fontSize: '0.72rem', padding: '6px 10px' }}>Filtrer</Btn>
          </div>
        }
      />
      {isMobile ? (
        // MOBILE : cards empilées au lieu d'un tableau
        <div>
          {transactions.map((t, i) => (
            <div key={t.id} style={{ padding: '14px 18px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={t.user} size={32} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.83rem', fontWeight: 600, color: C.text }}>{t.user}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted }}>{t.terrain} · {t.sqm} m²</p>
                  </div>
                </div>
                <Badge status={t.status} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.green }}>{t.amount.toLocaleString('fr-FR')} F</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: C.muted }}>{t.method}</span>
                  <span style={{ fontSize: '0.68rem', color: C.muted }}>·</span>
                  <span style={{ fontSize: '0.68rem', color: C.muted }}>{t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // DESKTOP : tableau complet
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
            <thead>
              <tr>
                {['ID', 'Investisseur', 'Terrain', 'Surface', 'Montant', 'Méthode', 'Date', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.67rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', background: 'rgba(30,58,47,0.025)', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ transition: 'background .15s' }}
                >
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none', fontFamily: 'monospace', fontSize: '0.72rem', color: C.muted }}>{t.id}</td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={t.user} size={26} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{t.user}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none', fontSize: '0.78rem', color: '#4A4033' }}>{t.terrain}</td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none', fontSize: '0.82rem', fontWeight: 600 }}>{t.sqm} m²</td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: C.green, whiteSpace: 'nowrap' }}>{t.amount.toLocaleString('fr-FR')} F</td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none' }}><span style={{ fontSize: '0.7rem', background: 'rgba(30,58,47,0.05)', borderRadius: 6, padding: '2px 8px', color: '#4A4033', whiteSpace: 'nowrap' }}>{t.method}</span></td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none', fontSize: '0.75rem', color: C.muted, whiteSpace: 'nowrap' }}>{t.date}</td>
                  <td style={{ padding: '12px 14px', borderBottom: i < transactions.length - 1 ? `1px solid ${C.border}` : 'none' }}><Badge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

// ═══════════════════════════════════════════════
// TERRAINS OVERVIEW
// ═══════════════════════════════════════════════
function TerrainsOverview() {
  return (
    <Card>
      <CardHeader
        title="Terrains"
        subtitle="5 parcelles · vue globale"
        action={<Btn variant="primary" style={{ borderRadius: 8, padding: '7px 12px', fontSize: '0.75rem' }}><IcoPlus size={13} /> Ajouter</Btn>}
      />
      {terrains.map((t, i) => (
        <div key={t.id} style={{
          padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: i < terrains.length - 1 ? `1px solid ${C.border}` : 'none',
          cursor: 'pointer', transition: 'background .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: t.status === 'complet' ? 'linear-gradient(135deg,#1E3A2F,#2D5241)'
              : t.status === 'brouillon' ? 'linear-gradient(135deg,#9A8880,#B0A99F)'
              : 'linear-gradient(135deg,#2D5241,#B8972A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
          }}>
            {t.status === 'complet' ? '✓' : t.status === 'brouillon' ? '✏' : '🗺'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, flexWrap: 'wrap', gap: 4 }}>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{t.name}</p>
              <Badge status={t.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: 'rgba(30,58,47,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${t.progress}%`, background: t.progress === 100 ? C.green : t.progress > 60 ? `linear-gradient(90deg,${C.green},${C.gold})` : C.gold, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: C.muted, whiteSpace: 'nowrap', minWidth: 70 }}>{t.sold}/{t.total} m²</span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}

// ═══════════════════════════════════════════════
// ALERTES PANEL
// ═══════════════════════════════════════════════
function AlertsPanel() {
  const cfg = {
    warning: { bg: C.pendBg, color: C.pending, border: 'rgba(184,151,42,0.22)', icon: '⚠️' },
    error:   { bg: C.redBg,  color: '#B02A37',  border: 'rgba(220,53,69,0.2)',   icon: '❌' },
    info:    { bg: 'rgba(30,90,138,0.07)', color: '#18568A', border: 'rgba(30,90,138,0.18)', icon: 'ℹ️' },
    success: { bg: 'rgba(30,58,47,0.07)', color: C.green,  border: 'rgba(30,58,47,0.18)', icon: '✅' },
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: C.text }}>Alertes actives</p>
      {alerts.map(a => {
        const s = cfg[a.type]
        return (
          <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, cursor: 'pointer', transition: 'transform .15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{s.icon}</span>
            <p style={{ margin: 0, fontSize: '0.78rem', color: s.color, lineHeight: 1.45, flex: 1 }}>{a.msg}</p>
            <span style={{ color: s.color, opacity: 0.6, flexShrink: 0 }}>→</span>
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════
// PAGE DASHBOARD PRINCIPALE
// ═══════════════════════════════════════════════
function DashboardPage({ isMobile }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>

      {/* Colonne principale */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Greeting banner — identique style Dashboard.jsx */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)',
          borderRadius: 16, padding: isMobile ? '20px 18px' : '22px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(30,58,47,0.18)',
        }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.7rem', color: 'rgba(245,240,232,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Lundi 28 Octobre 2025</p>
            <h2 style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.2rem' : '1.35rem', fontWeight: 700, color: '#F5F0E8' }}>
              Bonjour, Admin 👋
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(245,240,232,0.58)' }}>
              5 dossiers KYC en attente · 1 transaction échouée
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenus Oct.</p>
              <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: C.goldText }}>4,12M F</p>
            </div>
            {!isMobile && (
              <div style={{ background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.25)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Investisseurs</p>
                <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F5F0E8' }}>241</p>
              </div>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14 }}>
          <KpiCard index={0} label="Revenus totaux"  value="28,5M F"  sub="Depuis lancement"    icon="💰" color={C.green}   bgColor="rgba(30,58,47,0.08)"   delta={12.4} />
          <KpiCard index={1} label="Investisseurs"   value="241"      sub="Comptes actifs"       icon="👥" color={C.gold}    bgColor="rgba(184,151,42,0.1)"  delta={8.1}  />
          <KpiCard index={2} label="m² vendus"       value="4 870"    sub="Sur 5 terrains"       icon="📐" color={C.green2}  bgColor="rgba(45,82,65,0.1)"    delta={18.3} />
          <KpiCard index={3} label="KYC en attente"  value="5"        sub="À traiter"            icon="⏳" color="#B02A37"  bgColor={C.redBg}               delta={null} />
        </div>

        {/* Graphique */}
        <RevenueChart />

        {/* Transactions */}
        <TransactionsTable isMobile={isMobile} />

        {/* Terrains (mobile : ici, desktop : dans colonne droite) */}
        {isMobile && <TerrainsOverview />}
        {isMobile && <KycQueue />}
      </div>

      {/* Colonne droite (desktop uniquement) */}
      {!isMobile && (
        <div style={{ width: 296, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AlertsPanel />
          <KycQueue />
          <TerrainsOverview />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// PLACEHOLDER PAGE
// ═══════════════════════════════════════════════
function PlaceholderPage({ emoji, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, minHeight: 400 }}>
      <span style={{ fontSize: '3.5rem' }}>{emoji}</span>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: C.text, margin: 0 }}>{label}</h2>
      <p style={{ color: C.muted, fontSize: '0.88rem', margin: 0 }}>Cette section sera développée prochainement 🚧</p>
    </div>
  )
}

const placeholders = {
  users:        { emoji: '👥', label: 'Gestion des utilisateurs' },
  terrains:     { emoji: '🗺️', label: 'Gestion des terrains'     },
  transactions: { emoji: '💳', label: 'Toutes les transactions'   },
  kyc:          { emoji: '🔐', label: 'Validation KYC complète'   },
  stats:        { emoji: '📊', label: 'Statistiques & Rapports'   },
}

// ═══════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════
export default function AdminDashboard() {
  useFonts()
  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isMobile = useMediaQuery('(max-width: 768px)')

  // Ferme le dropdown notif si clic ailleurs
  useEffect(() => {
    const close = () => setNotifOpen(false)
    if (notifOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [notifOpen])

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: C.bg,
    }}>
      {/* Sidebar desktop */}
      {!isMobile && (
        <Sidebar
          active={active} setActive={setActive}
          collapsed={collapsed} setCollapsed={setCollapsed}
        />
      )}

      {/* Drawer mobile */}
      {isMobile && (
        <MobileDrawer
          open={drawerOpen} onClose={() => setDrawerOpen(false)}
          active={active} setActive={setActive}
        />
      )}

      {/* Contenu principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          active={active}
          isMobile={isMobile}
          onMenuOpen={() => setDrawerOpen(true)}
          notifOpen={notifOpen}
          setNotifOpen={v => { if (v && typeof event !== 'undefined') event.stopPropagation(); setNotifOpen(v) }}
        />

        {/* Scroll area */}
        <main style={{
          flex: 1, overflow: 'auto',
          padding: isMobile ? '16px 14px 80px' : '20px',
          background: C.bg,
        }}>
          {active === 'dashboard'
            ? <DashboardPage isMobile={isMobile} />
            : <PlaceholderPage {...placeholders[active]} />
          }
        </main>
      </div>

      {/* Bottom nav mobile */}
      {isMobile && <BottomNav active={active} setActive={setActive} />}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(30,58,47,0.15); border-radius: 3px; }
      `}</style>
    </div>
  )
}