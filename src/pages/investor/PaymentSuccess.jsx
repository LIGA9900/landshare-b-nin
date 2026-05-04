// ═══════════════════════════════════════════════════════════════════
// PaymentSuccess.jsx — Page Succès & Attestation · LandShare Bénin
// Design System : identique Payment.jsx + AdminDashboard.jsx
// Palette : #F5F0E8 crème · #1E3A2F vert forêt · #B8972A or · #111810
// Polices : Playfair Display · DM Sans · tailles réduites (style Payment)
// Responsive : mobile + desktop
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ─── Tokens de couleur ─────────────────────────────────────────────
const C = {
  bg:      '#F5F0E8',
  surface: '#FFFFFF',
  green:   '#1E3A2F',
  green2:  '#2D5241',
  gold:    '#B8972A',
  goldTxt: '#D4AD3A',
  cream:   '#F5F0E8',
  text:    '#1A1A1A',
  muted:   '#8C8278',
  subtle:  '#6B6459',
  border:  'rgba(30,58,47,0.09)',
  red:     '#DC3545',
}

// ─── Polices ───────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'
    link.rel  = 'stylesheet'
    document.head.appendChild(link)
  }, [])
}

// ─── Données d'attestation (viendront du store/API plus tard) ──────
const ATTESTATION = {
  numero:        'ATT-2025-LS-00247',
  hash:          'a3f7c9e2b1d84056f2a1c3e7',
  qrUrl:         null, // à brancher avec le vrai QR
  generatedAt:   new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' }),
  investisseur: {
    nom:         'Aisha Koné',
    email:       'aisha.kone@email.com',
    pays:        '🇧🇯 Bénin',
  },
  terrain: {
    nom:         'Calavi Nord — Zone Résidentielle',
    localisation:'Abomey-Calavi, Atlantique, Bénin',
    reference:   'TRN-001',
    notaire:     'Maître Kofi Akobi',
  },
  investissement: {
    sqm:          5,
    pricePerSqm:  15000,
    subtotal:     75000,
    commission:   2250,
    total:        77250,
    methode:      'MTN MoMo',
    transactionId:'LS-054',
    confirmedAt:  new Date().toLocaleString('fr-FR'),
  },
}

// ═══════════════════════════════════════════════════════════════════
// Stepper (identique Payment.jsx · étape 2 = Confirmation active)
// ═══════════════════════════════════════════════════════════════════
function Stepper() {
  const steps = [
    { id: 0, label: 'Sélection'    },
    { id: 1, label: 'Paiement'     },
    { id: 2, label: 'Confirmation' },
  ]
  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom:28, padding:'0 4px' }}>
      {steps.map((step, i) => (
        <div key={step.id} style={{ display:'flex', alignItems:'center', flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{
              width:30, height:30, borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'0.72rem', fontWeight:700, flexShrink:0,
              background: i <= 2 ? C.green : 'transparent',
              border: `2px solid ${i <= 2 ? C.green : 'rgba(30,58,47,0.2)'}`,
              color: i <= 2 ? '#F5F0E8' : C.muted,
              transition:'all 0.3s',
            }}>
              {i < 2 ? '✓' : i === 2 ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize:'0.65rem', fontWeight:500,
              color: i <= 2 ? C.green : C.muted,
              whiteSpace:'nowrap',
            }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex:1, height:1.5, margin:'0 8px', marginBottom:18,
              background: C.green, transition:'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Icône succès animée
// ═══════════════════════════════════════════════════════════════════
function SuccessIcon() {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t) }, [])

  return (
    <div style={{
      width:72, height:72, borderRadius:'50%',
      background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 6px 28px rgba(30,58,47,0.3)',
      transform: animate ? 'scale(1)' : 'scale(0.4)',
      opacity: animate ? 1 : 0,
      transition:'transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.4s ease',
      flexShrink:0,
    }}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <path
          d="M8 17L14 23L26 11"
          stroke="#F5F0E8"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 30,
            strokeDashoffset: animate ? 0 : 30,
            transition:'stroke-dashoffset 0.5s ease 0.35s',
          }}
        />
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Bandeau de confirmation
// ═══════════════════════════════════════════════════════════════════
function ConfirmationBanner({ data, isMobile }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div style={{
      background:'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)',
      borderRadius:16, padding: isMobile ? '20px 18px' : '22px 28px',
      boxShadow:'0 4px 20px rgba(30,58,47,0.2)',
      transform: show ? 'translateY(0)' : 'translateY(-12px)',
      opacity: show ? 1 : 0,
      transition:'transform 0.45s ease, opacity 0.45s ease',
    }}>
      {/* Ligne 1 */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
        <SuccessIcon />
        <div>
          <p style={{ margin:'0 0 3px', fontSize:'0.65rem', color:'rgba(245,240,232,0.55)', letterSpacing:'0.07em', textTransform:'uppercase' }}>
            Paiement confirmé
          </p>
          <h2 style={{
            margin:'0 0 3px',
            fontFamily:"'Playfair Display', serif",
            fontSize: isMobile ? '1.15rem' : '1.3rem',
            fontWeight:700, color:'#F5F0E8',
          }}>
            Investissement réussi 🎉
          </h2>
          <p style={{ margin:0, fontSize:'0.7rem', color:'rgba(245,240,232,0.55)' }}>
            Transaction ID : <strong style={{ color:C.goldTxt, fontFamily:'monospace' }}>
              {data.investissement.transactionId}
            </strong>
          </p>
        </div>
      </div>

      {/* Ligne 2 : chips infos */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {[
          { emoji:'📐', val:`${data.investissement.sqm} m²` },
          { emoji:'💰', val:`${data.investissement.total.toLocaleString('fr-FR')} FCFA` },
          { emoji:'📲', val: data.investissement.methode },
          { emoji:'📅', val: data.attestation?.generatedAt ?? data.generatedAt ?? 'Aujourd\'hui' },
        ].map(({ emoji, val }) => (
          <div key={val} style={{
            display:'flex', alignItems:'center', gap:5,
            background:'rgba(245,240,232,0.08)',
            border:'1px solid rgba(245,240,232,0.12)',
            borderRadius:8, padding:'5px 10px',
          }}>
            <span style={{ fontSize:'0.78rem' }}>{emoji}</span>
            <span style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.8)', fontWeight:500 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Carte Attestation (version web — identité visuelle premium)
// ═══════════════════════════════════════════════════════════════════
function AttestationCard({ data, isMobile }) {
  const [copied, setCopied] = useState(false)

  const copyHash = () => {
    navigator.clipboard.writeText(data.hash).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const rows = [
    { label:'Investisseur',   value: data.investisseur.nom },
    { label:'Email',          value: data.investisseur.email },
    { label:'Pays',           value: data.investisseur.pays },
    { label:'Terrain',        value: data.terrain.nom },
    { label:'Localisation',   value: data.terrain.localisation },
    { label:'Référence',      value: data.terrain.reference },
    { label:'Parts acquises', value: `${data.investissement.sqm} m²`, highlight:true },
    { label:'Montant payé',   value: `${data.investissement.total.toLocaleString('fr-FR')} FCFA`, highlight:true },
    { label:'Méthode',        value: data.investissement.methode },
    { label:'Confirmé le',    value: data.investissement.confirmedAt },
    { label:'Notaire',        value: data.terrain.notaire },
  ]

  return (
    <div style={{
      background:C.surface, borderRadius:14,
      boxShadow:'0 2px 14px rgba(30,58,47,0.08)',
      border:'1px solid rgba(30,58,47,0.07)',
      overflow:'hidden',
    }}>

      {/* ── En-tête attestation ── */}
      <div style={{
        background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
        padding:'16px 18px',
        display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10,
      }}>
        <div>
          <p style={{ margin:'0 0 2px', fontSize:'0.6rem', color:'rgba(245,240,232,0.5)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
            Certificat de propriété fractionnée
          </p>
          <h3 style={{
            margin:'0 0 4px',
            fontFamily:"'Playfair Display', serif",
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight:700, color:'#F5F0E8',
          }}>
            LandShare Bénin
          </h3>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{
              background:'rgba(184,151,42,0.25)',
              border:'1px solid rgba(184,151,42,0.4)',
              borderRadius:6, padding:'2px 8px',
              fontSize:'0.62rem', fontWeight:700,
              color:C.goldTxt, fontFamily:'monospace',
              letterSpacing:'0.04em',
            }}>
              {data.numero}
            </span>
          </div>
        </div>

        {/* Badge vérifié */}
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center', gap:2,
          background:'rgba(184,151,42,0.15)',
          border:'1px solid rgba(184,151,42,0.3)',
          borderRadius:10, padding:'8px 12px',
        }}>
          <span style={{ fontSize:'1.3rem' }}>🏅</span>
          <span style={{ fontSize:'0.58rem', fontWeight:700, color:C.goldTxt, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            Certifié
          </span>
        </div>
      </div>

      {/* ── Corps : tableau des détails ── */}
      <div style={{ padding:'14px 18px' }}>
        {rows.map(({ label, value, highlight }) => (
          <div key={label} style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'5px 0',
            borderBottom:'1px solid rgba(30,58,47,0.04)',
          }}>
            <span style={{ fontSize:'0.7rem', color:C.subtle }}>{label}</span>
            <span style={{
              fontSize:'0.72rem',
              fontWeight: highlight ? 700 : 500,
              color: highlight ? C.green : '#4A3F35',
              fontFamily: highlight ? "'Playfair Display', serif" : 'inherit',
              textAlign:'right', maxWidth:'55%',
            }}>
              {value}
            </span>
          </div>
        ))}

        {/* Hash de vérification */}
        <div style={{
          marginTop:12, padding:'10px 12px',
          background:'rgba(30,58,47,0.04)',
          border:'1px solid rgba(30,58,47,0.08)',
          borderRadius:10,
        }}>
          <p style={{ margin:'0 0 5px', fontSize:'0.62rem', color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            🔐 Hash de vérification (SHA-256)
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <code style={{
              fontSize:'0.63rem', color:C.green, fontFamily:'monospace',
              background:'rgba(30,58,47,0.06)', padding:'3px 7px',
              borderRadius:5, flex:1, minWidth:0, wordBreak:'break-all',
              border:'1px solid rgba(30,58,47,0.1)',
            }}>
              {data.hash}
            </code>
            <button
              onClick={copyHash}
              style={{
                padding:'4px 10px', borderRadius:6, border:'none',
                background: copied ? C.green : 'rgba(30,58,47,0.08)',
                color: copied ? '#F5F0E8' : C.green,
                fontSize:'0.62rem', fontWeight:600, cursor:'pointer',
                transition:'all 0.2s', whiteSpace:'nowrap',
                fontFamily:"'DM Sans', sans-serif",
              }}
            >
              {copied ? '✓ Copié' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Note juridique */}
        <p style={{
          marginTop:10, fontSize:'0.62rem', color:C.muted,
          lineHeight:1.55, textAlign:'center',
        }}>
          Ce certificat atteste de l'acquisition de {data.investissement.sqm} m² sur le terrain{' '}
          <strong style={{ color:C.subtle }}>{data.terrain.reference}</strong>.
          Il est vérifiable hors-ligne par son hash.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Bloc actions (télécharger PDF, tableau de bord, partager)
// ═══════════════════════════════════════════════════════════════════
function ActionButtons({ isMobile }) {
  const navigate = useNavigate()
  const [dlLoading, setDlLoading] = useState(false)

  const handleDownload = () => {
    setDlLoading(true)
    // TODO: appeler l'endpoint /api/attestations/:id/pdf
    setTimeout(() => setDlLoading(false), 1800)
  }

  const btnBase = {
    display:'flex', alignItems:'center', justifyContent:'center', gap:7,
    padding: isMobile ? '12px' : '12px 18px',
    borderRadius:11, border:'none', cursor:'pointer',
    fontSize:'0.82rem', fontWeight:600,
    fontFamily:"'DM Sans', sans-serif",
    transition:'all 0.2s',
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

      {/* CTA principal : télécharger PDF */}
      <button
        onClick={handleDownload}
        disabled={dlLoading}
        style={{
          ...btnBase,
          background: dlLoading
            ? 'rgba(30,58,47,0.45)'
            : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
          color:'#F5F0E8',
          boxShadow: dlLoading ? 'none' : '0 4px 16px rgba(30,58,47,0.28)',
        }}
        onMouseEnter={e => {
          if (!dlLoading) {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,47,0.38)'
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,47,0.28)'
        }}
      >
        {dlLoading ? (
          <>
            <div style={{
              width:14, height:14, borderRadius:'50%',
              border:'2px solid rgba(245,240,232,0.3)',
              borderTopColor:'#F5F0E8',
              animation:'spin 0.7s linear infinite',
            }} />
            Génération du PDF...
          </>
        ) : (
          <>📄 Télécharger mon attestation PDF</>
        )}
      </button>

      {/* Secondaires */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            ...btnBase,
            background:'rgba(30,58,47,0.07)',
            color:C.green,
            border:'1px solid rgba(30,58,47,0.12)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,47,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,58,47,0.07)'}
        >
          📊 Mon tableau de bord
        </button>

        <button
          onClick={() => navigate('/terrains')}
          style={{
            ...btnBase,
            background:'rgba(184,151,42,0.1)',
            color:'#8B6D14',
            border:'1px solid rgba(184,151,42,0.22)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,151,42,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(184,151,42,0.1)'}
        >
          🗺️ Explorer les terrains
        </button>
      </div>

      {/* Partager */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:12,
        paddingTop:12,
        borderTop:'1px solid rgba(30,58,47,0.08)',
      }}>
        <span style={{ fontSize:'0.62rem', color:C.muted }}>Partager :</span>
        {[
          { emoji:'📧', label:'Email',     action: () => window.location.href = 'mailto:?subject=Mon attestation LandShare' },
          { emoji:'💬', label:'WhatsApp',  action: () => window.open('https://wa.me/?text=J\'ai investi sur LandShare Bénin !') },
          { emoji:'🔗', label:'Copier lien', action: () => navigator.clipboard.writeText(window.location.href) },
        ].map(({ emoji, label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:2,
              background:'none', border:'none', cursor:'pointer', padding:'4px 6px',
            }}
          >
            <span style={{ fontSize:'1rem' }}>{emoji}</span>
            <span style={{ fontSize:'0.6rem', color:C.muted }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Panneau lateral droit : récap compact + prochaines étapes
// ═══════════════════════════════════════════════════════════════════
function RightPanel({ data, isMobile }) {
  const steps = [
    { icon:'✅', title:'Paiement confirmé',        sub:'Transaction traitée avec succès',     done:true  },
    { icon:'📄', title:'Attestation générée',       sub:'PDF disponible au téléchargement',    done:true  },
    { icon:'🔍', title:'Enregistrement foncier',    sub:'Traitement par l\'opérateur (48h)',   done:false },
    { icon:'📬', title:'Email de confirmation',     sub:'Envoyé à '+data.investisseur.email,   done:true  },
    { icon:'💼', title:'Portefeuille mis à jour',   sub:'Visible dans votre tableau de bord',  done:true  },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Récap compact */}
      <div style={{
        background:C.surface, borderRadius:14,
        boxShadow:'0 2px 12px rgba(30,58,47,0.06)',
        border:'1px solid rgba(30,58,47,0.06)',
        overflow:'hidden',
      }}>
        <div style={{
          background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
          padding:'12px 16px',
        }}>
          <p style={{ margin:'0 0 2px', fontSize:'0.6rem', color:'rgba(245,240,232,0.55)', letterSpacing:'0.07em', textTransform:'uppercase' }}>
            Récapitulatif
          </p>
          <h3 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:'0.92rem', fontWeight:700,
            color:'#F5F0E8', margin:0,
          }}>
            {data.terrain.nom}
          </h3>
          <p style={{ fontSize:'0.65rem', color:'rgba(245,240,232,0.5)', margin:'2px 0 0' }}>
            📍 {data.terrain.localisation}
          </p>
        </div>
        <div style={{ padding:'12px 16px' }}>
          {[
            { label:'Parts acquises',  value:`${data.investissement.sqm} m²`                                     },
            { label:'Prix unitaire',   value:`${data.investissement.pricePerSqm.toLocaleString('fr-FR')} FCFA`   },
            { label:'Sous-total',      value:`${data.investissement.subtotal.toLocaleString('fr-FR')} FCFA`       },
            { label:'Commission (3%)', value:`${data.investissement.commission.toLocaleString('fr-FR')} FCFA`     },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display:'flex', justifyContent:'space-between',
              fontSize:'0.72rem', padding:'4px 0', color:C.subtle,
              borderBottom:'1px solid rgba(30,58,47,0.04)',
            }}>
              <span>{label}</span>
              <span style={{ fontFamily:'monospace', color:'#4A3F35' }}>{value}</span>
            </div>
          ))}
          <div style={{
            display:'flex', justifyContent:'space-between',
            alignItems:'center', padding:'9px 0 0',
            borderTop:'1.5px solid rgba(30,58,47,0.1)',
          }}>
            <span style={{ fontSize:'0.78rem', fontWeight:700, color:C.text }}>TOTAL TTC</span>
            <span style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:'1rem', fontWeight:700, color:C.green,
            }}>
              {data.investissement.total.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Prochaines étapes */}
      <div style={{
        background:C.surface, borderRadius:14,
        boxShadow:'0 2px 12px rgba(30,58,47,0.06)',
        border:'1px solid rgba(30,58,47,0.06)',
        padding:'14px 16px',
      }}>
        <p style={{
          margin:'0 0 12px', fontSize:'0.7rem', fontWeight:600,
          color:C.green, textTransform:'uppercase', letterSpacing:'0.06em',
        }}>
          Prochaines étapes
        </p>
        {steps.map(({ icon, title, sub, done }, idx) => (
          <div key={idx} style={{
            display:'flex', gap:10, alignItems:'flex-start',
            marginBottom: idx < steps.length - 1 ? 10 : 0,
            opacity: done ? 1 : 0.55,
          }}>
            <div style={{
              width:28, height:28, borderRadius:'50%', flexShrink:0,
              background: done ? 'rgba(30,58,47,0.09)' : 'rgba(140,130,120,0.1)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'0.8rem',
            }}>
              {icon}
            </div>
            <div>
              <p style={{ margin:'0 0 1px', fontSize:'0.72rem', fontWeight:600, color: done ? C.text : C.muted }}>{title}</p>
              <p style={{ margin:0, fontSize:'0.63rem', color:C.muted, lineHeight:1.4 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Note notaire */}
      <div style={{
        background:'rgba(30,58,47,0.04)',
        border:'1px solid rgba(30,58,47,0.08)',
        borderRadius:10, padding:'10px 12px',
        display:'flex', gap:7,
      }}>
        <span style={{ fontSize:'0.75rem', flexShrink:0 }}>🏅</span>
        <p style={{ fontSize:'0.63rem', color:C.subtle, margin:0, lineHeight:1.5 }}>
          Terrain certifié par{' '}
          <strong style={{ color:C.green }}>{data.terrain.notaire}</strong>,
          Notaire à Cotonou.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function PaymentSuccess() {
  useFonts()

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 640
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{
      minHeight:'100vh',
      background:C.bg,
      fontFamily:"'DM Sans', sans-serif",
    }}>

      {/* ── Topbar ── */}
      <header style={{
        position:'sticky', top:0, zIndex:50,
        background:'rgba(245,240,232,0.92)',
        backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(30,58,47,0.08)',
        padding: isMobile ? '10px 16px' : '10px 24px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:28, height:28, borderRadius:8,
            background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontSize:'0.75rem' }}>🌿</span>
          </div>
          <span style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:'0.95rem', fontWeight:700, color:C.green,
          }}>
            LandShare
          </span>
        </Link>

        <div style={{
          background:'rgba(30,58,47,0.07)',
          border:'1px solid rgba(30,58,47,0.1)',
          borderRadius:8, padding:'4px 10px',
          display:'flex', alignItems:'center', gap:5,
        }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#27AE60' }} />
          <span style={{ fontSize:'0.65rem', fontWeight:600, color:C.green }}>
            Paiement sécurisé
          </span>
        </div>
      </header>

      {/* ── Contenu ── */}
      <main style={{
        maxWidth:960, margin:'0 auto',
        padding: isMobile ? '20px 14px 60px' : '28px 20px 60px',
      }}>
        {/* Stepper */}
        <Stepper />

        {/* Bandeau succès */}
        <div style={{ marginBottom:20 }}>
          <ConfirmationBanner data={ATTESTATION} isMobile={isMobile} />
        </div>

        {/* Grille principale */}
        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 288px',
          gap:20,
          alignItems:'flex-start',
        }}>
          {/* Colonne gauche : attestation + actions */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <AttestationCard data={ATTESTATION} isMobile={isMobile} />
            <div style={{
              background:C.surface, borderRadius:14,
              boxShadow:'0 2px 12px rgba(30,58,47,0.06)',
              border:'1px solid rgba(30,58,47,0.06)',
              padding:'16px 18px',
            }}>
              <p style={{
                margin:'0 0 12px',
                fontSize:'0.7rem', fontWeight:600,
                color:C.green, textTransform:'uppercase', letterSpacing:'0.06em',
              }}>
                Actions
              </p>
              <ActionButtons isMobile={isMobile} />
            </div>
          </div>

          {/* Colonne droite : récap sticky + steps (mobile : en bas) */}
          {isMobile ? (
            <RightPanel data={ATTESTATION} isMobile={true} />
          ) : (
            <div style={{ position:'sticky', top:70 }}>
              <RightPanel data={ATTESTATION} isMobile={false} />
            </div>
          )}
        </div>
      </main>

      {/* ── CSS global ── */}
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(30,58,47,0.15); border-radius:3px; }
      `}</style>
    </div>
  )
}
