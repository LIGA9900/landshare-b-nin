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

const USERS_DATA = [
  { id:1,  ref:'USR-241', name:'Aisha Koné',      email:'aisha.kone@email.com',   country:'🇫🇷 France',   sqm:15,  invested:225000, kyc:'validated', status:'active',    joined:'12 Oct 2025' },
  { id:2,  ref:'USR-240', name:'Malick Fassinou',  email:'malick.f@gmail.com',     country:'🇧🇯 Bénin',    sqm:8,   invested:120000, kyc:'validated', status:'active',    joined:'10 Oct 2025' },
  { id:3,  ref:'USR-239', name:'Mariama Diallo',   email:'mariama.d@yahoo.fr',     country:'🇧🇪 Belgique', sqm:0,   invested:0,      kyc:'pending',   status:'active',    joined:'08 Oct 2025' },
  { id:4,  ref:'USR-238', name:'Ibrahim Touré',    email:'ibrahim.toure@pro.com',  country:'🇨🇦 Canada',   sqm:22,  invested:385000, kyc:'validated', status:'active',    joined:'05 Oct 2025' },
  { id:5,  ref:'USR-237', name:'Sylvie Dossou',    email:'sylvie.d@hotmail.com',   country:'🇧🇯 Bénin',    sqm:5,   invested:75000,  kyc:'validated', status:'suspended', joined:'02 Oct 2025' },
  { id:6,  ref:'USR-236', name:'Jean-Paul Koffi',  email:'jpkoffi@email.com',      country:'🇩🇪 Allemagne',sqm:30,  invested:510000, kyc:'validated', status:'active',    joined:'28 Sep 2025' },
  { id:7,  ref:'USR-235', name:'Amina Soumaré',    email:'amina.s@outlook.com',    country:'🇫🇷 France',   sqm:0,   invested:0,      kyc:'rejected',  status:'active',    joined:'25 Sep 2025' },
  { id:8,  ref:'USR-234', name:'Romaric Houénou',  email:'romaric.h@gmail.com',    country:'🇧🇯 Bénin',    sqm:12,  invested:180000, kyc:'validated', status:'active',    joined:'20 Sep 2025' },
]

const TERRAINS_DATA = [
  { id:1, ref:'TRN-001', name:'Calavi Nord — Lot 12',       city:'Abomey-Calavi', totalSqm:1000, soldSqm:680,  price:15000, status:'published', investors:47, revenue:10200000, created:'01 Sep 2025' },
  { id:2, ref:'TRN-002', name:'Fidjrossè Balnéaire',         city:'Cotonou',       totalSqm:500,  soldSqm:455,  price:35000, status:'published', investors:32, revenue:15925000, created:'15 Sep 2025' },
  { id:3, ref:'TRN-003', name:'Porto-Novo Est — Zone Com.', city:'Porto-Novo',    totalSqm:1500, soldSqm:420,  price:8500,  status:'published', investors:28, revenue:3570000,  created:'20 Sep 2025' },
  { id:4, ref:'TRN-004', name:'Parakou Nord — Lot B',        city:'Parakou',       totalSqm:800,  soldSqm:0,    price:12000, status:'draft',     investors:0,  revenue:0,        created:'25 Oct 2025' },
  { id:5, ref:'TRN-005', name:'Ouidah Historique',            city:'Ouidah',        totalSqm:600,  soldSqm:600,  price:20000, status:'full',      investors:55, revenue:12000000, created:'01 Août 2025'},
]

const TRANSACTIONS_DATA = [
  { id:1, ref:'LS-054', user:'Aisha Koné',     terrain:'Calavi Nord',       sqm:5,  amount:77250,  method:'MTN MoMo',   status:'confirmed', date:'03 Mai 2026', time:'14:32' },
  { id:2, ref:'LS-053', user:'Romaric H.',      terrain:'Fidjrossè',         sqm:5,  amount:77250,  method:'Stripe',     status:'confirmed', date:'27 Oct 2025', time:'11:15' },
  { id:3, ref:'LS-052', user:'Aïcha Traoré',    terrain:'Porto-Novo Est',    sqm:3,  amount:46500,  method:'MTN MoMo',   status:'pending',   date:'27 Oct 2025', time:'09:48' },
  { id:4, ref:'LS-051', user:'Kevin Agossa',    terrain:'Parakou Nord',      sqm:8,  amount:68000,  method:'Moov Money', status:'confirmed', date:'26 Oct 2025', time:'16:22' },
  { id:5, ref:'LS-050', user:'Sylvie Dossou',   terrain:'Calavi Nord',       sqm:15, amount:231750, method:'Stripe',     status:'failed',    date:'26 Oct 2025', time:'08:05' },
  { id:6, ref:'LS-049', user:'Jean-Paul K.',    terrain:'Fidjrossè',         sqm:20, amount:309000, method:'Paystack',   status:'confirmed', date:'25 Oct 2025', time:'13:40' },
  { id:7, ref:'LS-048', user:'Ibrahim Touré',   terrain:'Ouidah Historique', sqm:10, amount:154500, method:'MTN MoMo',   status:'confirmed', date:'24 Oct 2025', time:'10:18' },
  { id:8, ref:'LS-047', user:'Amina Soumaré',   terrain:'Calavi Nord',       sqm:3,  amount:46350,  method:'Stripe',     status:'refunded',  date:'23 Oct 2025', time:'15:55' },
]

const KYC_DATA = [
  { id:1, ref:'KYC-091', name:'Mariama Diallo',  email:'mariama.d@yahoo.fr',   country:'🇧🇪 Belgique', type:'Passeport',      submitted:'Il y a 2h',  status:'pending'   },
  { id:2, ref:'KYC-090', name:'Ibrahim Touré',   email:'ibrahim.toure@pro.com', country:'🇨🇦 Canada',   type:'CNI',            submitted:'Il y a 5h',  status:'pending'   },
  { id:3, ref:'KYC-089', name:'Fatou Sow',       email:'fatou.sow@gmail.com',   country:'🇫🇷 France',   type:'Titre de séjour',submitted:'Il y a 1j',  status:'pending'   },
  { id:4, ref:'KYC-088', name:'Koffi Mensah',    email:'koffi.m@email.com',     country:'🇩🇪 Allemagne',type:'Passeport',      submitted:'Il y a 1j',  status:'pending'   },
  { id:5, ref:'KYC-087', name:'Aminata Kouyaté', email:'aminata.k@outlook.com', country:'🇫🇷 France',   type:'Passeport',      submitted:'Il y a 1j',  status:'pending'   },
  { id:6, ref:'KYC-086', name:'Aisha Koné',      email:'aisha.kone@email.com',  country:'🇫🇷 France',   type:'CNI',            submitted:'Il y a 3j',  status:'validated' },
  { id:7, ref:'KYC-085', name:'Jean-Paul Koffi', email:'jpkoffi@email.com',     country:'🇩🇪 Allemagne',type:'Passeport',      submitted:'Il y a 4j',  status:'validated' },
  { id:8, ref:'KYC-084', name:'Amina Soumaré',   email:'amina.s@outlook.com',   country:'🇫🇷 France',   type:'CNI',            submitted:'Il y a 5j',  status:'rejected'  },
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
// ── Configs statuts ────────────────────────────────────────────────
const KYC_STYLE   = {
  validated: { bg:'rgba(30,58,47,0.08)',   color:'#1E3A2F', label:'✓ Validé'     },
  pending:   { bg:'rgba(184,151,42,0.1)',  color:'#8B6E1A', label:'⏳ En attente' },
  rejected:  { bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'✗ Rejeté'     },
}
const USER_STATUS = {
  active:    { bg:'rgba(30,58,47,0.08)',  color:'#1E3A2F', label:'Actif'    },
  suspended: { bg:'rgba(192,57,43,0.08)',color:'#C0392B', label:'Suspendu' },
}
const TX_STATUS = {
  confirmed: { bg:'rgba(30,58,47,0.08)',   color:'#1E3A2F', label:'✓ Confirmé'   },
  pending:   { bg:'rgba(184,151,42,0.1)',  color:'#8B6E1A', label:'⏳ En attente' },
  failed:    { bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'✗ Échoué'     },
  refunded:  { bg:'rgba(100,116,139,0.08)',color:'#64748B', label:'↩ Remboursé'  },
}
const TX_METHOD = {
  'MTN MoMo':   { bg:'#FFCC00', color:'#1A1A1A' },
  'Moov Money': { bg:'#0056A2', color:'#fff'     },
  'Stripe':     { bg:'#635BFF', color:'#fff'     },
  'Paystack':   { bg:'#00C3F7', color:'#fff'     },
}
const TERRAIN_STATUS = {
  published: { bg:'rgba(30,58,47,0.08)',   color:'#1E3A2F', label:'🟢 Publié'    },
  draft:     { bg:'rgba(184,151,42,0.1)',  color:'#8B6E1A', label:'📝 Brouillon' },
  full:      { bg:'rgba(30,58,47,0.15)',   color:'#1E3A2F', label:'✅ Complet'   },
  archived:  { bg:'rgba(100,116,139,0.08)',color:'#64748B', label:'📦 Archivé'   },
}

// ── Bouton icône réutilisable ───────────────────────────────────────
function IcoBtn({ icon, color = '#1E3A2F', bg = 'rgba(30,58,47,0.07)', title, onClick }) {
  return (
    <button title={title} onClick={onClick} style={{
      width:28, height:28, borderRadius:7,
      background:bg, border:`1px solid ${bg}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      cursor:'pointer', color, transition:'all 0.15s',
      flexShrink:0,
    }}
    onMouseEnter={e => e.currentTarget.style.opacity='0.75'}
    onMouseLeave={e => e.currentTarget.style.opacity='1'}>
      {icon}
    </button>
  )
}

// ── KPI card commune ────────────────────────────────────────────────
function AdminKpi({ label, value, color }) {
  return (
    <div style={{
      background:'#fff', borderRadius:12, padding:'14px 16px',
      boxShadow:'0 1px 6px rgba(30,58,47,0.05)',
      border:'1px solid rgba(30,58,47,0.05)',
      borderTop:`3px solid ${color}`,
    }}>
      <p style={{ fontSize:'0.62rem', color:'#8C8278', margin:'0 0 4px',
                   textTransform:'uppercase', letterSpacing:'0.06em' }}>
        {label}
      </p>
      <p style={{ fontFamily:"'Playfair Display', serif",
                   fontSize:'1.3rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SECTION UTILISATEURS
// ─────────────────────────────────────────────────────────────────
function UsersPage() {
  const [search,     setSearch]     = useState('')
  const [filterKyc,  setFilterKyc]  = useState('all')
  const [filterStat, setFilterStat] = useState('all')
  const [users,      setUsers]       = useState(USERS_DATA)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.ref.toLowerCase().includes(q))
      && (filterKyc  === 'all' || u.kyc    === filterKyc)
      && (filterStat === 'all' || u.status === filterStat)
  })

  const toggleSuspend = id =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status==='active' ? 'suspended' : 'active' } : u))

  const inputStyle = {
    border:'none', background:'transparent', fontSize:'0.78rem',
    color:'#4A3F35', outline:'none', width:'100%',
    fontFamily:"'DM Sans', sans-serif",
  }
  const selectStyle = {
    padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)',
    background:'#fff', fontSize:'0.75rem', color:'#4A3F35',
    cursor:'pointer', outline:'none', fontFamily:"'DM Sans', sans-serif",
  }

  return (
    <div>
      {/* Header section */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>
            Gestion des Utilisateurs
          </h2>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{users.length} comptes enregistrés</p>
        </div>
        <button style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'7px 14px', borderRadius:8,
          background:'#1E3A2F', color:'#F5F0E8',
          border:'none', fontSize:'0.75rem', fontWeight:600,
          cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
        }}>
          ⬇ Exporter CSV
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="Total"       value={users.length}                               color="#1E3A2F" />
        <AdminKpi label="KYC validés" value={users.filter(u=>u.kyc==='validated').length} color="#1E3A2F" />
        <AdminKpi label="En attente"  value={users.filter(u=>u.kyc==='pending').length}   color="#8B6E1A" />
        <AdminKpi label="Suspendus"   value={users.filter(u=>u.status==='suspended').length} color="#C0392B" />
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background:'#fff', border:'1px solid rgba(30,58,47,0.12)',
          borderRadius:8, padding:'7px 12px', flex:1, minWidth:200,
        }}>
          <span style={{ fontSize:'0.8rem', color:'#8C8278' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Rechercher un utilisateur..." style={inputStyle} />
        </div>
        <select value={filterKyc} onChange={e=>setFilterKyc(e.target.value)} style={selectStyle}>
          <option value="all">Tous les KYC</option>
          <option value="validated">KYC Validé</option>
          <option value="pending">KYC En attente</option>
          <option value="rejected">KYC Rejeté</option>
        </select>
        <select value={filterStat} onChange={e=>setFilterStat(e.target.value)} style={selectStyle}>
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>

      {/* Tableau */}
      <div style={{ background:'#fff', borderRadius:14, overflow:'hidden',
                     boxShadow:'0 2px 10px rgba(30,58,47,0.05)',
                     border:'1px solid rgba(30,58,47,0.06)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAF7' }}>
                {['Réf.','Utilisateur','Pays','m²','Investi','KYC','Statut','Inscrit','Actions'].map(h => (
                  <th key={h} style={{
                    padding:'10px 14px', textAlign:'left',
                    fontSize:'0.62rem', fontWeight:700, color:'#8C8278',
                    textTransform:'uppercase', letterSpacing:'0.06em',
                    borderBottom:'1px solid rgba(30,58,47,0.06)', whiteSpace:'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const kyc  = KYC_STYLE[user.kyc]    || KYC_STYLE.pending
                const stat = USER_STATUS[user.status] || USER_STATUS.active
                return (
                  <tr key={user.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(245,240,232,0.5)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{ transition:'background 0.15s' }}>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#1E3A2F', fontWeight:600 }}>{user.ref}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{
                          width:30, height:30, borderRadius:'50%',
                          background:`hsl(${(user.id*47)%360},40%,35%)`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'0.6rem', fontWeight:700, color:'#F5F0E8', flexShrink:0,
                        }}>
                          {user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p style={{ fontSize:'0.78rem', fontWeight:600, color:'#1A1A1A', margin:'0 0 1px' }}>{user.name}</p>
                          <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:0 }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.75rem', color:'#4A3F35' }}>{user.country}</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.78rem', fontWeight:700, color:'#1A1A1A' }}>{user.sqm} m²</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily:"'Playfair Display', serif", fontSize:'0.8rem', fontWeight:700, color:'#1E3A2F' }}>
                        {user.invested.toLocaleString('fr-FR')} F
                      </span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ padding:'3px 9px', borderRadius:20, background:kyc.bg, color:kyc.color, fontSize:'0.65rem', fontWeight:600, whiteSpace:'nowrap' }}>{kyc.label}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ padding:'3px 9px', borderRadius:20, background:stat.bg, color:stat.color, fontSize:'0.65rem', fontWeight:600 }}>{stat.label}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.7rem', color:'#8C8278', whiteSpace:'nowrap' }}>{user.joined}</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <IcoBtn icon="👁" title="Voir" />
                        <IcoBtn
                          icon={user.status==='active' ? '✕' : '✓'}
                          title={user.status==='active' ? 'Suspendre' : 'Réactiver'}
                          color={user.status==='active' ? '#C0392B' : '#1E3A2F'}
                          bg={user.status==='active' ? 'rgba(192,57,43,0.08)' : 'rgba(30,58,47,0.08)'}
                          onClick={() => toggleSuspend(user.id)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 16px', borderTop:'1px solid rgba(30,58,47,0.06)',
                       display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>
            {filtered.length} sur {users.length} utilisateur(s)
          </p>
          <div style={{ display:'flex', gap:6 }}>
            {['←','1','2','3','→'].map(p => (
              <button key={p} style={{
                width:28, height:28, borderRadius:6,
                border:'1px solid rgba(30,58,47,0.12)',
                background: p==='1' ? '#1E3A2F' : '#fff',
                color: p==='1' ? '#F5F0E8' : '#4A3F35',
                fontSize:'0.7rem', cursor:'pointer',
                fontFamily:"'DM Sans', sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SECTION TERRAINS
// ─────────────────────────────────────────────────────────────────
function TerrainsPage() {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [terrains, setTerrains] = useState(TERRAINS_DATA)
  const [showForm, setShowForm] = useState(false)

  const filtered = terrains.filter(t => {
    const q = search.toLowerCase()
    return (t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q))
      && (filter === 'all' || t.status === filter)
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>
            Gestion des Terrains
          </h2>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{terrains.length} terrains enregistrés</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'7px 14px', borderRadius:8,
          background:'#1E3A2F', color:'#F5F0E8',
          border:'none', fontSize:'0.75rem', fontWeight:600,
          cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
        }}>
          + Nouveau terrain
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="Total terrains"  value={terrains.length}                                  color="#1E3A2F" />
        <AdminKpi label="Publiés"          value={terrains.filter(t=>t.status==='published').length} color="#1E3A2F" />
        <AdminKpi label="m² total gérés"   value={terrains.reduce((s,t)=>s+t.totalSqm,0).toLocaleString()} color="#B8972A" />
        <AdminKpi label="Revenus générés"  value={`${(terrains.reduce((s,t)=>s+t.revenue,0)/1000000).toFixed(1)}M F`} color="#1E3A2F" />
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background:'#fff', border:'1px solid rgba(30,58,47,0.12)',
          borderRadius:8, padding:'7px 12px', flex:1, minWidth:200,
        }}>
          <span style={{ fontSize:'0.8rem', color:'#8C8278' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Rechercher un terrain..."
                 style={{ border:'none', background:'transparent', fontSize:'0.78rem',
                           color:'#4A3F35', outline:'none', width:'100%',
                           fontFamily:"'DM Sans', sans-serif" }} />
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}
                style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)',
                          background:'#fff', fontSize:'0.75rem', color:'#4A3F35',
                          cursor:'pointer', outline:'none', fontFamily:"'DM Sans', sans-serif" }}>
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
          <option value="full">Complets</option>
        </select>
      </div>

      {/* Grille */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px,1fr))', gap:14 }}>
        {filtered.map(terrain => {
          const progress = Math.round((terrain.soldSqm / terrain.totalSqm) * 100)
          const cfg = TERRAIN_STATUS[terrain.status] || TERRAIN_STATUS.draft
          return (
            <div key={terrain.id} style={{
              background:'#fff', borderRadius:14, overflow:'hidden',
              boxShadow:'0 2px 10px rgba(30,58,47,0.06)',
              border:'1px solid rgba(30,58,47,0.06)', transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow='0 6px 24px rgba(30,58,47,0.12)'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 10px rgba(30,58,47,0.06)'; e.currentTarget.style.transform='translateY(0)' }}>
              {/* Vignette */}
              <div style={{
                height:90, background:'linear-gradient(135deg, #1E3A2F, #2D5241, #B8972A)',
                position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ fontSize:'2rem', opacity:0.35 }}>🏡</span>
                <span style={{
                  position:'absolute', top:8, right:8,
                  padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600,
                  background:cfg.bg, color:cfg.color,
                }}>{cfg.label}</span>
              </div>
              <div style={{ padding:'14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontFamily:'monospace', fontSize:'0.65rem', color:'#8C8278', fontWeight:600 }}>{terrain.ref}</span>
                  <span style={{ fontSize:'0.65rem', color:'#8C8278' }}>📍 {terrain.city}</span>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'0.88rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 10px' }}>{terrain.name}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5, marginBottom:10 }}>
                  {[
                    { label:'m² total',      value:terrain.totalSqm.toLocaleString() },
                    { label:'Prix/m²',        value:`${terrain.price.toLocaleString()} F` },
                    { label:'Investisseurs',  value:terrain.investors },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background:'#F5F0E8', borderRadius:7, padding:'5px 7px', textAlign:'center' }}>
                      <p style={{ fontSize:'0.56rem', color:'#8C8278', margin:'0 0 1px' }}>{label}</p>
                      <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{value}</p>
                    </div>
                  ))}
                </div>
                {/* Progress */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.62rem', color:'#8C8278', marginBottom:4 }}>
                    <span>{terrain.soldSqm.toLocaleString()} m² vendus</span>
                    <span style={{ fontWeight:600, color:'#1E3A2F' }}>{progress}%</span>
                  </div>
                  <div style={{ height:5, background:'#EDE6D6', borderRadius:3, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:3, width:`${progress}%`,
                      background: progress>=100 ? 'linear-gradient(90deg,#B8972A,#D4AD3A)' : 'linear-gradient(90deg,#1E3A2F,#3D6B53)',
                    }} />
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display:'flex', gap:6 }}>
                  <button style={{
                    flex:1, padding:'6px', borderRadius:8, border:'none',
                    background:'rgba(30,58,47,0.07)', color:'#1E3A2F',
                    fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                    fontFamily:"'DM Sans', sans-serif",
                  }}>👁 Voir</button>
                  <button style={{
                    flex:1, padding:'6px', borderRadius:8, border:'none',
                    background:'rgba(30,58,47,0.07)', color:'#1E3A2F',
                    fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                    fontFamily:"'DM Sans', sans-serif",
                  }}>✏ Éditer</button>
                  {terrain.status === 'draft' && (
                    <button style={{
                      flex:1, padding:'6px', borderRadius:8, border:'none',
                      background:'#1E3A2F', color:'#F5F0E8',
                      fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                      fontFamily:"'DM Sans', sans-serif",
                    }}>✓ Publier</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal nouveau terrain */}
      {showForm && (
        <div style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background:'#fff', borderRadius:16, padding:24, width:'100%', maxWidth:480,
            boxShadow:'0 24px 60px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>
                Nouveau terrain
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#8C8278', fontSize:'1.1rem' }}>✕</button>
            </div>
            {[
              { label:'Nom du terrain *',        placeholder:'Ex: Calavi Nord — Lot 15', type:'text'   },
              { label:'Ville *',                  placeholder:'Ex: Abomey-Calavi',        type:'text'   },
              { label:'Superficie totale (m²) *', placeholder:'Ex: 1000',                type:'number' },
              { label:'Prix par m² (FCFA) *',     placeholder:'Ex: 15000',               type:'number' },
            ].map(({ label, placeholder, type }) => (
              <div key={label} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#4A3F35', marginBottom:4 }}>{label}</label>
                <input type={type} placeholder={placeholder} style={{
                  width:'100%', padding:'9px 12px', borderRadius:9,
                  border:'1.5px solid rgba(30,58,47,0.15)',
                  fontSize:'0.82rem', color:'#1A1A1A', outline:'none',
                  fontFamily:"'DM Sans', sans-serif",
                  background:'rgba(245,240,232,0.4)', boxSizing:'border-box',
                }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              <button onClick={() => setShowForm(false)} style={{
                flex:1, padding:'10px', borderRadius:9,
                border:'1.5px solid rgba(30,58,47,0.2)', background:'transparent',
                color:'#1E3A2F', fontSize:'0.8rem', fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans', sans-serif",
              }}>Annuler</button>
              <button style={{
                flex:1, padding:'10px', borderRadius:9, border:'none',
                background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
                color:'#F5F0E8', fontSize:'0.8rem', fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans', sans-serif",
              }}>Créer le terrain</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SECTION TRANSACTIONS
// ─────────────────────────────────────────────────────────────────
function TransactionsPage() {
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')

  const filtered = TRANSACTIONS_DATA.filter(tx => {
    const q = search.toLowerCase()
    return (tx.ref.toLowerCase().includes(q) || tx.user.toLowerCase().includes(q) || tx.terrain.toLowerCase().includes(q))
      && (filterStatus === 'all' || tx.status === filterStatus)
      && (filterMethod === 'all' || tx.method === filterMethod)
  })

  const totalRevenue = TRANSACTIONS_DATA.filter(tx=>tx.status==='confirmed').reduce((s,tx)=>s+tx.amount,0)

  const selectStyle = {
    padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)',
    background:'#fff', fontSize:'0.75rem', color:'#4A3F35',
    cursor:'pointer', outline:'none', fontFamily:"'DM Sans', sans-serif",
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>
            Gestion des Transactions
          </h2>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{TRANSACTIONS_DATA.length} transactions enregistrées</p>
        </div>
        <button style={{
          display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8,
          background:'#1E3A2F', color:'#F5F0E8', border:'none',
          fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
        }}>⬇ Exporter CSV</button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="Revenus confirmés"  value={`${(totalRevenue/1000).toFixed(0)}K F`} color="#1E3A2F" />
        <AdminKpi label="Total transactions" value={TRANSACTIONS_DATA.length}                color="#1E3A2F" />
        <AdminKpi label="En attente"         value={TRANSACTIONS_DATA.filter(t=>t.status==='pending').length} color="#8B6E1A" />
        <AdminKpi label="Échouées"           value={TRANSACTIONS_DATA.filter(t=>t.status==='failed').length}  color="#C0392B" />
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background:'#fff', border:'1px solid rgba(30,58,47,0.12)',
          borderRadius:8, padding:'7px 12px', flex:1, minWidth:200,
        }}>
          <span style={{ fontSize:'0.8rem', color:'#8C8278' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Réf., utilisateur, terrain..."
                 style={{ border:'none', background:'transparent', fontSize:'0.78rem',
                           color:'#4A3F35', outline:'none', width:'100%',
                           fontFamily:"'DM Sans', sans-serif" }} />
        </div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="all">Tous les statuts</option>
          <option value="confirmed">Confirmé</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
          <option value="refunded">Remboursé</option>
        </select>
        <select value={filterMethod} onChange={e=>setFilterMethod(e.target.value)} style={selectStyle}>
          <option value="all">Tous les modes</option>
          <option value="MTN MoMo">MTN MoMo</option>
          <option value="Moov Money">Moov Money</option>
          <option value="Stripe">Stripe</option>
          <option value="Paystack">Paystack</option>
        </select>
      </div>

      {/* Tableau */}
      <div style={{ background:'#fff', borderRadius:14, overflow:'hidden',
                     boxShadow:'0 2px 10px rgba(30,58,47,0.05)', border:'1px solid rgba(30,58,47,0.06)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAF7' }}>
                {['Réf.','Investisseur','Terrain','m²','Montant','Mode','Statut','Date','Actions'].map(h => (
                  <th key={h} style={{
                    padding:'10px 14px', textAlign:'left',
                    fontSize:'0.62rem', fontWeight:700, color:'#8C8278',
                    textTransform:'uppercase', letterSpacing:'0.06em',
                    borderBottom:'1px solid rgba(30,58,47,0.06)', whiteSpace:'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => {
                const sc = TX_STATUS[tx.status] || TX_STATUS.pending
                const mc = TX_METHOD[tx.method] || { bg:'#E2E8F0', color:'#4A3F35' }
                return (
                  <tr key={tx.id}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(245,240,232,0.5)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      style={{ transition:'background 0.15s', cursor:'pointer' }}>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#1E3A2F', fontWeight:600 }}>{tx.ref}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{
                          width:28, height:28, borderRadius:'50%',
                          background:`hsl(${(tx.id*53)%360},40%,35%)`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'0.58rem', fontWeight:700, color:'#F5F0E8', flexShrink:0,
                        }}>
                          {tx.user.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#1A1A1A' }}>{tx.user}</span>
                      </div>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.75rem', color:'#4A3F35' }}>{tx.terrain}</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.78rem', fontWeight:700, color:'#1A1A1A' }}>{tx.sqm} m²</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily:"'Playfair Display', serif", fontSize:'0.82rem', fontWeight:700, color:'#1E3A2F' }}>
                        {tx.amount.toLocaleString('fr-FR')} F
                      </span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ padding:'3px 9px', borderRadius:5, fontSize:'0.62rem', fontWeight:800, background:mc.bg, color:mc.color }}>{tx.method}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.65rem', fontWeight:600, background:sc.bg, color:sc.color, whiteSpace:'nowrap' }}>{sc.label}</span>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <p style={{ fontSize:'0.7rem', color:'#4A3F35', margin:0, whiteSpace:'nowrap' }}>{tx.date}</p>
                      <p style={{ fontSize:'0.62rem', color:'#8C8278', margin:0 }}>{tx.time}</p>
                    </td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <IcoBtn icon="👁" title="Voir détails" />
                        {tx.status === 'pending' && <IcoBtn icon="✓" title="Valider" />}
                        {tx.status === 'failed'  && <IcoBtn icon="⚠" title="Intervenir" color="#C0392B" bg="rgba(192,57,43,0.08)" />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 16px', borderTop:'1px solid rgba(30,58,47,0.06)',
                       display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>
            {filtered.length} sur {TRANSACTIONS_DATA.length} transaction(s)
          </p>
          <div style={{ display:'flex', gap:6 }}>
            {['←','1','2','→'].map(p => (
              <button key={p} style={{
                width:28, height:28, borderRadius:6,
                border:'1px solid rgba(30,58,47,0.12)',
                background: p==='1' ? '#1E3A2F' : '#fff',
                color: p==='1' ? '#F5F0E8' : '#4A3F35',
                fontSize:'0.7rem', cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SECTION KYC
// ─────────────────────────────────────────────────────────────────
function KycPage() {
  const [filter,   setFilter]   = useState('pending')
  const [dossiers, setDossiers] = useState(KYC_DATA)
  const [selected, setSelected] = useState(null)
  const [rejectNote, setRejectNote] = useState('')

  const pending   = dossiers.filter(d=>d.status==='pending').length
  const validated = dossiers.filter(d=>d.status==='validated').length
  const rejected  = dossiers.filter(d=>d.status==='rejected').length

  const filtered = filter === 'all' ? dossiers : dossiers.filter(d => d.status === filter)

  const handleValidate = id => {
    setDossiers(p => p.map(d => d.id===id ? {...d, status:'validated'} : d))
    if (selected?.id === id) setSelected(s => ({...s, status:'validated'}))
  }
  const handleReject = id => {
    setDossiers(p => p.map(d => d.id===id ? {...d, status:'rejected'} : d))
    if (selected?.id === id) setSelected(s => ({...s, status:'rejected'}))
    setRejectNote('')
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>
          Gestion KYC
        </h2>
        <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>
          {pending} dossier(s) en attente de validation
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="En attente" value={pending}   color="#8B6E1A" />
        <AdminKpi label="Validés"    value={validated} color="#1E3A2F" />
        <AdminKpi label="Rejetés"    value={rejected}  color="#C0392B" />
      </div>

      {/* Layout liste + détail */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, alignItems:'start' }}>
        {/* Liste */}
        <div>
          {/* Tabs */}
          <div style={{
            display:'flex', background:'#fff', borderRadius:10, padding:4,
            gap:3, marginBottom:14, width:'fit-content',
            border:'1px solid rgba(30,58,47,0.08)',
          }}>
            {[
              { id:'pending',   label:`En attente (${pending})`  },
              { id:'validated', label:`Validés (${validated})`   },
              { id:'rejected',  label:`Rejetés (${rejected})`    },
              { id:'all',       label:'Tous'                      },
            ].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer',
                background: filter===tab.id ? '#1E3A2F' : 'transparent',
                color: filter===tab.id ? '#F5F0E8' : '#8C8278',
                fontSize:'0.72rem', fontWeight:600,
                fontFamily:"'DM Sans', sans-serif", transition:'all 0.2s',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(d => (
              <div key={d.id} onClick={() => setSelected(d)} style={{
                background: selected?.id===d.id ? 'rgba(30,58,47,0.04)' : '#fff',
                borderRadius:12, padding:'14px 16px',
                border:`1.5px solid ${selected?.id===d.id ? '#1E3A2F' : 'rgba(30,58,47,0.07)'}`,
                cursor:'pointer', transition:'all 0.18s',
                display:'flex', alignItems:'center', gap:12,
              }}
              onMouseEnter={e => { if(selected?.id!==d.id) { e.currentTarget.style.borderColor='rgba(30,58,47,0.2)' }}}
              onMouseLeave={e => { if(selected?.id!==d.id) { e.currentTarget.style.borderColor='rgba(30,58,47,0.07)' }}}>
                <div style={{
                  width:38, height:38, borderRadius:'50%', flexShrink:0,
                  background:`hsl(${(d.id*67)%360},40%,35%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.65rem', fontWeight:700, color:'#F5F0E8',
                }}>
                  {d.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                    <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#1A1A1A', margin:0 }}>{d.name}</p>
                    <span style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#8C8278' }}>{d.ref}</span>
                  </div>
                  <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>
                    {d.country} · {d.type} · {d.submitted}
                  </p>
                </div>
                <span style={{
                  padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600, whiteSpace:'nowrap',
                  background: d.status==='pending' ? 'rgba(184,151,42,0.1)' : d.status==='validated' ? 'rgba(30,58,47,0.08)' : 'rgba(192,57,43,0.08)',
                  color: d.status==='pending' ? '#8B6E1A' : d.status==='validated' ? '#1E3A2F' : '#C0392B',
                }}>
                  {d.status==='pending' ? '⏳ Attente' : d.status==='validated' ? '✓ Validé' : '✗ Rejeté'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau détail */}
        {selected ? (
          <div style={{
            background:'#fff', borderRadius:14, overflow:'hidden',
            boxShadow:'0 4px 20px rgba(30,58,47,0.08)',
            border:'1px solid rgba(30,58,47,0.08)',
          }}>
            <div style={{
              background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
              padding:'16px 18px',
              display:'flex', justifyContent:'space-between', alignItems:'flex-start',
            }}>
              <div>
                <p style={{ fontSize:'0.6rem', color:'rgba(245,240,232,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 3px' }}>
                  Dossier KYC · {selected.ref}
                </p>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1rem', fontWeight:700, color:'#F5F0E8', margin:0 }}>
                  {selected.name}
                </h3>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background:'rgba(245,240,232,0.1)', border:'1px solid rgba(245,240,232,0.15)',
                borderRadius:7, width:26, height:26, display:'flex', alignItems:'center',
                justifyContent:'center', cursor:'pointer', color:'rgba(245,240,232,0.7)',
                fontSize:'0.8rem',
              }}>✕</button>
            </div>
            <div style={{ padding:16 }}>
              {[
                { label:'Email',    value:selected.email    },
                { label:'Pays',     value:selected.country  },
                { label:'Document', value:selected.type     },
                { label:'Soumis',   value:selected.submitted},
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display:'flex', justifyContent:'space-between',
                  padding:'7px 0', fontSize:'0.75rem',
                  borderBottom:'1px solid rgba(30,58,47,0.05)',
                }}>
                  <span style={{ color:'#8C8278' }}>{label}</span>
                  <span style={{ fontWeight:600, color:'#1A1A1A', textAlign:'right', maxWidth:'60%' }}>{value}</span>
                </div>
              ))}
              {/* Preview doc */}
              <div style={{
                marginTop:14, background:'#F5F0E8', borderRadius:10, padding:20,
                textAlign:'center', border:'2px dashed rgba(30,58,47,0.15)',
              }}>
                <span style={{ fontSize:'2.5rem', display:'block', marginBottom:6 }}>🪪</span>
                <p style={{ fontSize:'0.72rem', fontWeight:600, color:'#1E3A2F', margin:'0 0 2px' }}>{selected.type}</p>
                <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:'0 0 12px' }}>Document uploadé</p>
                <button style={{
                  padding:'6px 14px', borderRadius:7, border:'none',
                  background:'#1E3A2F', color:'#F5F0E8',
                  fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                  fontFamily:"'DM Sans', sans-serif",
                  display:'inline-flex', alignItems:'center', gap:5,
                }}>👁 Voir le document</button>
              </div>
              {/* Actions si pending */}
              {selected.status === 'pending' && (
                <div style={{ marginTop:14 }}>
                  <textarea
                    value={rejectNote} onChange={e=>setRejectNote(e.target.value)}
                    placeholder="Note de rejet (optionnel)..." rows={2}
                    style={{
                      width:'100%', padding:'9px 12px', borderRadius:9,
                      border:'1.5px solid rgba(30,58,47,0.15)',
                      fontSize:'0.75rem', color:'#4A3F35', outline:'none',
                      resize:'none', marginBottom:10,
                      fontFamily:"'DM Sans', sans-serif",
                      background:'rgba(245,240,232,0.4)', boxSizing:'border-box',
                    }}
                  />
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handleReject(selected.id)} style={{
                      flex:1, padding:'9px', borderRadius:9,
                      background:'rgba(192,57,43,0.08)', border:'1.5px solid rgba(192,57,43,0.2)',
                      color:'#C0392B', fontSize:'0.78rem', fontWeight:600,
                      cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
                    }}>✗ Rejeter</button>
                    <button onClick={() => handleValidate(selected.id)} style={{
                      flex:1, padding:'9px', borderRadius:9, border:'none',
                      background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
                      color:'#F5F0E8', fontSize:'0.78rem', fontWeight:600,
                      cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
                    }}>✓ Valider</button>
                  </div>
                </div>
              )}
              {selected.status === 'validated' && (
                <div style={{ marginTop:14, background:'rgba(30,58,47,0.05)', border:'1px solid rgba(30,58,47,0.1)', borderRadius:10, padding:12, textAlign:'center' }}>
                  <p style={{ fontSize:'0.78rem', fontWeight:600, color:'#1E3A2F', margin:0 }}>✓ KYC validé — Compte actif</p>
                </div>
              )}
              {selected.status === 'rejected' && (
                <div style={{ marginTop:14, background:'rgba(192,57,43,0.05)', border:'1px solid rgba(192,57,43,0.12)', borderRadius:10, padding:12, textAlign:'center' }}>
                  <p style={{ fontSize:'0.78rem', fontWeight:600, color:'#C0392B', margin:0 }}>✗ KYC rejeté</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            background:'#fff', borderRadius:14, padding:32,
            textAlign:'center', border:'1px solid rgba(30,58,47,0.06)',
          }}>
            <span style={{ fontSize:'3rem', display:'block', marginBottom:12 }}>👈</span>
            <p style={{ fontSize:'0.8rem', color:'#8C8278', margin:0 }}>
              Sélectionnez un dossier pour voir les détails
            </p>
          </div>
        )}
      </div>
    </div>
  )
}




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
             {active === 'dashboard'    && <DashboardPage isMobile={isMobile} />}
             <p style={{color:'red', fontSize:'0.8rem'}}>active = "{active}"</p>
             {active === 'users' && <UsersPage />}
             {active === 'terrains'     && <TerrainsPage />}
             {active === 'transactions' && <TransactionsPage />}
             {active === 'kyc'          && <KycPage />}
             {active === 'statistiques' && <PlaceholderPage emoji="📊" label="Statistiques & Rapports" />}
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