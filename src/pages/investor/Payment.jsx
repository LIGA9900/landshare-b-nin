// ═══════════════════════════════════════════════════════════════════
// Payment.jsx — Page Paiement · LandShare Bénin
// Responsive mobile + desktop · Police réduite · Niveau startup
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ─── Polices ───────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])
}

// ─── Données commande (viendront du contexte/store plus tard) ──────
const ORDER = {
  terrainName: 'Calavi Nord — Zone Résidentielle',
  location:    'Abomey-Calavi, Atlantique, Bénin',
  sqm:          5,
  pricePerSqm:  15000,
  subtotal:     75000,
  commission:   2250,
  total:        77250,
  expiresIn:    600, // 10 min en secondes
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Stepper
// ═══════════════════════════════════════════════════════════════════
function Stepper({ current }) {
  const steps = [
    { id: 0, label: 'Sélection' },
    { id: 1, label: 'Paiement'  },
    { id: 2, label: 'Confirmation' },
  ]

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      marginBottom: 28, padding: '0 4px',
    }}>
      {steps.map((step, i) => (
        <div key={step.id} style={{
          display: 'flex', alignItems: 'center',
          flex: i < steps.length - 1 ? 1 : 0,
        }}>
          {/* Cercle */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700,
              flexShrink: 0,
              background: i < current
                ? '#1E3A2F'
                : i === current
                  ? '#1E3A2F'
                  : 'transparent',
              border: `2px solid ${i <= current ? '#1E3A2F' : 'rgba(30,58,47,0.2)'}`,
              color: i <= current ? '#F5F0E8' : '#8C8278',
              transition: 'all 0.3s',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: '0.65rem', fontWeight: 500,
              color: i <= current ? '#1E3A2F' : '#8C8278',
              whiteSpace: 'nowrap',
            }}>
              {step.label}
            </span>
          </div>

          {/* Ligne */}
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 1.5,
              margin: '0 8px', marginBottom: 18,
              background: i < current
                ? '#1E3A2F'
                : 'rgba(30,58,47,0.15)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Timer countdown
// ═══════════════════════════════════════════════════════════════════
function Timer({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left <= 0) { onExpire?.(); return }
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  const m       = Math.floor(left / 60)
  const s       = left % 60
  const urgent  = left < 120
  const display = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '9px 13px', borderRadius: 10,
      background: urgent
        ? 'rgba(192,57,43,0.08)'
        : 'rgba(184,151,42,0.08)',
      border: `1px solid ${urgent
        ? 'rgba(192,57,43,0.22)'
        : 'rgba(184,151,42,0.22)'}`,
      marginBottom: 16,
      animation: urgent ? 'urgentPulse 1s ease infinite' : 'none',
    }}>
      <span style={{ fontSize: '0.9rem' }}>
        {urgent ? '🔴' : '⏱️'}
      </span>
      <div>
        <p style={{
          fontSize: '0.68rem', fontWeight: 600, margin: '0 0 1px',
          color: urgent ? '#C0392B' : '#8B6E1A',
        }}>
          {urgent ? 'Plus que quelques secondes !' : 'Réservation active'}
        </p>
        <p style={{ fontSize: '0.68rem', color: '#6B6459', margin: 0 }}>
          Expire dans{' '}
          <strong style={{
            fontFamily: 'monospace', fontSize: '0.85rem',
            color: urgent ? '#C0392B' : '#1E3A2F',
          }}>
            {display}
          </strong>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Récapitulatif commande
// ═══════════════════════════════════════════════════════════════════
function OrderSummary({ order, showTimer = true, onExpire }) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 14,
      boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      border: '1px solid rgba(30,58,47,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
        padding: '14px 16px',
      }}>
        <p style={{
          fontSize: '0.65rem', color: 'rgba(245,240,232,0.6)',
          textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px',
        }}>
          Récapitulatif
        </p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700,
          color: '#F5F0E8', margin: 0,
        }}>
          {order.terrainName}
        </h3>
        <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.5)', margin: '2px 0 0' }}>
          📍 {order.location}
        </p>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Détails */}
        <div style={{ marginBottom: 12 }}>
          {[
            { label: 'Parts achetées',  value: `${order.sqm} m²`                                        },
            { label: 'Prix unitaire',   value: `${order.pricePerSqm.toLocaleString('fr-FR')} FCFA`       },
            { label: 'Sous-total',      value: `${order.subtotal.toLocaleString('fr-FR')} FCFA`          },
            { label: 'Commission (3%)', value: `${order.commission.toLocaleString('fr-FR')} FCFA`        },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '0.75rem', padding: '4px 0', color: '#6B6459',
              borderBottom: '1px solid rgba(30,58,47,0.04)',
            }}>
              <span>{label}</span>
              <span style={{ fontFamily: 'monospace', color: '#4A3F35' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '10px 0 0',
          borderTop: '1.5px solid rgba(30,58,47,0.1)',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1A1A' }}>
            TOTAL TTC
          </span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem', fontWeight: 700, color: '#1E3A2F',
          }}>
            {order.total.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        {/* Timer */}
        {showTimer && (
          <div style={{ marginTop: 12 }}>
            <Timer seconds={order.expiresIn} onExpire={onExpire} />
          </div>
        )}

        {/* Badges sécurité */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 12,
          marginTop: 10, paddingTop: 10,
          borderTop: '1px solid rgba(30,58,47,0.06)',
        }}>
          {[
            { icon: '🔒', label: 'SSL' },
            { icon: '🏅', label: 'Certifié' },
            { icon: '📄', label: 'Attestation' },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: '0.65rem', color: '#8C8278',
            }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Formulaire MTN MoMo
// ═══════════════════════════════════════════════════════════════════
function MoMoForm({ provider = 'MTN', color = '#FFCC00', textColor = '#1A1A1A' }) {
  const [phone, setPhone] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{
      background: '#FAFAF7', borderRadius: 12,
      padding: '16px', marginTop: 14,
      border: '1px solid rgba(30,58,47,0.08)',
      animation: 'slideDown 0.25s ease',
    }}>
      {/* Champ numéro */}
      <div style={{ marginBottom: 14 }}>
        <label style={{
          display: 'block', fontSize: '0.72rem', fontWeight: 600,
          color: '#4A3F35', marginBottom: 6,
        }}>
          Numéro {provider} Mobile Money *
        </label>
        <div style={{ position: 'relative' }}>
          {/* Flag + indicatif */}
          <div style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: '0.75rem', color: '#4A3F35', fontWeight: 600,
            pointerEvents: 'none',
          }}>
            🇧🇯 +229
          </div>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="96 XX XX XX"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              padding: '11px 12px 11px 80px',
              borderRadius: 10,
              border: `1.5px solid ${focused
                ? '#1E3A2F'
                : 'rgba(30,58,47,0.15)'}`,
              background: focused
                ? 'rgba(255,255,255,0.95)'
                : 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem', color: '#1A1A1A', outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
              boxShadow: focused
                ? '0 0 0 3px rgba(30,58,47,0.07)'
                : 'none',
            }}
          />
        </div>
        <p style={{
          fontSize: '0.65rem', color: '#8C8278',
          margin: '4px 0 0',
        }}>
          Format Bénin : +229 96/97 XX XX XX
        </p>
      </div>

      {/* Instructions étapes */}
      <div>
        <p style={{
          fontSize: '0.72rem', fontWeight: 700, color: '#4A3F35',
          margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{
            width: 16, height: 16, borderRadius: '50%',
            background: color, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '0.5rem', fontWeight: 800, color: textColor,
            flexShrink: 0,
          }}>
            ?
          </span>
          Comment ça se passe :
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            `Cliquez "Payer" — on envoie une demande à votre numéro ${provider}`,
            'Votre téléphone affiche la notification de paiement',
            'Saisissez votre PIN Mobile Money pour confirmer',
            'Vous recevez votre attestation PDF immédiatement',
          ].map((text, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: color, color: textColor,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 800,
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </div>
              <p style={{
                fontSize: '0.72rem', color: '#6B6459',
                margin: 0, lineHeight: 1.5,
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Formulaire Stripe (carte bancaire)
// ═══════════════════════════════════════════════════════════════════
function StripeForm() {
  const [focused, setFocused] = useState(null)

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: 9,
    border: `1.5px solid ${focused === field
      ? '#1E3A2F'
      : 'rgba(30,58,47,0.15)'}`,
    background: 'rgba(255,255,255,0.8)',
    fontSize: '0.82rem', color: '#1A1A1A', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
    boxShadow: focused === field
      ? '0 0 0 3px rgba(30,58,47,0.07)'
      : 'none',
  })

  return (
    <div style={{
      background: '#FAFAF7', borderRadius: 12,
      padding: '16px', marginTop: 14,
      border: '1px solid rgba(30,58,47,0.08)',
      animation: 'slideDown 0.25s ease',
    }}>
      {/* Logos cartes */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 14,
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.68rem', color: '#8C8278' }}>
          Cartes acceptées :
        </span>
        {['💳 Visa', '💳 Mastercard'].map(c => (
          <span key={c} style={{
            padding: '3px 8px', borderRadius: 5,
            background: '#fff', border: '1px solid rgba(30,58,47,0.12)',
            fontSize: '0.65rem', color: '#4A3F35', fontWeight: 600,
          }}>
            {c}
          </span>
        ))}
      </div>

      {/* Numéro carte */}
      <div style={{ marginBottom: 12 }}>
        <label style={{
          display: 'block', fontSize: '0.72rem', fontWeight: 600,
          color: '#4A3F35', marginBottom: 5,
        }}>
          Numéro de carte
        </label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          onFocus={() => setFocused('card')}
          onBlur={() => setFocused(null)}
          style={inputStyle('card')}
        />
      </div>

      {/* Expiry + CVV */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        marginBottom: 12,
      }}>
        <div>
          <label style={{
            display: 'block', fontSize: '0.72rem', fontWeight: 600,
            color: '#4A3F35', marginBottom: 5,
          }}>
            Expiration
          </label>
          <input
            type="text" placeholder="MM / AA" maxLength={7}
            onFocus={() => setFocused('expiry')}
            onBlur={() => setFocused(null)}
            style={inputStyle('expiry')}
          />
        </div>
        <div>
          <label style={{
            display: 'block', fontSize: '0.72rem', fontWeight: 600,
            color: '#4A3F35', marginBottom: 5,
          }}>
            CVV
          </label>
          <input
            type="text" placeholder="123" maxLength={4}
            onFocus={() => setFocused('cvv')}
            onBlur={() => setFocused(null)}
            style={inputStyle('cvv')}
          />
        </div>
      </div>

      {/* Nom */}
      <div>
        <label style={{
          display: 'block', fontSize: '0.72rem', fontWeight: 600,
          color: '#4A3F35', marginBottom: 5,
        }}>
          Nom sur la carte
        </label>
        <input
          type="text" placeholder="FOUAD LIGALI"
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
          style={inputStyle('name')}
        />
      </div>

      {/* Note sécurité */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginTop: 12, padding: '8px 10px', borderRadius: 8,
        background: 'rgba(30,58,47,0.04)',
        border: '1px solid rgba(30,58,47,0.08)',
      }}>
        <span style={{ fontSize: '0.75rem' }}>🔒</span>
        <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>
          Paiement sécurisé via Stripe. Vos données ne sont jamais stockées.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : Page Paiement
// ═══════════════════════════════════════════════════════════════════
export default function Payment() {
  useFonts()

  const navigate = useNavigate()

  const [method,    setMethod]    = useState('mtn')
  const [loading,   setLoading]   = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [expired,   setExpired]   = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Méthodes de paiement disponibles
  const methods = [
    {
      id:        'mtn',
      label:     'MTN Mobile Money',
      sub:       'Paiement instantané · Réseau MTN Bénin',
      icon:      '📱',
      badge:     'MTN',
      badgeBg:   '#FFCC00',
      badgeText: '#1A1A1A',
      popular:   true,
    },
    {
      id:        'moov',
      label:     'Moov Money',
      sub:       'Paiement Mobile · Moov Afrique',
      icon:      '📲',
      badge:     'MOOV',
      badgeBg:   '#0056A2',
      badgeText: '#FFFFFF',
      popular:   false,
    },
    {
      id:        'stripe',
      label:     'Carte bancaire',
      sub:       'Visa · Mastercard · Paiement sécurisé',
      icon:      '💳',
      badge:     'STRIPE',
      badgeBg:   '#635BFF',
      badgeText: '#FFFFFF',
      popular:   false,
    },
  ]

  const handlePay = async () => {
    setLoading(true)
    // Simulation appel API paiement (2 sec)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    navigate('/paiement/succes')
  }

  const selectedMethod = methods.find(m => m.id === method)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '13px',
    }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(245,240,232,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(184,151,42,0.15)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5vw', height: 60,
        boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 7,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 30, height: 30, background: '#1E3A2F',
            borderRadius: 7, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 11, height: 11, background: '#B8972A',
              clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.95rem', fontWeight: 700, color: '#1E3A2F',
          }}>
            Land<span style={{ color: '#B8972A' }}>Share</span>
          </span>
        </Link>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: '0.72rem', color: '#8C8278',
        }}>
          <Link to="/terrains/1" style={{ color: '#8C8278', textDecoration: 'none' }}>
            Terrain
          </Link>
          <span>/</span>
          <span style={{ color: '#1E3A2F', fontWeight: 600 }}>Paiement</span>
        </div>

        {/* Bouton retour */}
        <Link to="/terrains/1" style={{
          padding: '6px 14px', borderRadius: 7,
          border: '1.5px solid rgba(30,58,47,0.2)',
          color: '#1E3A2F', textDecoration: 'none',
          fontSize: '0.72rem', fontWeight: 600,
          transition: 'all 0.2s',
        }}>
          ← Retour
        </Link>
      </nav>

      {/* ── Contenu principal ── */}
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(14px, 5vw, 24px)',
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s ease',
      }}>

        {/* Titre + Stepper */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: '0.65rem', fontWeight: 700, color: '#B8972A',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            margin: '0 0 4px',
          }}>
            Étape 2 sur 3
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
            fontWeight: 700, color: '#1A1A1A',
            margin: '0 0 20px', letterSpacing: '-0.01em',
          }}>
            Finaliser votre paiement
          </h1>
          <Stepper current={1} />
        </div>

        {/* ── Layout 2 colonnes (1 colonne sur mobile) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 280px',
          gap: 20, alignItems: 'start',
        }}>

          {/* ══ Colonne gauche : formulaire paiement ══ */}
          <div>

            {/* Alerte expiration */}
            {expired && (
              <div style={{
                background: 'rgba(192,57,43,0.08)',
                border: '1px solid rgba(192,57,43,0.25)',
                borderRadius: 10, padding: '12px 14px',
                marginBottom: 16, display: 'flex', gap: 8,
              }}>
                <span>⚠️</span>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700,
                               color: '#C0392B', margin: '0 0 3px' }}>
                    Réservation expirée
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#6B6459', margin: 0 }}>
                    Votre réservation de 10 minutes est expirée.{' '}
                    <Link to="/terrains/1" style={{ color: '#1E3A2F', fontWeight: 600 }}>
                      Recommencer →
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Card principale : choix paiement */}
            <div style={{
              background: '#FFFFFF', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
              border: '1px solid rgba(30,58,47,0.06)',
              marginBottom: 16,
            }}>
              {/* Header */}
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(30,58,47,0.06)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(30,58,47,0.07)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.85rem',
                }}>
                  💳
                </div>
                <div>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.95rem', fontWeight: 700,
                    color: '#1A1A1A', margin: 0,
                  }}>
                    Mode de paiement
                  </h2>
                  <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>
                    Choisissez votre méthode préférée
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                {/* Liste méthodes */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 8,
                  marginBottom: 4,
                }}>
                  {methods.map(m => (
                    <div
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10,
                        border: `1.5px solid ${method === m.id
                          ? '#1E3A2F'
                          : 'rgba(30,58,47,0.1)'}`,
                        background: method === m.id
                          ? 'rgba(30,58,47,0.03)'
                          : 'transparent',
                        cursor: 'pointer', transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      {/* Badge populaire */}
                      {m.popular && (
                        <span style={{
                          position: 'absolute', top: -8, right: 10,
                          background: '#B8972A', color: '#fff',
                          fontSize: '0.55rem', fontWeight: 700,
                          padding: '2px 7px', borderRadius: 10,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>
                          Recommandé
                        </span>
                      )}

                      {/* Radio */}
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid ${method === m.id
                          ? '#1E3A2F'
                          : 'rgba(30,58,47,0.25)'}`,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {method === m.id && (
                          <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: '#1E3A2F',
                          }} />
                        )}
                      </div>

                      {/* Badge provider */}
                      <div style={{
                        width: 42, height: 28, borderRadius: 6,
                        background: m.badgeBg,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.52rem', fontWeight: 800,
                        color: m.badgeText, flexShrink: 0,
                        letterSpacing: '0.03em',
                      }}>
                        {m.badge}
                      </div>

                      {/* Infos */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '0.78rem', fontWeight: 600,
                          color: '#1A1A1A', margin: '0 0 1px',
                        }}>
                          {m.label}
                        </p>
                        <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>
                          {m.sub}
                        </p>
                      </div>

                      {/* Icône */}
                      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
                        {m.icon}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Formulaire selon méthode */}
                {method === 'mtn' && (
                  <MoMoForm
                    provider="MTN"
                    color="#FFCC00"
                    textColor="#1A1A1A"
                  />
                )}
                {method === 'moov' && (
                  <MoMoForm
                    provider="Moov"
                    color="#0056A2"
                    textColor="#FFFFFF"
                  />
                )}
                {method === 'stripe' && <StripeForm />}
              </div>
            </div>

            {/* Bouton payer */}
            <button
              onClick={handlePay}
              disabled={loading || expired}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 12, border: 'none',
                background: loading || expired
                  ? 'rgba(30,58,47,0.4)'
                  : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
                color: '#F5F0E8',
                fontSize: '0.88rem', fontWeight: 700,
                cursor: loading || expired ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading || expired
                  ? 'none'
                  : '0 4px 16px rgba(30,58,47,0.28)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => {
                if (!loading && !expired) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,47,0.38)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,47,0.28)'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(245,240,232,0.3)',
                    borderTopColor: '#F5F0E8',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Traitement en cours...
                </>
              ) : expired ? (
                'Réservation expirée'
              ) : (
                `🔒 Payer ${ORDER.total.toLocaleString('fr-FR')} FCFA`
              )}
            </button>

            {/* Note annulation */}
            <p style={{
              fontSize: '0.65rem', color: '#8C8278',
              textAlign: 'center', marginTop: 10, lineHeight: 1.5,
            }}>
              En cliquant sur "Payer", vous acceptez nos{' '}
              <a href="#" style={{ color: '#1E3A2F', textDecoration: 'none', fontWeight: 600 }}>
                CGU
              </a>
              {' '}et confirmez votre investissement.
            </p>

            {/* Logos paiement */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10, marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid rgba(30,58,47,0.08)',
            }}>
              <span style={{ fontSize: '0.62rem', color: '#8C8278' }}>
                Paiements sécurisés :
              </span>
              {[
                { bg: '#FFCC00', text: '#1A1A1A', label: 'MTN'   },
                { bg: '#0056A2', text: '#fff',    label: 'MOOV'  },
                { bg: '#635BFF', text: '#fff',    label: 'STRIPE'},
                { bg: '#E2E8F0', text: '#4A3F35', label: 'VISA'  },
              ].map(({ bg, text, label }) => (
                <div key={label} style={{
                  padding: '3px 8px', borderRadius: 5, background: bg,
                  color: text, fontSize: '0.55rem', fontWeight: 800,
                  letterSpacing: '0.03em',
                }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ══ Colonne droite : récap (sticky desktop) ══ */}
          <div style={{ position: 'sticky', top: 76 }}>
            <OrderSummary
              order={ORDER}
              showTimer={true}
              onExpire={() => setExpired(true)}
            />

            {/* Note notaire */}
            <div style={{
              marginTop: 12,
              background: 'rgba(30,58,47,0.04)',
              border: '1px solid rgba(30,58,47,0.08)',
              borderRadius: 10, padding: '10px 12px',
              display: 'flex', gap: 7,
            }}>
              <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>🏅</span>
              <p style={{ fontSize: '0.65rem', color: '#6B6459', margin: 0, lineHeight: 1.5 }}>
                Terrain certifié par <strong style={{ color: '#1E3A2F' }}>
                  Maître Kofi Akobi
                </strong>, Notaire à Cotonou.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CSS global ── */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes urgentPulse {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.7; }
        }

        /* ── Responsive mobile ── */
        @media (max-width: 640px) {
          div[style*="grid-template-columns: minmax(0,1fr) 280px"] {
            grid-template-columns: 1fr !important;
          }
          /* Sur mobile : récap passe en haut */
          div[style*="position: sticky; top: 76px"] {
            position: static !important;
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}