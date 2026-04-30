// ═══════════════════════════════════════════════════════════════════
// Login.jsx — Page de Connexion · LandShare Bénin
// Design : Split-screen immersif · Glassmorphism · Palette Landing
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ─── Icônes SVG inline (pas besoin de librairie) ───────────────────
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ─── Composant : champ de saisie premium ──────────────────────────
function InputField({ label, type = 'text', placeholder, value, onChange,
                      icon, rightElement, error, hint }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Label */}
      <label style={{
        display: 'block', fontSize: '0.78rem', fontWeight: 600,
        color: focused ? '#1E3A2F' : '#4A3F35',
        marginBottom: 6, transition: 'color 0.2s',
        letterSpacing: '0.01em',
      }}>
        {label}
      </label>

      {/* Wrapper input */}
      <div style={{ position: 'relative' }}>
        {/* Icône gauche */}
        {icon && (
          <div style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? '#1E3A2F' : '#8C8278',
            transition: 'color 0.2s', pointerEvents: 'none',
          }}>
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: icon ? '12px 44px 12px 44px' : '12px 44px 12px 16px',
            borderRadius: 12,
            border: `1.5px solid ${
              error ? '#C0392B'
              : focused ? '#1E3A2F'
              : 'rgba(30,58,47,0.15)'
            }`,
            background: focused
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem', color: '#1A1A1A',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: focused
              ? '0 0 0 4px rgba(30,58,47,0.08)'
              : 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* Élément droit (ex: bouton œil) */}
        {rightElement && (
          <div style={{
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)',
            color: '#8C8278', cursor: 'pointer',
          }}>
            {rightElement}
          </div>
        )}
      </div>

      {/* Message d'erreur ou hint */}
      {error && (
        <p style={{ fontSize: '0.72rem', color: '#C0392B', marginTop: 4, margin: '4px 0 0' }}>
          ⚠ {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ fontSize: '0.72rem', color: '#8C8278', marginTop: 4, margin: '4px 0 0' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

// ─── Composant principal : Page Connexion ─────────────────────────
export default function Login() {
  // États du formulaire
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [mounted, setMounted]   = useState(false)

  const navigate = useNavigate()

  // Animation d'entrée
  useEffect(() => {
    // Charge les polices
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)

    setTimeout(() => setMounted(true), 50)
  }, [])

  // Validation simple
  const validate = () => {
    const errs = {}
    if (!email)                          errs.email    = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email   = 'Email invalide'
    if (!password)                        errs.password = 'Mot de passe requis'
    else if (password.length < 6)         errs.password = 'Minimum 6 caractères'
    return errs
  }

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    // Simulation appel API (on connectera le vrai backend plus tard)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ════════════════════════════════════════════
          COLONNE GAUCHE — Visuel immersif
      ════════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #0D2318 0%, #1E3A2F 40%, #2D5241 70%, #B8972A 130%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
        overflow: 'hidden',
      }}>

        {/* Texture décorative */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(184,151,42,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(30,58,47,0.4) 0%, transparent 60%)
          `,
        }} />

        {/* Cercles géométriques décoratifs */}
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          border: '1px solid rgba(184,151,42,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, right: -40,
          width: 280, height: 280, borderRadius: '50%',
          border: '1px solid rgba(184,151,42,0.18)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: -60,
          width: 200, height: 200, borderRadius: '50%',
          border: '1px solid rgba(245,240,232,0.06)',
          pointerEvents: 'none',
        }} />

        {/* ── Logo ── */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', position: 'relative', zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.6s ease',
        }}>
          <div style={{
            width: 38, height: 38, background: 'rgba(245,240,232,0.12)',
            borderRadius: 10, border: '1px solid rgba(245,240,232,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 16, height: 16, background: '#B8972A',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.15rem', fontWeight: 700, color: '#F5F0E8',
          }}>
            Land<span style={{ color: '#D4AD3A' }}>Share</span>
          </span>
        </Link>

        {/* ── Contenu central ── */}
        <div style={{
          position: 'relative', zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.15s',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(184,151,42,0.15)',
            border: '1px solid rgba(184,151,42,0.3)',
            borderRadius: 50, padding: '6px 14px', marginBottom: 24,
            fontSize: '0.7rem', fontWeight: 600, color: '#D4AD3A',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: '#D4AD3A',
              animation: 'pulse 2s ease infinite',
            }} />
            Plateforme certifiée OHADA · Bénin
          </div>

          {/* Titre grand format */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.4rem, 3.5vw, 3.8rem)',
            fontWeight: 700, color: '#F5F0E8',
            lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 20,
          }}>
            Votre patrimoine<br />
            <span style={{ color: '#D4AD3A' }}>vous attend</span>
          </h1>

          <p style={{
            fontSize: '1rem', color: 'rgba(245,240,232,0.65)',
            lineHeight: 1.7, maxWidth: 380, marginBottom: 40,
            fontWeight: 300,
          }}>
            Connectez-vous pour accéder à votre portefeuille foncier,
            suivre vos investissements et découvrir de nouveaux terrains au Bénin.
          </p>

          {/* Stats visuelles */}
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { value: '1 200+', label: 'Investisseurs' },
              { value: '48',     label: 'Terrains actifs' },
              { value: '14%',    label: 'Rendement moy.' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem', fontWeight: 700,
                  color: '#D4AD3A', margin: '0 0 2px',
                }}>
                  {value}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Témoignage bas ── */}
        <div style={{
          position: 'relative', zIndex: 2,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(245,240,232,0.1)',
          borderRadius: 16, padding: '20px 22px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.7s ease 0.3s',
        }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#D4AD3A">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            ))}
          </div>
          <p style={{
            fontSize: '0.85rem', color: 'rgba(245,240,232,0.8)',
            fontStyle: 'italic', lineHeight: 1.6, marginBottom: 14,
          }}>
            "En moins de 10 minutes, j'ai acheté mes premiers m² depuis Paris.
            L'attestation m'a été envoyée instantanément. Impressionnant."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#2D5241', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
              color: '#F5F0E8', border: '2px solid rgba(245,240,232,0.15)',
            }}>
              AK
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F5F0E8', margin: 0 }}>
                Adeola Kossou
              </p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.45)', margin: 0 }}>
                Investisseur · Paris, France
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          COLONNE DROITE — Formulaire
      ════════════════════════════════════════════ */}
      <div style={{
        background: '#F5F0E8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Décoration fond */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,151,42,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,58,47,0.05), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Carte formulaire ── */}
        <div style={{
          width: '100%', maxWidth: 440, position: 'relative', zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.7s ease 0.2s',
        }}>

          {/* En-tête */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: 700, color: '#1A1A1A',
              letterSpacing: '-0.02em', margin: '0 0 8px',
            }}>
              Bon retour 👋
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6B6459', margin: 0 }}>
              Pas encore de compte ?{' '}
              <Link to="/inscription" style={{
                color: '#1E3A2F', fontWeight: 600, textDecoration: 'none',
                borderBottom: '1px solid rgba(30,58,47,0.3)',
                paddingBottom: 1, transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#1E3A2F'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(30,58,47,0.3)'}>
                Créer un compte →
              </Link>
            </p>
          </div>

          {/* ── Formulaire ── */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <InputField
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              }
            />

            {/* Mot de passe */}
            <InputField
              label="Mot de passe"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              }
              rightElement={
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer',
                                  padding: 0, color: '#8C8278', display: 'flex' }}>
                  <EyeIcon open={showPwd} />
                </button>
              }
            />

            {/* Options : Se souvenir + Mot de passe oublié */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 24, marginTop: -6,
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', fontSize: '0.82rem', color: '#6B6459',
              }}>
                {/* Checkbox custom */}
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: `1.5px solid ${remember ? '#1E3A2F' : 'rgba(30,58,47,0.25)'}`,
                    background: remember ? '#1E3A2F' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0,
                  }}>
                  {remember && <CheckIcon />}
                </div>
                Se souvenir de moi
              </label>
              <Link to="/reset-password" style={{
                fontSize: '0.82rem', color: '#1E3A2F', textDecoration: 'none',
                fontWeight: 500, opacity: 0.8, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}>
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 12, border: 'none',
                background: loading
                  ? 'rgba(30,58,47,0.5)'
                  : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
                color: '#F5F0E8', fontSize: '0.95rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(30,58,47,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,47,0.4)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,47,0.3)'
              }}
            >
              {loading ? (
                <>
                  {/* Spinner */}
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid rgba(245,240,232,0.3)',
                    borderTopColor: '#F5F0E8',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter →'
              )}
            </button>

            {/* Séparateur */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              margin: '24px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(30,58,47,0.12)' }} />
              <span style={{ fontSize: '0.78rem', color: '#8C8278' }}>ou continuer avec</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(30,58,47,0.12)' }} />
            </div>

            {/* Bouton Google */}
            <button type="button" style={{
              width: '100%', padding: '12px',
              borderRadius: 12,
              border: '1.5px solid rgba(30,58,47,0.15)',
              background: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem', fontWeight: 500, color: '#1A1A1A',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.boxShadow = 'none' }}>
              {/* Logo Google SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
          </form>

          {/* Footer légal */}
          <p style={{
            fontSize: '0.72rem', color: '#8C8278', textAlign: 'center',
            marginTop: 28, lineHeight: 1.6,
          }}>
            En vous connectant, vous acceptez nos{' '}
            <a href="#" style={{ color: '#1E3A2F', textDecoration: 'none', fontWeight: 500 }}>
              CGU
            </a>{' '}
            et notre{' '}
            <a href="#" style={{ color: '#1E3A2F', textDecoration: 'none', fontWeight: 500 }}>
              Politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>

      {/* ── Styles globaux (animations) ── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}