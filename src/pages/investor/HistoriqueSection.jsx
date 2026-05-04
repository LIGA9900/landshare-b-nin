// ═══════════════════════════════════════════════════════════════════
// HistoriqueSection.jsx — Section "Historique" · Dashboard Investisseur
// LandShare Bénin · Design System identique Dashboard.jsx
// Palette : #F5F0E8 · #1E3A2F · #B8972A · #111810
// Polices : Playfair Display · DM Sans · tailles réduites
// Responsive : desktop + mobile
// ═══════════════════════════════════════════════════════════════════
//
// INTÉGRATION DANS Dashboard.jsx :
// 1. Copier ce fichier dans src/pages/investor/HistoriqueSection.jsx
// 2. Importer : import HistoriqueSection from './HistoriqueSection'
// 3. Dans MainContent(), ajouter :
//    if (active === 'historique') return <HistoriqueSection isMobile={isMobile} />
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'

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

// ─── Données mock ──────────────────────────────────────────────────
const TRANSACTIONS = [
  {
    id: 1, ref: 'LS-054',
    type: 'achat',
    terrain: 'Calavi Nord — Zone Résidentielle',
    location: 'Abomey-Calavi, Atlantique',
    sqm: 5, amount: 77250,
    method: 'MTN MoMo', methodColor: '#FFCC00', methodTextColor: '#1A1A1A',
    status: 'confirmed',
    date: '03 Mai 2026', time: '14:32',
    attestation: 'ATT-2025-LS-00247',
    emoji: '🏡',
  },
  {
    id: 2, ref: 'LS-047',
    type: 'achat',
    terrain: 'Fidjrossè Balnéaire',
    location: 'Cotonou, Littoral',
    sqm: 10, amount: 154500,
    method: 'Stripe', methodColor: '#635BFF', methodTextColor: '#fff',
    status: 'confirmed',
    date: '15 Oct 2025', time: '11:22',
    attestation: 'ATT-2025-LS-00189',
    emoji: '🌊',
  },
  {
    id: 3, ref: 'LS-041',
    type: 'achat',
    terrain: 'Calavi Nord — Zone Résidentielle',
    location: 'Abomey-Calavi, Atlantique',
    sqm: 8, amount: 123600,
    method: 'MTN MoMo', methodColor: '#FFCC00', methodTextColor: '#1A1A1A',
    status: 'confirmed',
    date: '28 Oct 2025', time: '09:15',
    attestation: 'ATT-2025-LS-00201',
    emoji: '🏡',
  },
  {
    id: 4, ref: 'LS-038',
    type: 'achat',
    terrain: 'Parakou Nord — Lot B',
    location: 'Parakou, Borgou',
    sqm: 3, amount: 25500,
    method: 'Moov Money', methodColor: '#0056A2', methodTextColor: '#fff',
    status: 'confirmed',
    date: '02 Oct 2025', time: '16:48',
    attestation: 'ATT-2025-LS-00174',
    emoji: '🏗️',
  },
  {
    id: 5, ref: 'LS-035',
    type: 'echec',
    terrain: 'Fidjrossè Balnéaire',
    location: 'Cotonou, Littoral',
    sqm: 5, amount: 77250,
    method: 'Paystack', methodColor: '#00C3F7', methodTextColor: '#fff',
    status: 'failed',
    date: '28 Sep 2025', time: '08:05',
    attestation: null,
    emoji: '🌊',
  },
  {
    id: 6, ref: 'LS-029',
    type: 'remboursement',
    terrain: 'Porto-Novo Est — Zone Commerciale',
    location: 'Porto-Novo, Ouémé',
    sqm: 3, amount: 34500,
    method: 'Stripe', methodColor: '#635BFF', methodTextColor: '#fff',
    status: 'refunded',
    date: '20 Sep 2025', time: '13:30',
    attestation: null,
    emoji: '🏢',
  },
]

// ─── Config statuts ────────────────────────────────────────────────
const STATUS_CFG = {
  confirmed: { bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F', label: '✓ Confirmé',    dot: '#27AE60' },
  failed:    { bg: 'rgba(192,57,43,0.08)',   color: '#C0392B', label: '✗ Échoué',      dot: '#C0392B' },
  refunded:  { bg: 'rgba(100,116,139,0.08)', color: '#64748B', label: '↩ Remboursé',   dot: '#64748B' },
  pending:   { bg: 'rgba(184,151,42,0.10)',  color: '#8B6E1A', label: '⏳ En attente', dot: '#B8972A' },
}

const TYPE_CFG = {
  achat:         { icon: '📥', label: 'Achat',         color: C.green  },
  echec:         { icon: '❌', label: 'Échec',          color: '#C0392B'},
  remboursement: { icon: '↩️', label: 'Remboursement', color: '#64748B'},
}

// ─── Statistiques ──────────────────────────────────────────────────
function buildStats(txs) {
  const confirmed  = txs.filter(t => t.status === 'confirmed')
  const totalDepense = confirmed.reduce((s, t) => s + t.amount, 0)
  const totalSqm     = confirmed.reduce((s, t) => s + t.sqm,    0)
  return [
    { icon: '💳', label: 'Total dépensé',    value: `${totalDepense.toLocaleString('fr-FR')} F`, sub: `${confirmed.length} transactions` },
    { icon: '📐', label: 'Total m² acquis',  value: `${totalSqm} m²`,                            sub: '3 terrains distincts'              },
    { icon: '✅', label: 'Confirmées',        value: confirmed.length,                             sub: 'sur ' + txs.length + ' total'      },
    { icon: '❌', label: 'Échouées',          value: txs.filter(t => t.status === 'failed').length, sub: 'Aucun débit effectué'             },
  ]
}

// ─── Carte stat ────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, index, visible }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '14px 16px',
      boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`,
    }}>
      <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{icon}</div>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.2rem', fontWeight: 700, color: C.green, margin: '0 0 3px',
      }}>{value}</p>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Ligne transaction (desktop) ───────────────────────────────────
function TxRow({ tx, onSelect, isSelected }) {
  const sc  = STATUS_CFG[tx.status] || STATUS_CFG.pending
  const tc  = TYPE_CFG[tx.type]     || TYPE_CFG.achat

  return (
    <tr
      onClick={() => onSelect(tx)}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(245,240,232,0.6)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? 'rgba(30,58,47,0.04)' : 'transparent' }}
      style={{
        background:  isSelected ? 'rgba(30,58,47,0.04)' : 'transparent',
        cursor:      'pointer', transition: 'background 0.15s',
        borderLeft:  isSelected ? `3px solid ${C.green}` : '3px solid transparent',
      }}
    >
      {/* Réf */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: C.green, fontWeight: 600 }}>
          {tx.ref}
        </span>
      </td>

      {/* Terrain */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>{tx.emoji}</span>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, margin: '0 0 1px' }}>{tx.terrain}</p>
            <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>📍 {tx.location}</p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: '0.72rem', color: tc.color, fontWeight: 600 }}>
          {tc.icon} {tc.label}
        </span>
      </td>

      {/* Montant */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.85rem', fontWeight: 700, color: C.green, margin: '0 0 1px',
        }}>
          {tx.amount.toLocaleString('fr-FR')} F
        </p>
        <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>{tx.sqm} m²</p>
      </td>

      {/* Méthode */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{
          padding: '3px 9px', borderRadius: 5, fontSize: '0.62rem', fontWeight: 800,
          background: tx.methodColor, color: tx.methodTextColor,
        }}>{tx.method}</span>
      </td>

      {/* Statut */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
          background: sc.bg, color: sc.color, whiteSpace: 'nowrap',
        }}>{sc.label}</span>
      </td>

      {/* Date */}
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: '0.72rem', color: C.text, margin: '0 0 1px' }}>{tx.date}</p>
        <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>{tx.time}</p>
      </td>
    </tr>
  )
}

// ─── Carte transaction (mobile) ────────────────────────────────────
function TxCard({ tx, onSelect, isSelected }) {
  const sc = STATUS_CFG[tx.status] || STATUS_CFG.pending
  const tc = TYPE_CFG[tx.type]     || TYPE_CFG.achat

  return (
    <div
      onClick={() => onSelect(tx)}
      style={{
        background: C.surface, borderRadius: 12,
        border: `1.5px solid ${isSelected ? C.green : C.border}`,
        padding: '12px 14px', cursor: 'pointer',
        boxShadow: isSelected ? '0 4px 16px rgba(30,58,47,0.1)' : '0 1px 6px rgba(30,58,47,0.04)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>{tx.emoji}</span>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{tx.terrain}</p>
            <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.muted }}>{tx.ref}</span>
          </div>
        </div>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600,
          background: sc.bg, color: sc.color, whiteSpace: 'nowrap',
        }}>{sc.label}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.9rem', fontWeight: 700, color: C.green, margin: '0 0 2px',
          }}>
            {tx.amount.toLocaleString('fr-FR')} F
          </p>
          <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>
            {tx.sqm} m² · {tc.icon} {tc.label}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.68rem', color: C.text, margin: '0 0 1px' }}>{tx.date}</p>
          <span style={{
            padding: '2px 7px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700,
            background: tx.methodColor, color: tx.methodTextColor,
          }}>{tx.method}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Panneau détail transaction ────────────────────────────────────
function DetailPanel({ tx }) {
  if (!tx) return (
    <div style={{
      background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: '40px 20px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: '2.5rem' }}>👈</span>
      <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0 }}>
        Sélectionnez une transaction pour voir les détails
      </p>
    </div>
  )

  const sc = STATUS_CFG[tx.status] || STATUS_CFG.pending

  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(30,58,47,0.08)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
        padding: '16px 18px',
      }}>
        <p style={{ margin: '0 0 3px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Reçu de transaction · {tx.ref}
        </p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700,
          color: '#F5F0E8', margin: '0 0 3px',
        }}>{tx.terrain}</h3>
        <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>
          📍 {tx.location}
        </p>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Montant central */}
        <div style={{
          textAlign: 'center', padding: '14px',
          background: 'rgba(30,58,47,0.04)',
          borderRadius: 12, marginBottom: 14,
          border: '1px solid rgba(30,58,47,0.06)',
        }}>
          <p style={{ margin: '0 0 3px', fontSize: '0.6rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Montant</p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem', fontWeight: 700, color: C.green, margin: '0 0 4px',
          }}>
            {tx.amount.toLocaleString('fr-FR')} FCFA
          </p>
          <span style={{
            padding: '3px 10px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
            background: sc.bg, color: sc.color,
          }}>{sc.label}</span>
        </div>

        {/* Détails */}
        {[
          { label: 'Référence',   value: tx.ref,                           mono: true  },
          { label: 'Parts',       value: `${tx.sqm} m²`                               },
          { label: 'Mode',        value: tx.method                                     },
          { label: 'Date',        value: `${tx.date} à ${tx.time}`                    },
          { label: 'Attestation', value: tx.attestation ?? 'Non disponible', mono: true},
        ].map(({ label, value, mono }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', fontSize: '0.72rem',
            borderBottom: '1px solid rgba(30,58,47,0.04)',
          }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{
              fontWeight: 600, color: C.text, textAlign: 'right',
              maxWidth: '55%', fontSize: mono ? '0.62rem' : '0.7rem',
              fontFamily: mono ? 'monospace' : 'inherit',
            }}>{value}</span>
          </div>
        ))}

        {/* Actions */}
        {tx.status === 'confirmed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            <button style={{
              width: '100%', padding: '10px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 3px 12px rgba(30,58,47,0.22)',
            }}>
              📄 Télécharger le reçu PDF
            </button>
            {tx.attestation && (
              <button style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: '1px solid rgba(30,58,47,0.15)', background: 'transparent',
                color: C.green, fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                🏅 Voir l'attestation
              </button>
            )}
          </div>
        )}
        {tx.status === 'failed' && (
          <div style={{
            marginTop: 14, background: 'rgba(192,57,43,0.05)',
            border: '1px solid rgba(192,57,43,0.12)',
            borderRadius: 10, padding: '10px 12px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.72rem', color: '#C0392B', margin: '0 0 6px', fontWeight: 600 }}>
              ✗ Transaction échouée — Aucun débit effectué
            </p>
            <button style={{
              padding: '6px 16px', borderRadius: 8, border: 'none',
              background: '#C0392B', color: '#fff',
              fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}>Réessayer</button>
          </div>
        )}
        {tx.status === 'refunded' && (
          <div style={{
            marginTop: 14, background: 'rgba(100,116,139,0.06)',
            border: '1px solid rgba(100,116,139,0.15)',
            borderRadius: 10, padding: '10px 12px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.72rem', color: '#64748B', margin: 0, fontWeight: 600 }}>
              ↩ Montant remboursé sur votre compte
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : HistoriqueSection
// ═══════════════════════════════════════════════════════════════════
export default function HistoriqueSection({ isMobile }) {
  const [visible,      setVisible]      = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')
  const [search,       setSearch]       = useState('')
  const [selected,     setSelected]     = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  // Filtrage
  const filtered = TRANSACTIONS.filter(tx => {
    const q = search.toLowerCase()
    return (
      (tx.ref.toLowerCase().includes(q) || tx.terrain.toLowerCase().includes(q)) &&
      (filterStatus === 'all' || tx.status === filterStatus) &&
      (filterMethod === 'all' || tx.method === filterMethod)
    )
  })

  const stats = buildStats(TRANSACTIONS)

  const selectStyle = {
    padding: '7px 12px', borderRadius: 8,
    border: `1px solid ${C.border}`,
    background: C.surface, fontSize: '0.75rem', color: C.subtle,
    cursor: 'pointer', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>

      {/* ── Bandeau titre ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)',
        borderRadius: 16, padding: isMobile ? '18px 16px' : '20px 24px',
        marginBottom: 20,
        boxShadow: '0 4px 20px rgba(30,58,47,0.18)',
      }}>
        <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Mes transactions
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? '1.15rem' : '1.3rem',
          fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px',
        }}>
          Historique complet
        </h2>
        <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
          {TRANSACTIONS.filter(t => t.status === 'confirmed').length} transactions confirmées · {TRANSACTIONS.length} au total
        </p>
      </div>

      {/* ── Stats rapides ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 14, marginBottom: 20,
      }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} index={i} visible={visible} />
        ))}
      </div>

      {/* ── Filtres + recherche ── */}
      <div style={{
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: '14px 16px', marginBottom: 16,
        boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
      }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Recherche */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(30,58,47,0.03)',
            border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 180,
          }}>
            <span style={{ fontSize: '0.8rem', color: C.muted }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Réf., terrain..."
              style={{
                border: 'none', background: 'transparent',
                fontSize: '0.75rem', color: C.text, outline: 'none', width: '100%',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          {/* Filtre statut */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>

          {/* Filtre méthode */}
          <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} style={selectStyle}>
            <option value="all">Tous les modes</option>
            <option value="MTN MoMo">MTN MoMo</option>
            <option value="Moov Money">Moov Money</option>
            <option value="Stripe">Stripe</option>
            <option value="Paystack">Paystack</option>
          </select>

          {/* Export */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8, border: 'none',
            background: C.green, color: '#F5F0E8',
            fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap',
          }}>
            ⬇ Exporter
          </button>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: '50px 20px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '12px 0 6px' }}>
            Aucune transaction trouvée
          </p>
          <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>
            Essaie un autre filtre ou terme de recherche
          </p>
        </div>
      ) : isMobile ? (
        /* ── VUE MOBILE : cartes empilées ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(tx => (
            <TxCard
              key={tx.id} tx={tx}
              onSelect={setSelected}
              isSelected={selected?.id === tx.id}
            />
          ))}
          {selected && (
            <div style={{ marginTop: 8 }}>
              <DetailPanel tx={selected} />
            </div>
          )}
        </div>
      ) : (
        /* ── VUE DESKTOP : tableau + panneau détail sticky ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 16, alignItems: 'flex-start',
        }}>
          {/* Tableau */}
          <div style={{
            background: C.surface, borderRadius: 14,
            border: `1px solid ${C.border}`,
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAF7' }}>
                    {['Réf.', 'Terrain', 'Type', 'Montant', 'Mode', 'Statut', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '10px 14px', textAlign: 'left',
                        fontSize: '0.62rem', fontWeight: 700, color: C.muted,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(tx => (
                    <TxRow
                      key={tx.id} tx={tx}
                      onSelect={setSelected}
                      isSelected={selected?.id === tx.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {/* Footer tableau */}
            <div style={{
              padding: '10px 16px', borderTop: `1px solid ${C.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <p style={{ fontSize: '0.68rem', color: C.muted, margin: 0 }}>
                {filtered.length} sur {TRANSACTIONS.length} transaction(s)
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['←', '1', '→'].map(p => (
                  <button key={p} style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: `1px solid ${C.border}`,
                    background: p === '1' ? C.green : C.surface,
                    color: p === '1' ? '#F5F0E8' : C.subtle,
                    fontSize: '0.7rem', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Panneau détail sticky */}
          <div style={{ position: 'sticky', top: 70 }}>
            <DetailPanel tx={selected} />
          </div>
        </div>
      )}

      {/* ── Note bas de page ── */}
      <div style={{
        marginTop: 20, padding: '10px 14px',
        background: 'rgba(30,58,47,0.04)',
        border: '1px solid rgba(30,58,47,0.08)',
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: '0.78rem', flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
          Les reçus PDF sont générés automatiquement après confirmation du paiement.
          Conservez vos attestations — elles sont vérifiables hors-ligne par hash SHA-256.
        </p>
      </div>
    </div>
  )
}
