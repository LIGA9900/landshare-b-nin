// ═══════════════════════════════════════════════════════════════════
// DocumentsSection.jsx — Section "Documents" · Dashboard Investisseur
// LandShare Bénin · Design System identique Dashboard.jsx
// Palette : #F5F0E8 · #1E3A2F · #B8972A · #111810
// Polices : Playfair Display · DM Sans · tailles réduites
// Responsive : desktop + mobile
// ═══════════════════════════════════════════════════════════════════
//
// INTÉGRATION DANS Dashboard.jsx :
// 1. Copier ce fichier dans src/pages/investor/DocumentsSection.jsx
// 2. Importer : import DocumentsSection from './DocumentsSection'
// 3. Dans MainContent(), ajouter :
//    if (active === 'documents') return <DocumentsSection isMobile={isMobile} />
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
const DOCUMENTS = [
  {
    id: 1,
    nom:      'Attestation_Calavi_Nord_ATT-2025-LS-00247.pdf',
    label:    'Attestation de propriété',
    type:     'attestation',
    terrain:  'Calavi Nord — Zone Résidentielle',
    ref:      'ATT-2025-LS-00247',
    date:     '03 Mai 2026',
    size:     '284 Ko',
    status:   'valid',
    hash:     'a3f7c9e2b1d84056',
    sqm:      5,
  },
  {
    id: 2,
    nom:      'Attestation_Fidjrosse_ATT-2025-LS-00189.pdf',
    label:    'Attestation de propriété',
    type:     'attestation',
    terrain:  'Fidjrossè Balnéaire',
    ref:      'ATT-2025-LS-00189',
    date:     '15 Oct 2025',
    size:     '291 Ko',
    status:   'valid',
    hash:     'b2e8d1f5c4a93712',
    sqm:      10,
  },
  {
    id: 3,
    nom:      'Attestation_Calavi_Nord_ATT-2025-LS-00201.pdf',
    label:    'Attestation de propriété',
    type:     'attestation',
    terrain:  'Calavi Nord — Zone Résidentielle',
    ref:      'ATT-2025-LS-00201',
    date:     '28 Oct 2025',
    size:     '278 Ko',
    status:   'valid',
    hash:     'c9d4e7a1b3f26058',
    sqm:      8,
  },
  {
    id: 4,
    nom:      'Attestation_Parakou_ATT-2025-LS-00174.pdf',
    label:    'Attestation de propriété',
    type:     'attestation',
    terrain:  'Parakou Nord — Lot B',
    ref:      'ATT-2025-LS-00174',
    date:     '02 Oct 2025',
    size:     '265 Ko',
    status:   'valid',
    hash:     'd1f8b2c6e5a74930',
    sqm:      3,
  },
  {
    id: 5,
    nom:      'Recu_Paiement_LS-054.pdf',
    label:    'Reçu de paiement',
    type:     'recu',
    terrain:  'Calavi Nord — Zone Résidentielle',
    ref:      'LS-054',
    date:     '03 Mai 2026',
    size:     '142 Ko',
    status:   'valid',
    hash:     null,
    sqm:      5,
  },
  {
    id: 6,
    nom:      'Recu_Paiement_LS-047.pdf',
    label:    'Reçu de paiement',
    type:     'recu',
    terrain:  'Fidjrossè Balnéaire',
    ref:      'LS-047',
    date:     '15 Oct 2025',
    size:     '138 Ko',
    status:   'valid',
    hash:     null,
    sqm:      10,
  },
  {
    id: 7,
    nom:      'Contrat_Investissement_Calavi_Nord.pdf',
    label:    'Contrat d\'investissement',
    type:     'contrat',
    terrain:  'Calavi Nord — Zone Résidentielle',
    ref:      'CTR-2025-001',
    date:     '28 Oct 2025',
    size:     '512 Ko',
    status:   'valid',
    hash:     null,
    sqm:      null,
  },
  {
    id: 8,
    nom:      'Titre_Foncier_Calavi_Nord_TF-12847.pdf',
    label:    'Titre foncier (copie)',
    type:     'titre',
    terrain:  'Calavi Nord — Zone Résidentielle',
    ref:      'TF-12847',
    date:     '01 Sep 2025',
    size:     '1.2 Mo',
    status:   'valid',
    hash:     null,
    sqm:      null,
  },
  {
    id: 9,
    nom:      'KYC_Verification_Ligali_Fouad.pdf',
    label:    'Vérification KYC',
    type:     'kyc',
    terrain:  null,
    ref:      'KYC-2025-241',
    date:     '20 Sep 2025',
    size:     '95 Ko',
    status:   'valid',
    hash:     null,
    sqm:      null,
  },
]

// ─── Config types ──────────────────────────────────────────────────
const TYPE_CFG = {
  attestation: { icon: '🏅', label: 'Attestation',  bg: 'rgba(184,151,42,0.1)',  color: '#8B6D14'  },
  recu:        { icon: '🧾', label: 'Reçu',          bg: 'rgba(30,58,47,0.08)',   color: '#1E3A2F'  },
  contrat:     { icon: '📋', label: 'Contrat',        bg: 'rgba(61,107,83,0.1)',   color: '#3D6B53'  },
  titre:       { icon: '📜', label: 'Titre foncier',  bg: 'rgba(100,116,139,0.1)',color: '#475569'  },
  kyc:         { icon: '🪪', label: 'KYC',            bg: 'rgba(139,110,26,0.1)', color: '#8B6E1A'  },
}

// ─── Compteurs par type ────────────────────────────────────────────
function buildStats(docs) {
  return [
    { icon: '📁', label: 'Total documents',  value: docs.length,                                    sub: 'Tous types confondus'   },
    { icon: '🏅', label: 'Attestations',     value: docs.filter(d=>d.type==='attestation').length,  sub: 'Propriétés certifiées'  },
    { icon: '🧾', label: 'Reçus',            value: docs.filter(d=>d.type==='recu').length,         sub: 'Paiements confirmés'    },
    { icon: '📋', label: 'Contrats & titres',value: docs.filter(d=>['contrat','titre'].includes(d.type)).length, sub: 'Documents légaux' },
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
      transition: `opacity 0.4s ease ${index*0.08}s, transform 0.4s ease ${index*0.08}s`,
    }}>
      <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{icon}</div>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.2rem', fontWeight: 700, color: C.green, margin: '0 0 3px',
      }}>{value}</p>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text,  margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '0.6rem',  color: C.muted, margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Carte document ────────────────────────────────────────────────
function DocCard({ doc, onSelect, isSelected, isMobile }) {
  const [dlAnim, setDlAnim] = useState(false)
  const tc = TYPE_CFG[doc.type] || TYPE_CFG.recu

  const handleDl = (e) => {
    e.stopPropagation()
    setDlAnim(true)
    setTimeout(() => setDlAnim(false), 1500)
  }

  return (
    <div
      onClick={() => onSelect(doc)}
      style={{
        background: C.surface, borderRadius: 12,
        border: `1.5px solid ${isSelected ? C.green : C.border}`,
        padding: '14px 16px', cursor: 'pointer',
        boxShadow: isSelected
          ? '0 4px 16px rgba(30,58,47,0.1)'
          : '0 1px 6px rgba(30,58,47,0.04)',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(30,58,47,0.2)' }}}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.border }}}
    >
      {/* Icône type */}
      <div style={{
        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
        background: tc.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem',
      }}>
        {tc.icon}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600,
            background: tc.bg, color: tc.color, whiteSpace: 'nowrap',
          }}>{tc.label}</span>
          {doc.terrain && (
            <span style={{ fontSize: '0.62rem', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? 120 : 200 }}>
              📍 {doc.terrain}
            </span>
          )}
        </div>
        <p style={{
          fontSize: '0.75rem', fontWeight: 600, color: C.text,
          margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {doc.label}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.gold, fontWeight: 600 }}>{doc.ref}</span>
          <span style={{ fontSize: '0.62rem', color: C.muted }}>{doc.date}</span>
          <span style={{ fontSize: '0.62rem', color: C.muted }}>{doc.size}</span>
        </div>
      </div>

      {/* Bouton DL */}
      <button
        onClick={handleDl}
        title="Télécharger"
        style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: dlAnim ? C.green : 'rgba(30,58,47,0.07)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: dlAnim ? '0.75rem' : '0.9rem',
          color: dlAnim ? '#F5F0E8' : C.green,
          transition: 'all 0.25s',
        }}
      >
        {dlAnim ? '✓' : '⬇'}
      </button>
    </div>
  )
}

// ─── Panneau détail document ───────────────────────────────────────
function DetailPanel({ doc }) {
  const [copied, setCopied] = useState(false)

  const copyHash = () => {
    navigator.clipboard.writeText(doc.hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!doc) return (
    <div style={{
      background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: '40px 20px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: '2.5rem' }}>👈</span>
      <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0 }}>
        Sélectionnez un document pour voir les détails
      </p>
    </div>
  )

  const tc = TYPE_CFG[doc.type] || TYPE_CFG.recu

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
        <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Document · {doc.ref}
        </p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700,
          color: '#F5F0E8', margin: '0 0 3px',
        }}>{doc.label}</h3>
        {doc.terrain && (
          <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>
            📍 {doc.terrain}
          </p>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Preview */}
        <div style={{
          background: '#F5F0E8', borderRadius: 10, padding: '24px 20px',
          textAlign: 'center', border: '2px dashed rgba(30,58,47,0.12)',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 6 }}>{tc.icon}</span>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.green, margin: '0 0 2px' }}>{doc.nom}</p>
          <p style={{ fontSize: '0.65rem', color: C.muted, margin: '0 0 12px' }}>
            PDF · {doc.size}
          </p>
          <button style={{
            padding: '7px 18px', borderRadius: 8, border: 'none',
            background: C.green, color: '#F5F0E8',
            fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            👁 Prévisualiser
          </button>
        </div>

        {/* Métadonnées */}
        {[
          { label: 'Type',       value: tc.label                           },
          { label: 'Référence',  value: doc.ref,        mono: true         },
          { label: 'Date',       value: doc.date                           },
          { label: 'Taille',     value: doc.size                           },
          doc.sqm  ? { label: 'Parts concernées', value: `${doc.sqm} m²` } : null,
          doc.terrain ? { label: 'Terrain', value: doc.terrain            } : null,
        ].filter(Boolean).map(({ label, value, mono }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', fontSize: '0.72rem',
            borderBottom: '1px solid rgba(30,58,47,0.04)',
          }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{
              fontWeight: 600, color: C.text, textAlign: 'right',
              maxWidth: '60%', fontSize: mono ? '0.62rem' : '0.7rem',
              fontFamily: mono ? 'monospace' : 'inherit',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{value}</span>
          </div>
        ))}

        {/* Hash SHA-256 (attestations uniquement) */}
        {doc.hash && (
          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: 'rgba(30,58,47,0.04)',
            border: '1px solid rgba(30,58,47,0.08)',
            borderRadius: 10,
          }}>
            <p style={{ margin: '0 0 5px', fontSize: '0.62rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              🔐 Hash SHA-256
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{
                fontSize: '0.62rem', color: C.green, fontFamily: 'monospace',
                background: 'rgba(30,58,47,0.06)', padding: '3px 7px',
                borderRadius: 5, flex: 1, wordBreak: 'break-all',
                border: '1px solid rgba(30,58,47,0.1)',
              }}>{doc.hash}</code>
              <button onClick={copyHash} style={{
                padding: '4px 10px', borderRadius: 6, border: 'none',
                background: copied ? C.green : 'rgba(30,58,47,0.08)',
                color: copied ? '#F5F0E8' : C.green,
                fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}>
                {copied ? '✓ Copié' : 'Copier'}
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          <button style={{
            width: '100%', padding: '10px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
            color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 3px 12px rgba(30,58,47,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            ⬇ Télécharger le PDF
          </button>
          <button style={{
            width: '100%', padding: '10px', borderRadius: 10,
            border: '1px solid rgba(30,58,47,0.15)', background: 'transparent',
            color: C.green, fontSize: '0.75rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            📤 Partager
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : DocumentsSection
// ═══════════════════════════════════════════════════════════════════
export default function DocumentsSection({ isMobile }) {
  const [visible,     setVisible]     = useState(false)
  const [filterType,  setFilterType]  = useState('all')
  const [search,      setSearch]      = useState('')
  const [selected,    setSelected]    = useState(null)
  const [vue,         setVue]         = useState('liste')

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  // Filtrage
  const filtered = DOCUMENTS.filter(doc => {
    const q = search.toLowerCase()
    return (
      (doc.nom.toLowerCase().includes(q)     ||
       doc.ref.toLowerCase().includes(q)     ||
       (doc.terrain ?? '').toLowerCase().includes(q)) &&
      (filterType === 'all' || doc.type === filterType)
    )
  })

  const stats = buildStats(DOCUMENTS)

  const TYPE_FILTRES = [
    { id: 'all',         label: 'Tous'         },
    { id: 'attestation', label: 'Attestations' },
    { id: 'recu',        label: 'Reçus'        },
    { id: 'contrat',     label: 'Contrats'     },
    { id: 'titre',       label: 'Titres'       },
    { id: 'kyc',         label: 'KYC'          },
  ]

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
          Centre de documents
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? '1.15rem' : '1.3rem',
          fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px',
        }}>
          Mes documents
        </h2>
        <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
          {DOCUMENTS.length} documents disponibles · Attestations, reçus, contrats, titres fonciers
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 14, marginBottom: 20,
      }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} index={i} visible={visible} />
        ))}
      </div>

      {/* ── Barre filtres + recherche ── */}
      <div style={{
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: '14px 16px', marginBottom: 16,
        boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
      }}>
        {/* Recherche */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(30,58,47,0.03)',
          border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '8px 12px', marginBottom: 12,
        }}>
          <span style={{ fontSize: '0.8rem', color: C.muted }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, référence, terrain..."
            style={{
              border: 'none', background: 'transparent',
              fontSize: '0.75rem', color: C.text, outline: 'none', width: '100%',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Filtres type */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPE_FILTRES.map(f => (
              <button key={f.id} onClick={() => setFilterType(f.id)} style={{
                padding: '5px 12px', borderRadius: 20,
                border: `1px solid ${filterType === f.id ? C.green : 'rgba(30,58,47,0.15)'}`,
                background: filterType === f.id ? C.green : 'transparent',
                color: filterType === f.id ? '#F5F0E8' : C.subtle,
                fontSize: '0.68rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}>{f.label}</button>
            ))}
          </div>

          {/* Toggle vue grille/liste */}
          {!isMobile && (
            <div style={{
              display: 'flex', gap: 0,
              background: 'rgba(30,58,47,0.06)',
              borderRadius: 8, padding: 3,
            }}>
              {[{ id: 'liste', icon: '☰' }, { id: 'grille', icon: '⊞' }].map(v => (
                <button key={v.id} onClick={() => setVue(v.id)} style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none',
                  background: vue === v.id ? C.green : 'transparent',
                  color: vue === v.id ? '#F5F0E8' : C.muted,
                  fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                }}>{v.icon}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Contenu ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: '50px 20px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '12px 0 6px' }}>
            Aucun document trouvé
          </p>
          <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>
            Essaie un autre filtre ou terme de recherche
          </p>
        </div>
      ) : isMobile || vue === 'liste' ? (
        /* ── VUE LISTE ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: isMobile ? 10 : 16,
        }}>
          {/* Liste + détail sticky desktop */}
          {isMobile ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(doc => (
                  <DocCard key={doc.id} doc={doc} isMobile={true}
                    onSelect={setSelected} isSelected={selected?.id === doc.id} />
                ))}
              </div>
              {selected && <DetailPanel doc={selected} />}
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(doc => (
                  <DocCard key={doc.id} doc={doc} isMobile={false}
                    onSelect={setSelected} isSelected={selected?.id === doc.id} />
                ))}
              </div>
              <div style={{ position: 'sticky', top: 70 }}>
                <DetailPanel doc={selected} />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── VUE GRILLE ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 14 }}>
          {filtered.map(doc => {
            const tc = TYPE_CFG[doc.type] || TYPE_CFG.recu
            return (
              <div
                key={doc.id}
                onClick={() => setSelected(doc)}
                style={{
                  background: C.surface, borderRadius: 12,
                  border: `1.5px solid ${selected?.id===doc.id ? C.green : C.border}`,
                  overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(30,58,47,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(30,58,47,0.05)' }}
              >
                {/* Vignette */}
                <div style={{
                  background: tc.bg, height: 80,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem',
                }}>
                  {tc.icon}
                </div>
                <div style={{ padding: '12px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600,
                    background: tc.bg, color: tc.color,
                    display: 'inline-block', marginBottom: 6,
                  }}>{tc.label}</span>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, margin: '0 0 4px', lineHeight: 1.3 }}>
                    {doc.label}
                  </p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.gold, margin: '0 0 4px' }}>
                    {doc.ref}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color: C.muted }}>{doc.size}</span>
                    <button
                      onClick={e => e.stopPropagation()}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: 'none',
                        background: 'rgba(30,58,47,0.07)', color: C.green,
                        fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                      }}>⬇ DL</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Note bas de page ── */}
      <div style={{
        marginTop: 20, padding: '10px 14px',
        background: 'rgba(30,58,47,0.04)',
        border: '1px solid rgba(30,58,47,0.08)',
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: '0.78rem', flexShrink: 0 }}>🔒</span>
        <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
          Tous vos documents sont chiffrés et stockés de façon sécurisée.
          Les attestations sont vérifiables hors-ligne via leur hash SHA-256.
        </p>
      </div>
    </div>
  )
}
