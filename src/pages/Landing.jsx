// ═══════════════════════════════════════════════════════════════════
// Landing.jsx — LandShare Bénin · Version Premium Startup
// Design inspiré : Stripe · Linear · Notion · Robinhood
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── Palette de couleurs (inspirée de la référence, upgradée) ───────
// Crème chaud + Vert forêt + Or + Accents modernes

// ═══════════════════════════════════════════════════════════════════
// HOOK : Compteur animé (chiffres qui montent)
// ═══════════════════════════════════════════════════════════════════
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Easing easeOutCubic — ralentit à la fin
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])

  return count
}

// ═══════════════════════════════════════════════════════════════════
// HOOK : Détecte si un élément est visible à l'écran
// ═══════════════════════════════════════════════════════════════════
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Navbar Premium
// ═══════════════════════════════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5vw',
        background: scrolled
          ? 'rgba(245,240,232,0.94)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(184,151,42,0.15)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 32px rgba(30,58,47,0.08)' : 'none',
        transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38,
            background: '#1E3A2F',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(30,58,47,0.3)',
          }}>
            {/* Losange doré */}
            <div style={{
              width: 16, height: 16,
              background: '#B8972A',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.2rem', fontWeight: 700,
            color: scrolled ? '#1A1A1A' : '#1E3A2F',
            letterSpacing: '-0.02em',
          }}>
            Land<span style={{ color: '#B8972A' }}>Share</span>
          </span>
        </Link>

        {/* ── Liens desktop ── */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}
             className="hidden-mobile">
          {[
            { label: 'Terrains', href: '#terrains' },
            { label: 'Comment ça marche', href: '#comment' },
            { label: 'Témoignages', href: '#temoignages' },
            { label: 'FAQ', href: '#faq' },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
              color: scrolled ? '#6B6459' : '#2D5241',
              transition: 'color 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => e.target.style.color = '#1E3A2F'}
            onMouseLeave={e => e.target.style.color = scrolled ? '#6B6459' : '#2D5241'}>
              {label}
            </a>
          ))}
        </div>

        {/* ── Boutons ── */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
             className="hidden-mobile">
          <Link to="/connexion" style={{
            padding: '9px 20px', borderRadius: 50,
            border: '1.5px solid rgba(30,58,47,0.25)',
            color: '#1E3A2F', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            transition: 'all 0.2s',
            background: 'transparent',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,58,47,0.06)'; e.currentTarget.style.borderColor = '#1E3A2F' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(30,58,47,0.25)' }}>
            Connexion
          </Link>
          <Link to="/inscription" style={{
            padding: '10px 22px', borderRadius: 50,
            background: '#1E3A2F', color: '#F5F0E8',
            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
            boxShadow: '0 4px 14px rgba(30,58,47,0.3)',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2D5241'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,47,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,58,47,0.3)' }}>
            Investir maintenant
            <span style={{ fontSize: '1rem' }}>→</span>
          </Link>
        </div>

        {/* ── Menu burger mobile ── */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none' }}
          className="show-mobile"
          onClick={() => setMenuOpen(!menuOpen)}>
          <div style={{ width: 22, height: 2, background: '#1E3A2F', marginBottom: 5, transition: 'all 0.2s',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: '#1E3A2F', marginBottom: 5,
            opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <div style={{ width: 22, height: 2, background: '#1E3A2F', transition: 'all 0.2s',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* ── Menu mobile overlay ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(245,240,232,0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem',
        }}>
          {['Terrains', 'Comment ça marche', 'Témoignages', 'FAQ'].map(label => (
            <a key={label} href="#" onClick={() => setMenuOpen(false)} style={{
              fontSize: '1.5rem', fontWeight: 600, color: '#1E3A2F',
              textDecoration: 'none', fontFamily: "'Playfair Display', serif",
            }}>{label}</a>
          ))}
          <div style={{ height: 1, width: 60, background: 'rgba(184,151,42,0.3)', margin: '0.5rem 0' }} />
          <Link to="/connexion" onClick={() => setMenuOpen(false)} style={{
            padding: '12px 32px', borderRadius: 50, border: '1.5px solid #1E3A2F',
            color: '#1E3A2F', textDecoration: 'none', fontWeight: 500,
          }}>Connexion</Link>
          <Link to="/inscription" onClick={() => setMenuOpen(false)} style={{
            padding: '13px 36px', borderRadius: 50, background: '#1E3A2F',
            color: '#F5F0E8', textDecoration: 'none', fontWeight: 600,
          }}>Investir maintenant →</Link>
        </div>
      )}

      {/* CSS responsive */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Hero Premium avec particules CSS
// ═══════════════════════════════════════════════════════════════════
function Hero() {
  // Ticker : messages défilants des derniers investissements
  const tickers = [
    '🟢 Adeola K. · Paris · vient d\'acheter 5 m² — Calavi Nord',
    '🟢 Malick F. · Cotonou · vient d\'acheter 10 m² — Fidjrossè',
    '🟢 Sylvie B. · Montréal · vient d\'acheter 3 m² — Parakou',
    '🟢 Jean P. · Lyon · vient d\'acheter 8 m² — Calavi Nord',
    '🟢 Fatima D. · Amsterdam · vient d\'acheter 2 m² — Fidjrossè',
  ]
  const [tickerIdx, setTickerIdx] = useState(0)
  const [tickerFade, setTickerFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerFade(false)
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % tickers.length)
        setTickerFade(true)
      }, 300)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE6D6 40%, #E8EFE9 100%)',
      position: 'relative', overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0,
      paddingTop: 72,
    }}>

      {/* ── Texture de fond (pattern SVG subtil) ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 80% 40%, rgba(30,58,47,0.06) 0%, transparent 70%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B8972A' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")
        `,
      }} />

      {/* ── Cercle décoratif ── */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,58,47,0.06), transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ═══ COLONNE GAUCHE : Texte ═══ */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(40px, 8vh, 80px) clamp(24px, 5vw, 60px) clamp(40px, 8vh, 80px) clamp(24px, 8vw, 100px)',
        position: 'relative', zIndex: 2,
      }}>

        {/* Badge animé */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(184,151,42,0.1)',
          border: '1px solid rgba(184,151,42,0.28)',
          borderRadius: 50, padding: '7px 16px',
          fontSize: '0.72rem', fontWeight: 500, color: '#8B6E1A',
          letterSpacing: '0.07em', textTransform: 'uppercase',
          width: 'fit-content', marginBottom: '2rem',
          animation: 'fadeUp 0.7s ease both',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#B8972A',
            animation: 'pulse 2s ease infinite',
          }} />
          Plateforme certifiée OHADA · Bénin
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
          fontWeight: 700, lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#1A1A1A',
          marginBottom: '1.5rem',
          animation: 'fadeUp 0.7s ease 0.1s both',
        }}>
          Devenez propriétaire<br />
          d'un terrain{' '}
          <span style={{ color: '#1E3A2F', position: 'relative', display: 'inline-block' }}>
            béninois
            <svg style={{
              position: 'absolute', bottom: -4, left: 0, right: 0,
              width: '100%', height: 6, overflow: 'visible',
            }} viewBox="0 0 100 6" preserveAspectRatio="none">
              <path d="M0,5 Q25,0 50,4 Q75,8 100,3" stroke="#B8972A" strokeWidth="2.5"
                    fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: 120, strokeDashoffset: 120,
                             animation: 'drawLine 0.8s ease 0.9s forwards' }} />
            </svg>
          </span>
          <br />dès 5 000 FCFA
        </h1>

        {/* Sous-titre */}
        <p style={{
          fontSize: '1.05rem', lineHeight: 1.75,
          color: '#6B6459', fontWeight: 300,
          maxWidth: 500, marginBottom: '2.5rem',
          animation: 'fadeUp 0.7s ease 0.2s both',
        }}>
          LandShare rend l'investissement foncier accessible à{' '}
          <strong style={{ color: '#1E3A2F', fontWeight: 600 }}>tous les Béninois</strong>,
          en Afrique comme dans la diaspora. Achetez des m² certifiés, payez
          par Mobile Money, recevez votre attestation immédiatement.
        </p>

        {/* Boutons */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          flexWrap: 'wrap', marginBottom: '2.5rem',
          animation: 'fadeUp 0.7s ease 0.3s both',
        }}>
          <Link to="/inscription" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#1E3A2F', color: '#F5F0E8',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
            padding: '14px 30px', borderRadius: 50,
            boxShadow: '0 6px 20px rgba(30,58,47,0.28)',
            transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,58,47,0.35)'; e.currentTarget.style.background = '#2D5241' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,58,47,0.28)'; e.currentTarget.style.background = '#1E3A2F' }}>
            Commencer gratuitement
            <span style={{ transition: 'transform 0.2s' }}>→</span>
          </Link>
          <a href="#terrains" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#1A1A1A', textDecoration: 'none',
            fontSize: '0.95rem', fontWeight: 500,
            padding: '13px 24px', borderRadius: 50,
            border: '1.5px solid rgba(26,26,26,0.18)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E3A2F'; e.currentTarget.style.background = 'rgba(30,58,47,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(26,26,26,0.18)'; e.currentTarget.style.background = 'transparent' }}>
            Voir les terrains
            <span>↓</span>
          </a>
        </div>

        {/* Social proof — avatars + note */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'fadeUp 0.7s ease 0.4s both',
        }}>
          {/* Avatars empilés */}
          <div style={{ display: 'flex' }}>
            {['AK', 'MF', 'SB', 'JP', '+'].map((initials, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '2.5px solid #F5F0E8',
                marginLeft: i === 0 ? 0 : -10,
                background: ['#1E3A2F','#2D5241','#3D6B53','#B8972A','#6B6459'][i],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: '#F5F0E8',
                zIndex: 5 - i,
              }}>
                {initials}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                     fill="#B8972A" stroke="none">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              ))}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6B6459', margin: 0 }}>
              <strong style={{ color: '#1A1A1A' }}>1 200+</strong> investisseurs font confiance à LandShare
            </p>
          </div>
        </div>
      </div>

      {/* ═══ COLONNE DROITE : Dashboard card ═══ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px, 8vh, 80px) clamp(24px, 6vw, 80px) clamp(40px, 8vh, 80px) 0',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 440 }}>

          {/* ── Carte principale : terrain ── */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24, padding: 28,
            boxShadow: '0 24px 60px rgba(30,58,47,0.14), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid rgba(184,151,42,0.1)',
            animation: 'floatCard 6s ease-in-out infinite',
          }}>

            {/* En-tête */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#8C8278', fontWeight: 500,
                             textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Terrain pilote · MVP
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem',
                              fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                  Calavi Nord — Zone Résidentielle
                </h3>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 600,
                background: 'rgba(30,58,47,0.08)', color: '#1E3A2F',
                border: '1px solid rgba(30,58,47,0.15)',
              }}>
                🟢 Disponible
              </span>
            </div>

            {/* Carte visuelle */}
            <div style={{
              width: '100%', height: 160, borderRadius: 16,
              background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 50%, #3D6B53 100%)',
              position: 'relative', overflow: 'hidden', marginBottom: 18,
            }}>
              {/* Grille */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.15,
                backgroundImage: `
                  linear-gradient(rgba(245,240,232,.6) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245,240,232,.6) 1px, transparent 1px)
                `,
                backgroundSize: '28px 28px',
              }} />
              {/* Marqueur central */}
              <div style={{
                position: 'absolute', top: '50%', left: '55%',
                transform: 'translate(-50%, -50%)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50% 50% 50% 0',
                  background: '#B8972A', transform: 'rotate(-45deg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(184,151,42,0.5)',
                  animation: 'mapPulse 2s ease infinite',
                }}>
                  <div style={{ transform: 'rotate(45deg)', fontSize: 14 }}>📍</div>
                </div>
              </div>
              {/* Label localisation */}
              <div style={{
                position: 'absolute', bottom: 10, left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.95)',
                padding: '5px 14px', borderRadius: 8,
                fontSize: '0.72rem', fontWeight: 600, color: '#1A1A1A',
                whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                📍 Abomey-Calavi, Bénin
              </div>
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.3)',
                padding: '3px 8px', borderRadius: 4,
                fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)',
              }}>
                🛰️ OpenStreetMap
              </div>
            </div>

            {/* Stats du terrain */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
              {[
                { label: 'Prix / m²', value: '15 000', unit: 'FCFA' },
                { label: 'Disponible', value: '155', unit: 'm²' },
                { label: 'Rendement', value: '14', unit: '%/an' },
              ].map(({ label, value, unit }) => (
                <div key={label} style={{
                  background: '#F5F0E8', borderRadius: 12, padding: '10px 8px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: '0.65rem', color: '#8C8278', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif",
                               fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                    {value}<span style={{ fontSize: '0.65rem', color: '#8C8278', marginLeft: 2 }}>{unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Barre de progression */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                             fontSize: '0.75rem', color: '#8C8278', marginBottom: 6 }}>
                <span>1 700 m² vendus · 68% financé</span>
                <span style={{ fontWeight: 600, color: '#1E3A2F' }}>68%</span>
              </div>
              <div style={{ height: 8, background: '#EDE6D6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: '68%', borderRadius: 4,
                  background: 'linear-gradient(90deg, #1E3A2F, #3D6B53)',
                  transition: 'width 1.5s ease',
                }} />
              </div>
              <p style={{ fontSize: '0.7rem', color: '#8C8278', marginTop: 4, margin: '4px 0 0' }}>
                800 m² encore disponibles
              </p>
            </div>

            {/* Bouton */}
            <Link to="/inscription" style={{
              display: 'block', width: '100%', padding: '13px',
              borderRadius: 50, textAlign: 'center',
              background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              color: '#F5F0E8', textDecoration: 'none',
              fontWeight: 600, fontSize: '0.92rem',
              boxShadow: '0 4px 16px rgba(30,58,47,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,47,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,47,0.25)' }}>
              Investir dans ce terrain →
            </Link>
          </div>

          {/* ── Badge flottant : Notaire ── */}
          <div style={{
            position: 'absolute', top: -16, right: -16,
            background: '#FFFFFF', borderRadius: 16, padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(184,151,42,0.12)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'floatBadge1 5s ease-in-out infinite',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(30,58,47,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>🏅</div>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Vérifié</p>
              <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>Me Akobi · Notaire</p>
            </div>
          </div>

          {/* ── Badge flottant : Mobile Money ── */}
          <div style={{
            position: 'absolute', bottom: -16, left: -16,
            background: '#FFFFFF', borderRadius: 16, padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(184,151,42,0.12)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'floatBadge2 4s ease-in-out 1s infinite',
          }}>
            <span style={{ fontSize: '1.4rem' }}>📱</span>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>MTN MoMo</p>
              <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>Paiement accepté ✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticker live en bas ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(30,58,47,0.04)',
        borderTop: '1px solid rgba(184,151,42,0.12)',
        padding: '10px 5vw',
        display: 'flex', alignItems: 'center', gap: 12,
        zIndex: 3,
      }}>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, color: '#1E3A2F',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>
          🔴 Live
        </span>
        <div style={{ width: 1, height: 16, background: 'rgba(184,151,42,0.3)' }} />
        <p style={{
          fontSize: '0.82rem', color: '#6B6459', margin: 0,
          opacity: tickerFade ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          {tickers[tickerIdx]}
        </p>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%  { opacity: 0.5; transform: scale(0.7); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes floatBadge1 {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-6px) rotate(0deg); }
        }
        @keyframes floatBadge2 {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%      { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes mapPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(184,151,42,0.5); }
          50%      { box-shadow: 0 4px 28px rgba(184,151,42,0.8); }
        }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Bande de stats animées
// ═══════════════════════════════════════════════════════════════════
function StatsBand() {
  const [ref, inView] = useInView(0.5)

  const c1 = useCountUp(3200,  2200, inView)
  const c2 = useCountUp(48,    1800, inView)
  const c3 = useCountUp(1200,  2500, inView)
  const c4 = useCountUp(100,   1500, inView)

  const stats = [
    { value: c1, suffix: ' m²', label: 'Superficie totale gérée' },
    { value: c2, suffix: '+',   label: 'Terrains disponibles' },
    { value: c3, suffix: '+',   label: 'Investisseurs actifs' },
    { value: c4, suffix: '%',   label: 'Documents sécurisés' },
  ]

  return (
    <div ref={ref} style={{
      background: '#1E3A2F',
      padding: '2.5rem 5vw',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
      }}>
        {stats.map(({ value, suffix, label }, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '1rem',
            borderRight: i < 3 ? '1px solid rgba(245,240,232,0.1)' : 'none',
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)',
              fontWeight: 700, color: '#D4AD3A',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}>
              {value.toLocaleString()}<span style={{ fontSize: '1rem' }}>{suffix}</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)', margin: 0 }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Section Terrains disponibles
// ═══════════════════════════════════════════════════════════════════
function TerrainsSection() {
  const terrains = [
    {
      name: 'Terrain Calavi Nord',
      subtitle: 'Zone Résidentielle Premium',
      location: 'Abomey-Calavi, Atlantique',
      price: '15 000',
      surface: '2 500',
      rendement: '12.5%',
      financed: 68,
      status: 'available',
      gradient: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #B8972A 100%)',
    },
    {
      name: 'Parcelle Fidjrossè',
      subtitle: 'Front de Mer · Cotonou',
      location: 'Cotonou, Littoral',
      price: '35 000',
      surface: '1 200',
      rendement: '18%',
      financed: 91,
      status: 'filling',
      gradient: 'linear-gradient(135deg, #2D5241 0%, #B8972A 50%, #D4AD3A 100%)',
    },
    {
      name: 'Zone Agro-Commerciale',
      subtitle: 'Secteur Porteur · Nord Bénin',
      location: 'Parakou, Borgou',
      price: '8 500',
      surface: '5 000',
      rendement: '14%',
      financed: 32,
      status: 'available',
      gradient: 'linear-gradient(135deg, #3D6B53 0%, #1E3A2F 50%, #4E8467 100%)',
    },
  ]

  const [ref, inView] = useInView(0.1)

  return (
    <section id="terrains" ref={ref} style={{
      background: '#FAFAF7',
      padding: 'clamp(60px, 8vh, 100px) 5vw',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Titre section */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: '3rem',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <p style={{
              fontSize: '0.72rem', fontWeight: 700, color: '#B8972A',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
            }}>
              Opportunités d'investissement
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 700, color: '#1A1A1A',
              letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2,
            }}>
              Terrains disponibles
            </h2>
          </div>
          <a href="#" style={{
            padding: '10px 22px', borderRadius: 50,
            border: '1.5px solid rgba(30,58,47,0.2)',
            color: '#1E3A2F', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.color = '#F5F0E8' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E3A2F' }}>
            Voir tous les terrains →
          </a>
        </div>

        {/* Grille terrains */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {terrains.map((t, i) => (
            <div key={i}
              style={{
                background: '#FFFFFF', borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(30,58,47,0.07)',
                border: '1px solid rgba(184,151,42,0.08)',
                transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 0.1}s`,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(30,58,47,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(30,58,47,0.07)' }}
            >

              {/* Image placeholder */}
              <div style={{
                height: 180, background: t.gradient,
                position: 'relative', overflow: 'hidden',
              }}>
                {/* SVG illustration terrain */}
                <svg style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
                     width="80" height="60" viewBox="0 0 80 60" fill="none">
                  <rect x="15" y="30" width="50" height="28" rx="2" fill="rgba(245,240,232,0.12)"/>
                  <path d="M15 30 L40 8 L65 30" stroke="rgba(245,240,232,0.3)" strokeWidth="1.5" fill="none"/>
                  <rect x="34" y="40" width="12" height="18" rx="1" fill="rgba(184,151,42,0.4)"/>
                </svg>

                {/* Badge statut */}
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  padding: '4px 10px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 600,
                  background: t.status === 'available'
                    ? 'rgba(30,58,47,0.85)' : 'rgba(184,151,42,0.85)',
                  color: '#F5F0E8',
                  backdropFilter: 'blur(4px)',
                }}>
                  {t.status === 'available' ? '✓ Disponible' : '⏳ En cours'}
                </span>

                {/* Rendement badge */}
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '4px 10px',
                }}>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.7)', margin: 0 }}>Rendement</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#D4AD3A', margin: 0 }}>{t.rendement}</p>
                </div>
              </div>

              {/* Corps de la card */}
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '0.7rem', color: '#8C8278', marginBottom: 4 }}>📍 {t.location}</p>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.05rem', fontWeight: 700, color: '#1A1A1A',
                  margin: '0 0 2px',
                }}>
                  {t.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6B6459', margin: '0 0 16px' }}>
                  {t.subtitle}
                </p>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8, marginBottom: 14,
                }}>
                  {[
                    { k: 'm² total', v: t.surface },
                    { k: 'Rendement', v: t.rendement },
                    { k: 'Financé', v: `${t.financed}%` },
                  ].map(({ k, v }) => (
                    <div key={k} style={{
                      background: '#F5F0E8', borderRadius: 8, padding: '8px 6px',
                      textAlign: 'center',
                    }}>
                      <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: '0 0 2px' }}>{k}</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{v}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                                 fontSize: '0.72rem', color: '#8C8278', marginBottom: 4 }}>
                    <span>Progression</span>
                    <span style={{ fontWeight: 600, color: '#1E3A2F' }}>{t.financed}%</span>
                  </div>
                  <div style={{ height: 6, background: '#EDE6D6', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: inView ? `${t.financed}%` : '0%',
                      background: t.financed > 80
                        ? 'linear-gradient(90deg, #B8972A, #D4AD3A)'
                        : 'linear-gradient(90deg, #1E3A2F, #3D6B53)',
                      transition: `width 1.2s ease ${0.3 + i * 0.15}s`,
                    }} />
                  </div>
                </div>

                {/* Prix + Bouton */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.68rem', color: '#8C8278', margin: '0 0 2px' }}>Prix</p>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.1rem', fontWeight: 700, color: '#1E3A2F', margin: 0,
                    }}>
                      {t.price} <span style={{ fontSize: '0.7rem', color: '#8C8278', fontFamily: 'DM Sans, sans-serif' }}>FCFA/m²</span>
                    </p>
                  </div>
                  <Link to="/inscription" style={{
                    padding: '9px 20px', borderRadius: 50,
                    background: '#1E3A2F', color: '#F5F0E8',
                    textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2D5241'; e.currentTarget.style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1E3A2F'; e.currentTarget.style.transform = 'scale(1)' }}>
                    Investir →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Comment ça marche — 4 étapes
// ═══════════════════════════════════════════════════════════════════
function HowItWorks() {
  const [ref, inView] = useInView(0.1)

  const steps = [
    {
      num: '01',
      icon: '👤',
      title: 'Créez votre compte',
      desc: 'Inscription en 2 min avec votre email. Vérifiez votre identité via KYC sécurisé pour accéder à tous les terrains.',
    },
    {
      num: '02',
      icon: '🗺️',
      title: 'Choisissez un terrain',
      desc: 'Parcourez les fiches : photos, carte interactive, documents juridiques, prix et taux de financement en temps réel.',
    },
    {
      num: '03',
      icon: '💳',
      title: 'Achetez vos parts (m²)',
      desc: 'Sélectionnez le nombre de m² voulu. Payez via MTN MoMo, Moov Money ou carte bancaire. Réservation immédiate.',
    },
    {
      num: '04',
      icon: '📜',
      title: 'Recevez votre attestation',
      desc: 'Certificat PDF avec QR code de vérification généré automatiquement. Suivez votre portefeuille en temps réel.',
    },
  ]

  return (
    <section id="comment" ref={ref} style={{
      background: '#FFFFFF',
      padding: 'clamp(60px, 8vh, 100px) 5vw',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B8972A',
                       textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Comment ça marche
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#1A1A1A',
            letterSpacing: '-0.02em', margin: '0 0 12px',
          }}>
            Investir dans un terrain<br />
            n'a jamais été aussi <span style={{ color: '#1E3A2F' }}>simple</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#6B6459', maxWidth: 520, margin: '0 auto' }}>
            En 4 étapes, devenez copropriétaire d'un terrain juridiquement
            sécurisé — depuis votre téléphone.
          </p>
        </div>

        {/* Grille des étapes */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem', position: 'relative',
        }}>
          {/* Ligne de connexion */}
          <div style={{
            position: 'absolute', top: 40, left: '12.5%', right: '12.5%',
            height: 1, background: 'linear-gradient(90deg, transparent, #B8972A 20%, #B8972A 80%, transparent)',
            opacity: 0.3, zIndex: 0,
          }} />

          {steps.map((step, i) => (
            <div key={i} style={{
              background: '#FAFAF7', borderRadius: 20, padding: '28px 20px',
              textAlign: 'center', position: 'relative', zIndex: 1,
              border: '1px solid rgba(184,151,42,0.1)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${i * 0.12}s`,
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(30,58,47,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = inView ? 'translateY(0)' : 'translateY(20px)' }}>

              {/* Numéro */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#1E3A2F', color: '#F5F0E8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.2rem', fontWeight: 700,
                margin: '0 auto 16px',
                boxShadow: '0 4px 14px rgba(30,58,47,0.25)',
              }}>
                {step.icon}
              </div>

              {/* Badge numéro */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 24, height: 24, borderRadius: '50%',
                background: '#B8972A', color: '#F5F0E8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
              }}>
                {step.num}
              </div>

              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1rem', fontWeight: 700, color: '#1A1A1A',
                margin: '0 0 10px',
              }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6B6459', lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Pourquoi LandShare (features)
// ═══════════════════════════════════════════════════════════════════
function WhySection() {
  const [ref, inView] = useInView(0.1)

  const features = [
    {
      icon: '🛡️',
      title: 'Sécurité juridique totale',
      desc: 'Chaque terrain dispose d\'un titre foncier authentique, vérifié et publié sur la plateforme.',
    },
    {
      icon: '⚡',
      title: 'Investissement en 10 min',
      desc: 'De la création de compte à l\'achat — tout depuis votre téléphone en quelques minutes.',
    },
    {
      icon: '💎',
      title: 'Dès 1 m² seulement',
      desc: 'Commencez avec le montant qui vous convient. Chaque m² acheté est une part de propriété réelle.',
    },
    {
      icon: '📈',
      title: 'Portefeuille en temps réel',
      desc: 'Tableau de bord complet : valeur estimée, évolution, attestations téléchargeables.',
    },
  ]

  return (
    <section id="pourquoi" ref={ref} style={{
      background: '#F5F0E8',
      padding: 'clamp(60px, 8vh, 100px) 5vw',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto',
                     display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

        {/* ── Colonne gauche : carte graphique ── */}
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.7s ease',
        }}>
          {/* Carte principale */}
          <div style={{
            background: '#FFFFFF', borderRadius: 24, padding: 28,
            boxShadow: '0 20px 60px rgba(30,58,47,0.1)',
            border: '1px solid rgba(184,151,42,0.1)',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(184,151,42,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
              }}>
                📊
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif",
                              fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                  Valorisation de votre patrimoine
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#8C8278', margin: 0 }}>
                  Croissance annuelle moyenne constatée
                </p>
              </div>
            </div>

            {/* Graphique à barres */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
              {[
                { year: '2020', h: 30 }, { year: '2021', h: 45 },
                { year: '2022', h: 55 }, { year: '2023', h: 70 },
                { year: '2024', h: 85 }, { year: '2025', h: 100, active: true },
              ].map(({ year, h, active }) => (
                <div key={year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', height: inView ? `${h}%` : '0%',
                    background: active
                      ? 'linear-gradient(180deg, #B8972A, #D4AD3A)'
                      : 'linear-gradient(180deg, #1E3A2F, #3D6B53)',
                    borderRadius: '6px 6px 0 0',
                    transition: `height 0.8s ease ${0.1 * ['2020','2021','2022','2023','2024','2025'].indexOf(year)}s`,
                    cursor: 'pointer',
                    opacity: active ? 1 : 0.6,
                  }} />
                  <span style={{ fontSize: '0.65rem', color: '#8C8278' }}>{year}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: '10px 14px',
              background: 'rgba(30,58,47,0.05)', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '1rem' }}>📈</span>
              <p style={{ fontSize: '0.78rem', color: '#1E3A2F', fontWeight: 500, margin: 0 }}>
                +12 à 18% de croissance annuelle moyenne au Bénin
              </p>
            </div>
          </div>

          {/* Mini cartes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '✅', title: 'KYC Vérifié', sub: 'Identité sécurisée' },
              { icon: '🔐', title: 'Titres fonciers', sub: 'Documents légaux' },
            ].map(({ icon, title, sub }) => (
              <div key={title} style={{
                background: '#FFFFFF', borderRadius: 14, padding: '14px',
                border: '1px solid rgba(184,151,42,0.1)',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(30,58,47,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{title}</p>
                  <p style={{ fontSize: '0.7rem', color: '#8C8278', margin: 0 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonne droite : features ── */}
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B8972A',
                       textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Pourquoi LandShare
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1A1A1A',
            letterSpacing: '-0.02em', margin: '0 0 16px', lineHeight: 1.2,
          }}>
            La propriété foncière accessible à{' '}
            <span style={{ color: '#B8972A' }}>tous les Béninois</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#6B6459', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Nous éliminons les barrières traditionnelles : capital élevé,
            complexité juridique, opacité des transactions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {features.map(({ icon, title, desc }, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(20px)',
                transition: `all 0.5s ease ${0.3 + i * 0.1}s`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(30,58,47,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                }}>
                  {icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>
                    {title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#6B6459', margin: 0, lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Témoignages
// ═══════════════════════════════════════════════════════════════════
function Testimonials() {
  const [ref, inView] = useInView(0.1)

  const testimonials = [
    {
      initials: 'AK', name: 'Adeola Kossou',
      role: 'Ingénieure · Paris, France',
      bg: '#1E3A2F',
      text: '"J\'ai investi 50 000 FCFA en quelques minutes depuis Paris. L\'attestation PDF m\'a été envoyée immédiatement. C\'est révolutionnaire pour nous les Béninois de la diaspora."',
      stars: 5,
    },
    {
      initials: 'MF', name: 'Malick Fassinou',
      role: 'Entrepreneur · Cotonou',
      bg: '#2D5241',
      text: '"Enfin une plateforme sérieuse ! J\'ai acheté mes premiers m² avec MTN MoMo. Les documents sont clairs, le suivi est parfait. Je recommande à tous mes proches."',
      stars: 5,
    },
    {
      initials: 'SB', name: 'Sylvie Bello',
      role: 'Médecin · Parakou, Bénin',
      bg: '#B8972A',
      text: '"LandShare m\'a permis de diversifier mon patrimoine. La transparence des documents et la qualité du service sont au rendez-vous. Une vraie innovation pour notre pays."',
      stars: 5,
    },
  ]

  return (
    <section id="temoignages" ref={ref} style={{
      background: '#FFFFFF',
      padding: 'clamp(60px, 8vh, 100px) 5vw',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                       marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B8972A',
                         textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Témoignages
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1A1A1A',
              letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2,
            }}>
              Ce que disent<br />nos investisseurs
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#B8972A">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            ))}
            <span style={{ fontSize: '0.82rem', color: '#6B6459', marginLeft: 6 }}>
              4.9/5 · 200+ avis
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: '#FAFAF7', borderRadius: 20, padding: 28,
              border: '1px solid rgba(184,151,42,0.08)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease ${i * 0.12}s`,
            }}>

              {/* Étoiles */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(t.stars)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#B8972A">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>

              {/* Texte */}
              <p style={{
                fontSize: '0.9rem', color: '#3D3530', lineHeight: 1.7,
                fontStyle: 'italic', marginBottom: 20,
              }}>
                {t.text}
              </p>

              {/* Auteur */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: t.bg, color: '#F5F0E8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#8C8278', margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : CTA Final
// ═══════════════════════════════════════════════════════════════════
function CTASection() {
  return (
    <section style={{
      background: 'linear-gradient(160deg, #1E3A2F 0%, #2D5241 60%, #1E3A2F 100%)',
      padding: 'clamp(60px, 10vh, 120px) 5vw',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Déco */}
      <div style={{
        position: 'absolute', top: '50%', right: '-5%',
        transform: 'translateY(-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184,151,42,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.3)',
          borderRadius: 50, padding: '6px 16px',
          fontSize: '0.72rem', fontWeight: 500, color: '#D4AD3A',
          letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>
          Commencez dès aujourd'hui
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#F5F0E8',
          letterSpacing: '-0.02em', margin: '0 0 1.2rem', lineHeight: 1.15,
        }}>
          Votre premier m² de<br />
          <span style={{ color: '#D4AD3A' }}>terre béninoise</span> vous attend
        </h2>

        <p style={{ fontSize: '1rem', color: 'rgba(245,240,232,0.7)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Rejoignez plus de <strong style={{ color: '#F5F0E8' }}>1 200 investisseurs</strong> qui
          construisent leur patrimoine foncier avec LandShare.
          Inscription gratuite, KYC rapide, investissement sécurisé.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link to="/inscription" style={{
            padding: '14px 32px', borderRadius: 50,
            background: '#F5F0E8', color: '#1E3A2F',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600,
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)' }}>
            Créer mon compte gratuit →
          </Link>
          <a href="#terrains" style={{
            padding: '13px 28px', borderRadius: 50,
            border: '1.5px solid rgba(245,240,232,0.3)', color: '#F5F0E8',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,240,232,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
            Voir les terrains
          </a>
        </div>

        {/* Modes de paiement */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                       gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)' }}>Paiements acceptés :</span>
          {[
            { dot: '#FFCC00', label: 'MTN MoMo' },
            { dot: '#0056A2', label: 'Moov Money' },
            { dot: '#635BFF', label: 'Stripe' },
            { dot: '#00C3F7', label: 'Paystack' },
          ].map(({ dot, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,240,232,0.08)',
              border: '1px solid rgba(245,240,232,0.12)',
              borderRadius: 50, padding: '4px 12px',
              fontSize: '0.75rem', color: 'rgba(245,240,232,0.7)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT : Footer
// ═══════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer style={{ background: '#111810' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 5vw 2rem' }}>

        {/* Top */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '3rem', marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, background: '#1E3A2F', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 14, height: 14, background: '#B8972A',
                               clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif",
                              fontSize: '1.1rem', fontWeight: 700, color: '#F5F0E8' }}>
                Land<span style={{ color: '#B8972A' }}>Share</span> Bénin
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)', lineHeight: 1.7 }}>
              Plateforme de land banking participatif au Bénin.
              Démocratisons l'accès à la propriété foncière pour tous les Béninois.
            </p>
          </div>

          {/* Cols */}
          {[
            { title: 'Plateforme', links: ['Terrains disponibles', 'Comment ça marche', 'Tableau de bord', 'Mes attestations'] },
            { title: 'Légal', links: ["Conditions d'utilisation", 'Politique de confidentialité', 'KYC & Conformité', 'Mentions légales'] },
            { title: 'Contact', links: ['FAQ & Aide', 'contact@landshare.bj', '+229 XX XX XX XX', 'Cotonou, Bénin'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(245,240,232,0.6)',
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                {title}
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      fontSize: '0.82rem', color: 'rgba(245,240,232,0.45)',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#F5F0E8'}
                    onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.45)'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(245,240,232,0.07)',
          paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', margin: 0 }}>
            © 2025 LandShare Bénin — LIGALI Fouad & YAHAYA Ahamed. Tous droits réservés.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', margin: 0 }}>
            Plateforme MVP v1.0 · Investissement foncier participatif
          </p>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : Landing Page assemblée
// ═══════════════════════════════════════════════════════════════════
export default function Landing() {
  // Charge les polices Google dans le head
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <Hero />
      <StatsBand />
      <TerrainsSection />
      <HowItWorks />
      <WhySection />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  )
}