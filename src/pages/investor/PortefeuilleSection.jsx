// ═══════════════════════════════════════════════════════════════════
// PortefeuilleSection.jsx — Section "Portefeuille" · Dashboard Investisseur
// LandShare Bénin · Design System identique Dashboard.jsx
// Palette : #F5F0E8 · #1E3A2F · #B8972A · #111810
// Polices : Playfair Display · DM Sans · tailles réduites
// Responsive : desktop + mobile
// ═══════════════════════════════════════════════════════════════════
//
// INTÉGRATION DANS Dashboard.jsx :
// 1. Copier ce fichier dans src/pages/investor/PortefeuilleSection.jsx
// 2. Importer : import PortefeuilleSection from './PortefeuilleSection'
// 3. Dans MainContent(), ajouter avant le bloc placeholders :
//    if (active === 'portefeuille') return <PortefeuilleSection isMobile={isMobile} />
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// ─── Tokens ────────────────────────────────────────────────────────
const C = {
  bg:      '#F5F0E8',
  surface: '#FFFFFF',
  green:   '#1E3A2F',
  green2:  '#2D5241',
  gold:    '#B8972A',
  goldTxt: '#D4AD3A',
  text:    '#1A1A1A',
  muted:   '#8C8278',
  subtle:  '#6B6459',
  border:  'rgba(30,58,47,0.09)',
}

// ─── Hook countUp ──────────────────────────────────────────────────
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

// ─── Hook InView ───────────────────────────────────────────────────
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

// ─── Données mock ──────────────────────────────────────────────────
const INVESTMENTS = [
  {
    id: 1,
    nom:          'Calavi Nord — Zone Résidentielle',
    location:     'Abomey-Calavi, Atlantique',
    ref:          'TRN-001',
    sqm:          13,
    pricePaid:    195000,
    currentValue: 213300,
    roi:          9.4,
    progress:     68,
    gradient:     'linear-gradient(135deg, #1E3A2F, #2D5241)',
    emoji:        '🏡',
    tag:          'Résidentiel',
    dateAchat:    '28 Oct 2025',
    notaire:      'Maître Kofi Akobi',
    attestation:  'ATT-2025-LS-00201',
    historique: [
      { month: 'Oct', value: 195000 },
      { month: 'Nov', value: 198200 },
      { month: 'Déc', value: 200500 },
      { month: 'Jan', value: 202800 },
      { month: 'Fév', value: 205100 },
      { month: 'Mar', value: 207400 },
      { month: 'Avr', value: 210200 },
      { month: 'Mai', value: 213300 },
    ],
  },
  {
    id: 2,
    nom:          'Fidjrossè Balnéaire',
    location:     'Cotonou, Littoral',
    ref:          'TRN-002',
    sqm:          10,
    pricePaid:    154500,
    currentValue: 178000,
    roi:          15.2,
    progress:     91,
    gradient:     'linear-gradient(135deg, #2D5241, #B8972A)',
    emoji:        '🌊',
    tag:          'Balnéaire',
    dateAchat:    '15 Oct 2025',
    notaire:      'Maître Adjibodé Sara',
    attestation:  'ATT-2025-LS-00189',
    historique: [
      { month: 'Oct', value: 154500 },
      { month: 'Nov', value: 158000 },
      { month: 'Déc', value: 161200 },
      { month: 'Jan', value: 164800 },
      { month: 'Fév', value: 168500 },
      { month: 'Mar', value: 172000 },
      { month: 'Avr', value: 175200 },
      { month: 'Mai', value: 178000 },
    ],
  },
  {
    id: 3,
    nom:          'Parakou Nord — Lot B',
    location:     'Parakou, Borgou',
    ref:          'TRN-003',
    sqm:          3,
    pricePaid:    25500,
    currentValue: 27800,
    roi:          9.0,
    progress:     32,
    gradient:     'linear-gradient(135deg, #3D6B53, #1E3A2F)',
    emoji:        '🏗️',
    tag:          'Résidentiel',
    dateAchat:    '02 Oct 2025',
    notaire:      'Maître Dossou Théodore',
    attestation:  'ATT-2025-LS-00174',
    historique: [
      { month: 'Oct', value: 25500 },
      { month: 'Nov', value: 25900 },
      { month: 'Déc', value: 26200 },
      { month: 'Jan', value: 26500 },
      { month: 'Fév', value: 26900 },
      { month: 'Mar', value: 27200 },
      { month: 'Avr', value: 27500 },
      { month: 'Mai', value: 27800 },
    ],
  },
]

const GLOBAL_HISTORIQUE = [
  { month: 'Oct', value: 375000 },
  { month: 'Nov', value: 382100 },
  { month: 'Déc', value: 387900 },
  { month: 'Jan', value: 394100 },
  { month: 'Fév', value: 400500 },
  { month: 'Mar', value: 406600 },
  { month: 'Avr', value: 412900 },
  { month: 'Mai', value: 419100 },
]

const PIE_COLORS = ['#1E3A2F', '#B8972A', '#3D6B53']

// ─── Tooltip custom ────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1E3A2F', borderRadius: 8, padding: '8px 12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <p style={{ margin: 0, fontSize: '0.72rem', color: '#F5F0E8', fontWeight: 600 }}>
        {payload[0].value.toLocaleString('fr-FR')} FCFA
      </p>
    </div>
  )
}

// ─── KPI card animée ───────────────────────────────────────────────
function KpiCard({ label, value, suffix, sub, icon, color, bgColor, delta, index }) {
  const [ref, inView] = useInView()
  const animated = useCountUp(value, 1600, inView)
  return (
    <div ref={ref} style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '14px 16px',
      boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>{icon}</div>
        {delta !== null && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: '0.65rem', fontWeight: 700,
            color: delta >= 0 ? '#27AE60' : '#E74C3C',
            background: delta >= 0 ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)',
            padding: '2px 7px', borderRadius: 20,
          }}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.3rem', fontWeight: 700, color, margin: '0 0 3px',
      }}>
        {animated.toLocaleString('fr-FR')}{suffix}
      </p>
      <p style={{ fontSize: '0.65rem', color: C.muted, margin: '0 0 2px', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: '0.6rem', color: 'rgba(140,130,120,0.7)', margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Carte investissement ──────────────────────────────────────────
function InvestCard({ inv, isMobile, onSelect, isSelected }) {
  const gain = inv.currentValue - inv.pricePaid
  const gainPct = ((gain / inv.pricePaid) * 100).toFixed(1)

  return (
    <div
      onClick={() => onSelect(inv)}
      style={{
        background: C.surface, borderRadius: 14,
        border: `1.5px solid ${isSelected ? C.green : C.border}`,
        boxShadow: isSelected
          ? '0 4px 20px rgba(30,58,47,0.14)'
          : '0 2px 10px rgba(30,58,47,0.05)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.22s',
        transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(30,58,47,0.22)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,47,0.1)' }}}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = '0 2px 10px rgba(30,58,47,0.05)' }}}
    >
      {/* Vignette */}
      <div style={{
        background: inv.gradient, padding: '14px 16px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(245,240,232,0.15)',
          border: '1px solid rgba(245,240,232,0.2)',
          borderRadius: 6, padding: '2px 7px',
          fontSize: '0.58rem', fontWeight: 700,
          color: 'rgba(245,240,232,0.85)',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>{inv.tag}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>{inv.emoji}</span>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.85rem', fontWeight: 700,
              color: '#F5F0E8', margin: '0 0 2px', lineHeight: 1.3,
            }}>{inv.nom}</h3>
            <p style={{ fontSize: '0.6rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
              📍 {inv.location}
            </p>
          </div>
        </div>

        {/* Valeur actuelle */}
        <div style={{
          marginTop: 10, display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <p style={{ margin: '0 0 1px', fontSize: '0.56rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valeur actuelle</p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem', fontWeight: 700,
              color: C.goldTxt, margin: 0,
            }}>{inv.currentValue.toLocaleString('fr-FR')} F</p>
          </div>
          <div style={{
            background: gain >= 0 ? 'rgba(39,174,96,0.2)' : 'rgba(231,76,60,0.2)',
            border: `1px solid ${gain >= 0 ? 'rgba(39,174,96,0.3)' : 'rgba(231,76,60,0.3)'}`,
            borderRadius: 8, padding: '4px 8px', textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: gain >= 0 ? '#7DCEA0' : '#F1948A' }}>
              {gain >= 0 ? '+' : ''}{gainPct}%
            </p>
            <p style={{ margin: 0, fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)' }}>
              +{gain.toLocaleString('fr-FR')} F
            </p>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: '12px 16px' }}>
        {/* Infos ligne */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8, marginBottom: 10,
        }}>
          {[
            { label: 'Parts',    value: `${inv.sqm} m²`       },
            { label: 'Investi',  value: `${(inv.pricePaid/1000).toFixed(0)}K F` },
            { label: 'ROI',      value: `+${inv.roi}%`         },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(30,58,47,0.04)', borderRadius: 8,
              padding: '6px 8px', textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 1px', fontSize: '0.56rem', color: C.muted }}>{label}</p>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: C.green }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Barre financement terrain */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.6rem', color: C.muted }}>Financement terrain</span>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: inv.progress >= 90 ? C.gold : C.green }}>
              {inv.progress}%
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(30,58,47,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${inv.progress}%`,
              background: inv.progress >= 90
                ? `linear-gradient(90deg, ${C.gold}, #D4AD3A)`
                : `linear-gradient(90deg, ${C.green}, ${C.green2})`,
            }} />
          </div>
        </div>

        {/* Achat + attestation */}
        <div style={{
          marginTop: 10, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.6rem', color: C.muted }}>📅 {inv.dateAchat}</span>
          <span style={{
            fontSize: '0.6rem', color: C.gold, fontFamily: 'monospace',
            background: 'rgba(184,151,42,0.08)', padding: '2px 6px',
            borderRadius: 5, border: '1px solid rgba(184,151,42,0.15)',
          }}>{inv.attestation}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Panneau détail investissement ─────────────────────────────────
function DetailPanel({ inv, isMobile }) {
  const navigate = useNavigate()
  if (!inv) return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '40px 20px', textAlign: 'center',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: '2.5rem' }}>👈</span>
      <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0 }}>
        Sélectionnez un investissement pour voir les détails
      </p>
    </div>
  )

  const gain    = inv.currentValue - inv.pricePaid
  const gainPct = ((gain / inv.pricePaid) * 100).toFixed(1)

  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(30,58,47,0.08)',
    }}>
      {/* Header */}
      <div style={{
        background: inv.gradient, padding: '16px 18px',
      }}>
        <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Détail · {inv.ref}
        </p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700,
          color: '#F5F0E8', margin: '0 0 3px',
        }}>{inv.nom}</h3>
        <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>
          📍 {inv.location}
        </p>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* P&L */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 14,
        }}>
          <div style={{
            background: 'rgba(30,58,47,0.04)', borderRadius: 10,
            padding: '10px 12px', textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Investi</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: C.text, margin: 0 }}>
              {inv.pricePaid.toLocaleString('fr-FR')} F
            </p>
          </div>
          <div style={{
            background: gain >= 0 ? 'rgba(39,174,96,0.08)' : 'rgba(231,76,60,0.08)',
            borderRadius: 10, padding: '10px 12px', textAlign: 'center',
            border: `1px solid ${gain >= 0 ? 'rgba(39,174,96,0.15)' : 'rgba(231,76,60,0.15)'}`,
          }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plus-value</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: gain >= 0 ? '#27AE60' : '#E74C3C', margin: 0 }}>
              +{gain.toLocaleString('fr-FR')} F
            </p>
          </div>
        </div>

        {/* Mini graphique évolution */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
            Évolution de la valeur
          </p>
          <div style={{ height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inv.historique} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${inv.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A2F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#1E3A2F" strokeWidth={2}
                      fill={`url(#grad-${inv.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Infos détaillées */}
        {[
          { label: 'Parts détenues',    value: `${inv.sqm} m²`                              },
          { label: 'Prix d\'achat/m²',  value: `${(inv.pricePaid/inv.sqm).toLocaleString('fr-FR')} FCFA` },
          { label: 'Valeur actuelle',   value: `${inv.currentValue.toLocaleString('fr-FR')} FCFA`        },
          { label: 'ROI estimé',        value: `+${inv.roi}%`                                },
          { label: 'Notaire',           value: inv.notaire                                   },
          { label: 'Attestation',       value: inv.attestation                               },
          { label: "Date d'achat",      value: inv.dateAchat                                 },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', fontSize: '0.72rem',
            borderBottom: '1px solid rgba(30,58,47,0.04)',
          }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{ fontWeight: 600, color: C.text, textAlign: 'right', maxWidth: '55%', fontSize: '0.7rem' }}>
              {value}
            </span>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          <button style={{
            width: '100%', padding: '10px',
            borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
            color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 3px 12px rgba(30,58,47,0.22)',
          }}>
            📄 Télécharger l'attestation
          </button>
          <button
            onClick={() => navigate(`/terrains/${inv.id}`)}
            style={{
              width: '100%', padding: '10px',
              borderRadius: 10, border: `1px solid rgba(30,58,47,0.15)`,
              background: 'transparent',
              color: C.green, fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
            → Investir davantage
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Graphique global + donut ───────────────────────────────────────
function PortfolioCharts({ isMobile }) {
  const pieData = INVESTMENTS.map(inv => ({
    name: inv.tag,
    value: inv.currentValue,
  }))

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 220px',
      gap: 16,
    }}>
      {/* Graphique évolution globale */}
      <div style={{
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: '16px 18px',
        boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: C.text }}>
              Évolution du portefeuille
            </p>
            <p style={{ margin: 0, fontSize: '0.62rem', color: C.muted }}>Oct 2025 — Mai 2026</p>
          </div>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, color: '#27AE60',
            background: 'rgba(39,174,96,0.1)', padding: '3px 9px', borderRadius: 20,
          }}>↑ +11.8%</span>
        </div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GLOBAL_HISTORIQUE} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradGlobal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1E3A2F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value"
                    stroke="#1E3A2F" strokeWidth={2.5}
                    fill="url(#gradGlobal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut répartition */}
      <div style={{
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: '16px 18px',
        boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: C.text, alignSelf: 'flex-start' }}>
          Répartition
        </p>
        <p style={{ margin: '0 0 10px', fontSize: '0.62rem', color: C.muted, alignSelf: 'flex-start' }}>
          Par terrain
        </p>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width={120} height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55}
                   dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => [`${v.toLocaleString('fr-FR')} F`, 'Valeur']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Légende */}
        <div style={{ width: '100%', marginTop: 8 }}>
          {INVESTMENTS.map((inv, i) => (
            <div key={inv.id} style={{
              display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }} />
              <span style={{ fontSize: '0.62rem', color: C.subtle, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inv.emoji} {inv.tag}
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: C.green }}>
                {((inv.currentValue / INVESTMENTS.reduce((s,v)=>s+v.currentValue,0))*100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : PortefeuilleSection
// ═══════════════════════════════════════════════════════════════════
export default function PortefeuilleSection({ isMobile }) {
  const navigate = useNavigate()
  const [selected, setSelected]   = useState(null)
  const [visible,  setVisible]    = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const totalInvesti   = INVESTMENTS.reduce((s, i) => s + i.pricePaid,    0)
  const totalActuel    = INVESTMENTS.reduce((s, i) => s + i.currentValue, 0)
  const totalGain      = totalActuel - totalInvesti
  const totalSqm       = INVESTMENTS.reduce((s, i) => s + i.sqm,          0)
  const roiMoyen       = (INVESTMENTS.reduce((s,i)=>s+i.roi,0)/INVESTMENTS.length)

  return (
    <div style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition:'opacity 0.4s ease, transform 0.4s ease',
    }}>

      {/* ── Bandeau titre ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)',
        borderRadius: 16, padding: isMobile ? '18px 16px' : '20px 24px',
        marginBottom: 20,
        boxShadow: '0 4px 20px rgba(30,58,47,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Mon portefeuille
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '1.15rem' : '1.3rem',
              fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px',
            }}>
              {totalActuel.toLocaleString('fr-FR')} FCFA
            </h2>
            <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
              {INVESTMENTS.length} terrains · {totalSqm} m² · Valeur totale estimée
            </p>
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                background: 'rgba(39,174,96,0.15)',
                border: '1px solid rgba(39,174,96,0.25)',
                borderRadius: 12, padding: '8px 14px', textAlign: 'center',
              }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plus-value</p>
                <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#7DCEA0' }}>
                  +{totalGain.toLocaleString('fr-FR')} F
                </p>
              </div>
              <div style={{
                background: 'rgba(184,151,42,0.15)',
                border: '1px solid rgba(184,151,42,0.25)',
                borderRadius: 12, padding: '8px 14px', textAlign: 'center',
              }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROI moyen</p>
                <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#D4AD3A' }}>
                  +{roiMoyen.toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 14, marginBottom: 20,
      }}>
        <KpiCard index={0} label="Total investi"   value={totalInvesti}  suffix=" F" sub="Depuis le début"   icon="💰" color={C.green}  bgColor="rgba(30,58,47,0.08)"   delta={null}  />
        <KpiCard index={1} label="Valeur actuelle" value={totalActuel}   suffix=" F" sub="Estimation mai 2026" icon="📈" color={C.green2} bgColor="rgba(45,82,65,0.1)"    delta={11.8}  />
        <KpiCard index={2} label="Parts détenues"  value={totalSqm}      suffix=" m²" sub={`${INVESTMENTS.length} terrains`} icon="📐" color={C.gold}   bgColor="rgba(184,151,42,0.1)"  delta={null}  />
        <KpiCard index={3} label="ROI moyen"        value={Math.round(roiMoyen)} suffix="%" sub="Sur 7 mois"    icon="🎯" color="#3D6B53" bgColor="rgba(61,107,83,0.1)"   delta={2.1}   />
      </div>

      {/* ── Graphiques ── */}
      <div style={{ marginBottom: 20 }}>
        <PortfolioCharts isMobile={isMobile} />
      </div>

      {/* ── Titre liste ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700, color: C.text, margin: 0,
        }}>
          Mes investissements
        </p>
        <button
          onClick={() => navigate('/terrains')}
          style={{
            padding: '6px 14px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
            color: '#F5F0E8', fontSize: '0.7rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
          + Nouvel investissement
        </button>
      </div>

      {/* ── Grille investissements + détail ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        gap: 16, alignItems: 'flex-start',
      }}>
        {/* Cartes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INVESTMENTS.map(inv => (
            <InvestCard
              key={inv.id}
              inv={inv}
              isMobile={isMobile}
              onSelect={setSelected}
              isSelected={selected?.id === inv.id}
            />
          ))}
        </div>

        {/* Panneau détail — sticky sur desktop */}
        {isMobile ? (
          selected && <DetailPanel inv={selected} isMobile={true} />
        ) : (
          <div style={{ position: 'sticky', top: 70 }}>
            <DetailPanel inv={selected} isMobile={false} />
          </div>
        )}
      </div>

      {/* ── Note bas de page ── */}
      <div style={{
        marginTop: 20, padding: '10px 14px',
        background: 'rgba(30,58,47,0.04)',
        border: '1px solid rgba(30,58,47,0.08)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: '0.78rem', flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
          Les valeurs affichées sont des estimations basées sur le marché foncier béninois.
          Attestations vérifiables hors-ligne par leur hash SHA-256.
        </p>
      </div>
    </div>
  )
}
