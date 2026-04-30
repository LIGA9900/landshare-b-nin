// ═══════════════════════════════════════════════════════════════════
// Dashboard.jsx — Espace Investisseur · LandShare Bénin
// Design : Sidebar premium · Widgets animés · Graphiques · Niveau startup
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

// ─── Charger les polices ───────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])
}

// ─── Hook compteur animé ───────────────────────────────────────────
function useCountUp(target, duration = 1800, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, trigger])
  return val
}

// ─── Hook InView ───────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref  = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

// ═══════════════════════════════════════════════════════════════════
// DATA — données simulées (seront remplacées par l'API)
// ═══════════════════════════════════════════════════════════════════
const portfolioData = [
  { month: 'Nov', value: 45000  },
  { month: 'Déc', value: 52000  },
  { month: 'Jan', value: 49000  },
  { month: 'Fév', value: 61000  },
  { month: 'Mar', value: 58000  },
  { month: 'Avr', value: 75000  },
  { month: 'Mai', value: 82000  },
  { month: 'Jun', value: 79000  },
  { month: 'Jul', value: 91000  },
  { month: 'Aoû', value: 88000  },
  { month: 'Sep', value: 103000 },
  { month: 'Oct', value: 118500 },
]

const transactions = [
  { id: 'LS-0042', terrain: 'Calavi Nord',    sqm: 5,  amount: 77250,  status: 'confirmed', date: '28 Oct 2025', method: 'MTN MoMo'  },
  { id: 'LS-0039', terrain: 'Fidjrossè',      sqm: 10, amount: 154500, status: 'confirmed', date: '15 Oct 2025', method: 'Stripe'    },
  { id: 'LS-0031', terrain: 'Parakou Nord',   sqm: 3,  amount: 25500,  status: 'confirmed', date: '02 Oct 2025', method: 'Moov Money'},
  { id: 'LS-0028', terrain: 'Calavi Nord',    sqm: 8,  amount: 123600, status: 'confirmed', date: '20 Sep 2025', method: 'MTN MoMo'  },
  { id: 'LS-0019', terrain: 'Porto-Novo Est', sqm: 4,  amount: 52000,  status: 'pending',   date: '10 Sep 2025', method: 'MTN MoMo'  },
]

const investments = [
  {
    id: 1, name: 'Calavi Nord',
    location: 'Abomey-Calavi, Atlantique',
    sqm: 13, pricePaid: 195000, currentValue: 213000,
    roi: 9.2, progress: 68,
    gradient: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
    date: '28 Oct 2025',
  },
  {
    id: 2, name: 'Fidjrossè',
    location: 'Cotonou, Littoral',
    sqm: 10, pricePaid: 154500, currentValue: 178000,
    roi: 15.2, progress: 91,
    gradient: 'linear-gradient(135deg, #2D5241, #B8972A)',
    date: '15 Oct 2025',
  },
  {
    id: 3, name: 'Parakou Nord',
    location: 'Parakou, Borgou',
    sqm: 3, pricePaid: 25500, currentValue: 27800,
    roi: 9.0, progress: 32,
    gradient: 'linear-gradient(135deg, #3D6B53, #1E3A2F)',
    date: '02 Oct 2025',
  },
]

const notifications = [
  { id: 1, icon: '📈', text: 'Calavi Nord a gagné +3.2% ce mois', time: 'Il y a 2h',  read: false },
  { id: 2, icon: '✅', text: 'Votre transaction LS-0042 est confirmée', time: 'Il y a 1j', read: false },
  { id: 3, icon: '🏡', text: 'Nouveau terrain disponible à Porto-Novo', time: 'Il y a 2j', read: true  },
  { id: 4, icon: '📄', text: 'Attestation LS-0039 disponible au téléchargement', time: 'Il y a 3j', read: true  },
]

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Sidebar
// ═══════════════════════════════════════════════════════════════════
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const navigate = useNavigate()

  const navItems = [
    { id: 'dashboard',    label: 'Tableau de bord', icon: GridIcon    },
    { id: 'terrains',     label: 'Terrains',        icon: MapIcon     },
    { id: 'portefeuille', label: 'Portefeuille',    icon: WalletIcon  },
    { id: 'historique',   label: 'Historique',      icon: ClockIcon   },
    { id: 'documents',    label: 'Documents',       icon: FileIcon    },
    { id: 'notifications',label: 'Notifications',   icon: BellIcon    },
  ]

  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      background: '#111810',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
      flexShrink: 0, overflow: 'hidden',
      position: 'relative', zIndex: 10,
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: collapsed ? '24px 20px' : '24px 24px',
        borderBottom: '1px solid rgba(245,240,232,0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10,
      }}>
        {!collapsed && (
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 9,
            textDecoration: 'none',
          }}>
            <div style={{
              width: 32, height: 32, background: '#1E3A2F',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <div style={{
                width: 13, height: 13, background: '#B8972A',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }} />
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.05rem', fontWeight: 700, color: '#F5F0E8',
              whiteSpace: 'nowrap',
            }}>
              Land<span style={{ color: '#B8972A' }}>Share</span>
            </span>
          </Link>
        )}

        {/* Bouton collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(245,240,232,0.06)',
            border: '1px solid rgba(245,240,232,0.1)',
            borderRadius: 8, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(245,240,232,0.5)',
            transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,232,0.12)'; e.currentTarget.style.color = '#F5F0E8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,240,232,0.06)'; e.currentTarget.style.color = 'rgba(245,240,232,0.5)' }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* ── Navigation principale ── */}
      <nav style={{ flex: 1, padding: '12px 10px', overflow: 'hidden' }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              title={collapsed ? label : ''}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '10px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive
                  ? 'rgba(184,151,42,0.12)'
                  : 'transparent',
                borderLeft: isActive
                  ? '2px solid #B8972A'
                  : '2px solid transparent',
                color: isActive ? '#D4AD3A' : 'rgba(245,240,232,0.5)',
                transition: 'all 0.2s', marginBottom: 2,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(245,240,232,0.05)'
                  e.currentTarget.style.color = '#F5F0E8'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(245,240,232,0.5)'
                }
              }}
            >
              <Icon size={18} />
              {!collapsed && (
                <span style={{
                  fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </span>
              )}
              {/* Badge notification */}
              {id === 'notifications' && !collapsed && (
                <span style={{
                  marginLeft: 'auto', background: '#B8972A',
                  color: '#111810', fontSize: '0.65rem', fontWeight: 700,
                  borderRadius: 20, padding: '1px 6px', minWidth: 18,
                  textAlign: 'center',
                }}>
                  2
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Carte KYC ── */}
      {!collapsed && (
        <div style={{
          margin: '0 10px 12px',
          background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
          borderRadius: 12, padding: '14px',
          border: '1px solid rgba(184,151,42,0.2)',
        }}>
          <p style={{ fontSize: '0.72rem', color: '#D4AD3A', fontWeight: 600,
                       margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            KYC Vérifié ✓
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.6)', margin: 0, lineHeight: 1.4 }}>
            Votre identité est confirmée. Vous pouvez investir librement.
          </p>
        </div>
      )}

      {/* ── User + Logout ── */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid rgba(245,240,232,0.06)',
        display: 'flex', alignItems: 'center',
        gap: 10, justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A2F, #B8972A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.72rem', fontWeight: 700, color: '#F5F0E8',
          flexShrink: 0, cursor: 'pointer',
        }}>
          FL
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F5F0E8',
                           margin: 0, whiteSpace: 'nowrap', overflow: 'hidden',
                           textOverflow: 'ellipsis' }}>
                Fouad Ligali
              </p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', margin: 0 }}>
                Paris, France 🇫🇷
              </p>
            </div>
            <button
              onClick={() => navigate('/connexion')}
              style={{ background:'none', border:'none', cursor:'pointer',
                        color:'rgba(245,240,232,0.35)', padding:4, transition:'color 0.2s' }}
              title="Déconnexion"
              onMouseEnter={e => e.currentTarget.style.color = '#F5F0E8'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.35)'}
            >
              <LogoutIcon size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Topbar
// ═══════════════════════════════════════════════════════════════════
function Topbar({ active, notifOpen, setNotifOpen }) {
  const titles = {
    dashboard:    'Tableau de bord',
    terrains:     'Terrains disponibles',
    portefeuille: 'Mon portefeuille',
    historique:   'Historique des transactions',
    documents:    'Mes documents',
    notifications:'Notifications',
  }

  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <header style={{
      height: 64, background: '#FAFAF7',
      borderBottom: '1px solid rgba(30,58,47,0.08)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px', flexShrink: 0,
    }}>

      {/* Titre page */}
      <div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.2rem', fontWeight: 700,
          color: '#1A1A1A', margin: 0,
        }}>
          {titles[active]}
        </h1>
        <p style={{ fontSize: '0.72rem', color: '#8C8278', margin: 0 }}>
          {time.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
      </div>

      {/* Actions droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Bouton investir */}
        <Link to="/terrains" style={{
          padding: '8px 18px', borderRadius: 8,
          background: '#1E3A2F', color: '#F5F0E8',
          textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(30,58,47,0.25)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#2D5241'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.transform = 'translateY(0)' }}>
          + Investir
        </Link>

        {/* Cloche notification */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifOpen ? 'rgba(30,58,47,0.08)' : 'transparent',
              border: '1.5px solid rgba(30,58,47,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#4A3F35', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.06)'}
            onMouseLeave={e => { if (!notifOpen) e.currentTarget.style.background = 'transparent' }}
          >
            <BellIcon size={18} />
          </button>
          {/* Badge rouge */}
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 18, height: 18, borderRadius: '50%',
            background: '#C0392B', border: '2px solid #FAFAF7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', fontWeight: 700, color: '#fff',
          }}>
            2
          </div>

          {/* Panel notifications */}
          {notifOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 320, background: '#fff',
              borderRadius: 16, boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
              border: '1px solid rgba(30,58,47,0.08)', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,58,47,0.08)',
                             display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                  Notifications
                </p>
                <span style={{ fontSize: '0.72rem', color: '#B8972A', fontWeight: 600, cursor: 'pointer' }}>
                  Tout lire
                </span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  background: n.read ? 'transparent' : 'rgba(184,151,42,0.04)',
                  borderBottom: '1px solid rgba(30,58,47,0.05)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(184,151,42,0.04)'}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{n.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#1A1A1A', margin: '0 0 2px',
                                  fontWeight: n.read ? 400 : 600 }}>
                      {n.text}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#8C8278', margin: 0 }}>{n.time}</p>
                  </div>
                  {!n.read && (
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#B8972A', marginLeft: 'auto', flexShrink: 0, marginTop: 4,
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #1E3A2F, #B8972A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 700, color: '#F5F0E8', cursor: 'pointer',
        }}>
          FL
        </div>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Widget KPI
// ═══════════════════════════════════════════════════════════════════
function KpiWidget({ label, value, suffix, sub, icon, color, bg, delta, index }) {
  const [ref, inView] = useInView(0.2)
  const count = useCountUp(value, 1600 + index * 100, inView)

  return (
    <div ref={ref} style={{
      background: '#FFFFFF', borderRadius: 16, padding: '20px 22px',
      boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      border: '1px solid rgba(30,58,47,0.06)',
      borderTop: `3px solid ${color}`,
      transition: 'all 0.3s ease',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
      transitionDelay: `${index * 0.08}s`,
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(30,58,47,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(30,58,47,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>

      {/* Icône + label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8C8278',
                     textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          {label}
        </p>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>
          {icon}
        </div>
      </div>

      {/* Valeur principale */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.8rem', fontWeight: 700, color: '#1A1A1A',
        margin: '0 0 6px', lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {count.toLocaleString('fr-FR')}
        <span style={{ fontSize: '0.9rem', color: '#8C8278', marginLeft: 4, fontFamily: "'DM Sans', sans-serif" }}>
          {suffix}
        </span>
      </p>

      {/* Delta + sous-texte */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {delta && (
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20,
            background: delta > 0 ? 'rgba(30,58,47,0.08)' : 'rgba(192,57,43,0.08)',
            color: delta > 0 ? '#1E3A2F' : '#C0392B',
          }}>
            {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
        <p style={{ fontSize: '0.72rem', color: '#8C8278', margin: 0 }}>{sub}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Graphique évolution portefeuille
// ═══════════════════════════════════════════════════════════════════
function PortfolioChart() {
  const [ref, inView] = useInView(0.1)
  const [period, setPeriod] = useState('12m')

  // Tooltip custom
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background: '#1E3A2F', borderRadius: 10, padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.6)', margin: '0 0 4px' }}>{label}</p>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#D4AD3A', margin: 0, fontFamily: "'Playfair Display', serif" }}>
          {payload[0].value.toLocaleString('fr-FR')} FCFA
        </p>
      </div>
    )
  }

  return (
    <div ref={ref} style={{
      background: '#FFFFFF', borderRadius: 16, padding: '22px 24px',
      boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      border: '1px solid rgba(30,58,47,0.06)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: '0.72rem', color: '#8C8278', margin: '0 0 2px',
                       textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Évolution du portefeuille
          </p>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A',
            margin: '0 0 4px',
          }}>
            432 750 FCFA
          </h3>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px',
            borderRadius: 20, background: 'rgba(30,58,47,0.08)', color: '#1E3A2F',
          }}>
            ↑ +12.4% ce mois
          </span>
        </div>

        {/* Sélecteur période */}
        <div style={{
          display: 'flex', background: '#F5F0E8',
          borderRadius: 10, padding: 3, gap: 2,
        }}>
          {['3m', '6m', '12m'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: period === p ? '#1E3A2F' : 'transparent',
              color: period === p ? '#F5F0E8' : '#8C8278',
              fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={portfolioData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor="#1E3A2F" stopOpacity={0.15}/>
              <stop offset="95%"  stopColor="#1E3A2F" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,47,0.06)" vertical={false}/>
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8C8278', fontFamily: "'DM Sans', sans-serif" }}
                 axisLine={false} tickLine={false}/>
          <YAxis hide/>
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(30,58,47,0.1)', strokeWidth: 1 }}/>
          <Area type="monotone" dataKey="value" stroke="#1E3A2F" strokeWidth={2.5}
                fill="url(#portfolioGrad)" dot={false}
                activeDot={{ r: 5, fill: '#1E3A2F', stroke: '#F5F0E8', strokeWidth: 2 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Mes investissements (cards)
// ═══════════════════════════════════════════════════════════════════
function InvestmentCards() {
  const [ref, inView] = useInView(0.1)

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.1rem', fontWeight: 700, color: '#1A1A1A', margin: 0,
        }}>
          Mes terrains
        </h2>
        <button style={{
          padding: '6px 14px', borderRadius: 8,
          border: '1.5px solid rgba(30,58,47,0.15)',
          background: 'transparent', color: '#1E3A2F',
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.color = '#F5F0E8' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E3A2F' }}>
          Voir tout →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {investments.map((inv, i) => (
          <div key={inv.id} style={{
            background: '#FFFFFF', borderRadius: 14, padding: '16px 18px',
            border: '1px solid rgba(30,58,47,0.06)',
            boxShadow: '0 2px 8px rgba(30,58,47,0.04)',
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(-16px)',
            transition: `all 0.5s ease ${i * 0.08}s`,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,58,47,0.1)'; e.currentTarget.style.transform = 'translateX(4px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,58,47,0.04)'; e.currentTarget.style.transform = 'translateX(0)' }}>

            {/* Thumbnail */}
            <div style={{
              width: 46, height: 46, borderRadius: 10, flexShrink: 0,
              background: inv.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>
              🏡
            </div>

            {/* Infos */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 1px',
                               whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {inv.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#8C8278', margin: 0 }}>
                    📍 {inv.location} · {inv.sqm} m²
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.95rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px',
                  }}>
                    {inv.currentValue.toLocaleString('fr-FR')} F
                  </p>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px',
                    borderRadius: 10, background: 'rgba(30,58,47,0.08)', color: '#1E3A2F',
                  }}>
                    ↑ +{inv.roi}%
                  </span>
                </div>
              </div>

              {/* Barre de progression terrain */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                               fontSize: '0.65rem', color: '#8C8278', marginBottom: 3 }}>
                  <span>Terrain financé</span>
                  <span>{inv.progress}%</span>
                </div>
                <div style={{ height: 4, background: '#EDE6D6', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: inView ? `${inv.progress}%` : '0%',
                    background: inv.progress > 80
                      ? 'linear-gradient(90deg, #B8972A, #D4AD3A)'
                      : 'linear-gradient(90deg, #1E3A2F, #3D6B53)',
                    transition: `width 1s ease ${0.3 + i * 0.1}s`,
                  }} />
                </div>
              </div>
            </div>

            {/* Bouton attestation */}
            <button style={{
              padding: '7px 12px', borderRadius: 8, flexShrink: 0,
              background: 'rgba(30,58,47,0.06)',
              border: '1px solid rgba(30,58,47,0.1)',
              color: '#1E3A2F', fontSize: '0.72rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.color = '#F5F0E8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,58,47,0.06)'; e.currentTarget.style.color = '#1E3A2F' }}>
              📄 PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Tableau transactions récentes
// ═══════════════════════════════════════════════════════════════════
function TransactionsTable() {
  const [ref, inView] = useInView(0.1)

  const statusStyle = (status) => ({
    confirmed: { bg: 'rgba(30,58,47,0.08)', color: '#1E3A2F', label: '✓ Confirmé' },
    pending:   { bg: 'rgba(184,151,42,0.12)', color: '#8B6E1A', label: '⏳ En attente' },
    failed:    { bg: 'rgba(192,57,43,0.08)', color: '#C0392B', label: '✗ Échoué' },
  }[status])

  return (
    <div ref={ref} style={{
      background: '#FFFFFF', borderRadius: 16,
      boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      border: '1px solid rgba(30,58,47,0.06)',
      overflow: 'hidden',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease 0.2s',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(30,58,47,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', margin: 0,
        }}>
          Transactions récentes
        </h3>
        <button style={{
          padding: '5px 12px', borderRadius: 8,
          border: '1.5px solid rgba(30,58,47,0.12)',
          background: 'transparent', color: '#1E3A2F',
          fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Exporter CSV
        </button>
      </div>

      {/* Tableau */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAF7' }}>
              {['Référence', 'Terrain', 'Parts', 'Montant', 'Mode', 'Date', 'Statut'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: '0.7rem', fontWeight: 700, color: '#8C8278',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  borderBottom: '1px solid rgba(30,58,47,0.06)',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => {
              const s = statusStyle(tx.status)
              return (
                <tr key={tx.id}
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ease ${0.3 + i * 0.06}s`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,232,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <span style={{ fontFamily: "'DM Sans', monospace",
                                   fontSize: '0.8rem', color: '#1E3A2F', fontWeight: 600 }}>
                      {tx.id}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                      {tx.terrain}
                    </p>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#4A3F35' }}>{tx.sqm} m²</span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '0.88rem', fontWeight: 700, color: '#1A1A1A',
                    }}>
                      {tx.amount.toLocaleString('fr-FR')} F
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#6B6459' }}>{tx.method}</span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#8C8278' }}>{tx.date}</span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20,
                      background: s.bg, color: s.color,
                      fontSize: '0.72rem', fontWeight: 600,
                    }}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Terrain disponible (card à droite)
// ═══════════════════════════════════════════════════════════════════
function AvailableTerrain() {
  const [ref, inView] = useInView(0.1)

  return (
    <div ref={ref} style={{
      background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      border: '1px solid rgba(30,58,47,0.06)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.5s ease 0.1s',
    }}>

      {/* Image */}
      <div style={{
        height: 130,
        background: 'linear-gradient(135deg, #1E3A2F, #2D5241, #B8972A)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Grille décorative */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: `
            linear-gradient(rgba(245,240,232,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,240,232,.5) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }} />
        {/* Marqueur animé */}
        <div style={{
          width: 36, height: 36, borderRadius: '50% 50% 50% 0',
          background: '#B8972A', transform: 'rotate(-45deg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(184,151,42,0.5)',
          animation: 'mapPulse 2s ease infinite',
        }}>
          <span style={{ transform: 'rotate(45deg)', fontSize: '0.9rem' }}>📍</span>
        </div>
        {/* Badge disponible */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600,
          background: 'rgba(30,58,47,0.8)', color: '#F5F0E8',
          backdropFilter: 'blur(4px)',
        }}>
          🟢 Disponible
        </span>
      </div>

      {/* Corps */}
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '0.68rem', color: '#8C8278', margin: '0 0 4px' }}>
          📍 Abomey-Calavi, Atlantique
        </p>
        <h4 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 12px',
        }}>
          Porto-Novo Est — Nouveau
        </h4>

        {/* Stats mini */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Prix / m²', value: '12 000 F' },
            { label: 'Rendement', value: '16%/an'  },
            { label: 'Disponible', value: '480 m²' },
            { label: 'Min. achat', value: '1 m²'   },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#F5F0E8', borderRadius: 8, padding: '8px 10px',
            }}>
              <p style={{ fontSize: '0.62rem', color: '#8C8278', margin: '0 0 2px' }}>{label}</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Barre progression */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                         fontSize: '0.68rem', color: '#8C8278', marginBottom: 4 }}>
            <span>Financement</span><span>18%</span>
          </div>
          <div style={{ height: 5, background: '#EDE6D6', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: inView ? '18%' : '0%', borderRadius: 3,
              background: 'linear-gradient(90deg, #1E3A2F, #3D6B53)',
              transition: 'width 1.2s ease 0.5s',
            }} />
          </div>
        </div>

        <Link to="/terrains" style={{
          display: 'block', width: '100%', padding: '11px',
          borderRadius: 10, textAlign: 'center',
          background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
          color: '#F5F0E8', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.85rem',
          boxShadow: '0 3px 12px rgba(30,58,47,0.25)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,58,47,0.35)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(30,58,47,0.25)' }}>
          Investir maintenant →
        </Link>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// CONTENU PRINCIPAL selon l'onglet actif
// ═══════════════════════════════════════════════════════════════════
function MainContent({ active }) {
  if (active === 'dashboard') {
    return (
      <div style={{ display: 'flex', gap: 20, height: '100%' }}>

        {/* ── Colonne principale (gauche) ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Alerte KYC / Bienvenue */}
          <div style={{
            background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
            borderRadius: 16, padding: '18px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(30,58,47,0.2)',
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.6)',
                           textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                Bonjour 👋
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem', fontWeight: 700, color: '#F5F0E8', margin: 0,
              }}>
                Fouad, votre portefeuille progresse bien !
              </h2>
            </div>
            <div style={{
              background: 'rgba(184,151,42,0.15)',
              border: '1px solid rgba(184,151,42,0.3)',
              borderRadius: 12, padding: '8px 16px', flexShrink: 0,
            }}>
              <p style={{ fontSize: '0.72rem', color: '#D4AD3A', margin: '0 0 2px', fontWeight: 600 }}>
                Total investi
              </p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.3rem', fontWeight: 700, color: '#D4AD3A', margin: 0,
              }}>
                432 750 F
              </p>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <KpiWidget index={0} label="Total investi"   value={432750} suffix="F"   sub="Depuis départ"      icon="💰" color="#1E3A2F" bg="rgba(30,58,47,0.08)"   delta={12.4} />
            <KpiWidget index={1} label="Parts détenues"  value={26}     suffix="m²"  sub="3 terrains"         icon="📐" color="#B8972A" bg="rgba(184,151,42,0.1)"  delta={null} />
            <KpiWidget index={2} label="Valeur actuelle" value={418800} suffix="F"   sub="Estimation"         icon="📈" color="#2D5241" bg="rgba(45,82,65,0.1)"    delta={9.2}  />
            <KpiWidget index={3} label="ROI moyen"       value={11}     suffix="%"   sub="Sur 12 mois"        icon="🎯" color="#3D6B53" bg="rgba(61,107,83,0.1)"   delta={2.1}  />
          </div>

          {/* Graphique */}
          <PortfolioChart />

          {/* Tableau transactions */}
          <TransactionsTable />
        </div>

        {/* ── Colonne droite ── */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InvestmentCards />
          <AvailableTerrain />
        </div>
      </div>
    )
  }

  // Pages placeholder (à développer)
  const placeholders = {
    terrains:      { emoji: '🗺️', label: 'Terrains disponibles' },
    portefeuille:  { emoji: '💼', label: 'Mon portefeuille'      },
    historique:    { emoji: '📋', label: 'Historique complet'    },
    documents:     { emoji: '📄', label: 'Mes documents'         },
    notifications: { emoji: '🔔', label: 'Notifications'         },
  }
  const p = placeholders[active]
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <span style={{ fontSize: '4rem' }}>{p?.emoji}</span>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A', margin: 0,
      }}>
        {p?.label}
      </h2>
      <p style={{ color: '#8C8278', fontSize: '0.9rem', margin: 0 }}>
        Cette section sera développée prochainement 🚧
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : Dashboard
// ═══════════════════════════════════════════════════════════════════
export default function Dashboard() {
  useFonts()
  const [active,    setActive]    = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  // Ferme notifications si clic ailleurs
  useEffect(() => {
    const close = () => setNotifOpen(false)
    if (notifOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [notifOpen])

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: '#F5F0E8',
    }}>

      {/* Sidebar */}
      <Sidebar
        active={active} setActive={setActive}
        collapsed={collapsed} setCollapsed={setCollapsed}
      />

      {/* Contenu principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <Topbar active={active} notifOpen={notifOpen}
                setNotifOpen={(v) => { v && event?.stopPropagation(); setNotifOpen(v) }} />

        {/* Contenu scrollable */}
        <main style={{
          flex: 1, overflow: 'auto', padding: 20,
        }}>
          <MainContent active={active} />
        </main>
      </div>

      {/* Animations globales */}
      <style>{`
        @keyframes mapPulse {
          0%,100% { box-shadow: 0 4px 14px rgba(184,151,42,0.5); }
          50%      { box-shadow: 0 4px 24px rgba(184,151,42,0.8); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(30,58,47,0.15); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(30,58,47,0.3); }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ICÔNES SVG inline
// ═══════════════════════════════════════════════════════════════════
function GridIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )
}
function MapIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  )
}
function WalletIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 12V22H4a2 2 0 01-2-2V6a2 2 0 012-2h16v4"/>
      <path d="M20 12a2 2 0 000 4h4v-4z"/>
    </svg>
  )
}
function ClockIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function FileIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}
function BellIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}
function LogoutIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}