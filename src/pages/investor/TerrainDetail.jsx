// ═══════════════════════════════════════════════════════════════════
// TerrainDetail.jsx — Version 100% corrigée
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ─── Fix icône Leaflet ─────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ─── Charger les polices ───────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])
}

// ─── Hook InView corrigé ───────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref    = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    const el = ref.current
    if (el) observer.observe(el)
    // ✅ cleanup correct
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const TERRAIN = {
  id:           1,
  name:         'Calavi Nord — Zone Résidentielle',
  subtitle:     'Terrain résidentiel premium · Titre foncier certifié',
  location:     'Abomey-Calavi, Atlantique, Bénin',
  lat:           6.3622,
  lng:           2.3158,
  totalSqm:     2500,
  availableSqm: 800,
  pricePerSqm:  15000,
  rendement:    '12.5%',
  financed:     68,
  notary:       'Maître Kofi Akobi',
  cabinetNotary:'Cabinet Akobi & Associés, Cotonou',
  verifiedDate: '15 Septembre 2025',
  investors:    47,
  transactions: 128,
  description:  `Terrain résidentiel de premier ordre situé dans le quartier prisé d'Akogbato à Abomey-Calavi, à seulement 8 kilomètres du centre de Cotonou. Ce terrain bénéficie d'un accès bitumé, de l'électricité et de l'eau courante. La zone est en plein développement avec plusieurs projets immobiliers voisins en cours de construction.`,
  features: [
    'Accès route bitumée',
    'Électricité disponible',
    'Eau courante à proximité',
    'Zone résidentielle calme',
    'Titre foncier authentique',
    'Plan cadastral officiel',
  ],
  documents: [
    { name: 'Titre foncier N°4782',     type: 'PDF', size: '1.2 Mo', icon: '📕', verified: true  },
    { name: 'Plan cadastral officiel',  type: 'PDF', size: '2.8 Mo', icon: '📗', verified: true  },
    { name: 'Rapport notarial complet', type: 'PDF', size: '0.9 Mo', icon: '📘', verified: true  },
    { name: 'Photos drone (12 vues)',   type: 'ZIP', size: '18 Mo',  icon: '📷', verified: false },
  ],
  photos: [
    { gradient: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 50%, #3D6B53 100%)', label: 'Vue principale' },
    { gradient: 'linear-gradient(135deg, #2D5241 0%, #B8972A 60%, #D4AD3A 100%)', label: 'Vue est'        },
    { gradient: 'linear-gradient(135deg, #3D6B53 0%, #1E3A2F 60%, #2D5241 100%)', label: 'Vue nord'       },
    { gradient: 'linear-gradient(135deg, #B8972A 0%, #1E3A2F 50%, #3D6B53 100%)', label: 'Vue drone'      },
  ],
}

// ═══════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    // ✅ cleanup correct
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 68,
      background: scrolled
        ? 'rgba(245,240,232,0.96)'
        : 'rgba(245,240,232,0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(184,151,42,0.15)',
      boxShadow: scrolled ? '0 4px 24px rgba(30,58,47,0.08)' : 'none',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5vw',
      transition: 'all 0.3s ease',
    }}>

      {/* Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 32, height: 32, background: '#1E3A2F',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 12, height: 12, background: '#B8972A',
              clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', fontWeight: 700, color: '#1E3A2F',
          }}>
            Land<span style={{ color: '#B8972A' }}>Share</span>
          </span>
        </Link>
        <span style={{ color: 'rgba(30,58,47,0.3)' }}>/</span>
        <span style={{ fontSize: '0.82rem', color: '#8C8278' }}>Terrains</span>
        <span style={{ color: 'rgba(30,58,47,0.3)' }}>/</span>
        <span style={{ fontSize: '0.82rem', color: '#1E3A2F', fontWeight: 600 }}>
          Calavi Nord
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link to="/dashboard" style={{
          padding: '8px 16px', borderRadius: 8,
          border: '1.5px solid rgba(30,58,47,0.2)',
          color: '#1E3A2F', textDecoration: 'none',
          fontSize: '0.82rem', fontWeight: 600,
          transition: 'all 0.2s',
        }}>
          ← Dashboard
        </Link>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'linear-gradient(135deg, #1E3A2F, #B8972A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.72rem', fontWeight: 700, color: '#F5F0E8',
        }}>
          FL
        </div>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════
// GALERIE PHOTOS
// ═══════════════════════════════════════════════════════════════════
function PhotoGallery({ photos }) {
  const [active, setActive] = useState(0)

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Photo principale */}
      <div style={{
        width: '100%', height: 320, borderRadius: 16,
        background: photos[active].gradient,
        position: 'relative', overflow: 'hidden', marginBottom: 10,
        transition: 'background 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Grille déco */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: `
            linear-gradient(rgba(245,240,232,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,240,232,.5) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }} />

        {/* Icône centrale */}
        <span style={{ fontSize: '5rem', opacity: 0.2 }}>🏡</span>

        {/* Badges */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', gap: 8,
        }}>
          <span style={{
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(30,58,47,0.85)', color: '#F5F0E8',
            fontSize: '0.7rem', fontWeight: 600,
          }}>
            🟢 Disponible
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(184,151,42,0.85)', color: '#1A1A1A',
            fontSize: '0.7rem', fontWeight: 600,
          }}>
            🏅 Notaire certifié
          </span>
        </div>

        {/* Label */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
          padding: '4px 12px', borderRadius: 8,
          fontSize: '0.7rem', color: 'rgba(245,240,232,0.9)',
        }}>
          {photos[active].label} · {active + 1}/{photos.length}
        </div>
      </div>

      {/* Miniatures */}
      <div style={{ display: 'flex', gap: 8 }}>
        {photos.map((photo, i) => (
          <div key={i} onClick={() => setActive(i)} style={{
            flex: 1, height: 68, borderRadius: 10,
            background: photo.gradient, cursor: 'pointer',
            border: `2.5px solid ${i === active ? '#B8972A' : 'transparent'}`,
            opacity: i === active ? 1 : 0.55,
            transition: 'all 0.2s',
          }} />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════
function ContentTabs({ terrain }) {
  const [activeTab, setActiveTab] = useState('presentation')

  const tabs = [
    { id: 'presentation', label: '📋 Présentation' },
    { id: 'documents',    label: '📄 Documents'    },
    { id: 'juridique',    label: '⚖️ Juridique'    },
    { id: 'carte',        label: '🗺️ Localisation'  },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid rgba(30,58,47,0.08)',
        marginBottom: 24,
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '11px 18px', border: 'none', cursor: 'pointer',
            background: 'transparent',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? '#1E3A2F' : '#8C8278',
            borderBottom: `2px solid ${activeTab === tab.id ? '#1E3A2F' : 'transparent'}`,
            marginBottom: -2, transition: 'all 0.2s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Présentation ── */}
      {activeTab === 'presentation' && (
        <div>
          <p style={{
            fontSize: '0.92rem', color: '#4A3F35',
            lineHeight: 1.85, marginBottom: 20,
          }}>
            {terrain.description}
          </p>

          <h4 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', fontWeight: 700,
            color: '#1A1A1A', marginBottom: 12,
          }}>
            Caractéristiques
          </h4>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8, marginBottom: 20,
          }}>
            {terrain.features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#FAFAF7', borderRadius: 10,
                padding: '10px 14px',
                border: '1px solid rgba(30,58,47,0.06)',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: 'rgba(30,58,47,0.08)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem', color: '#1E3A2F',
                  flexShrink: 0,
                }}>
                  ✓
                </div>
                <span style={{
                  fontSize: '0.82rem', color: '#4A3F35', fontWeight: 500,
                }}>
                  {f}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10,
          }}>
            {[
              { label: 'Notaire',        value: terrain.notary,       icon: '🏛️' },
              { label: 'Vérifié le',     value: terrain.verifiedDate, icon: '📅' },
              { label: 'Investisseurs',  value: `${terrain.investors} actifs`, icon: '👥' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: '#FAFAF7', borderRadius: 12,
                padding: '14px', textAlign: 'center',
                border: '1px solid rgba(30,58,47,0.06)',
              }}>
                <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: 6 }}>
                  {icon}
                </span>
                <p style={{
                  fontSize: '0.65rem', color: '#8C8278',
                  margin: '0 0 3px', textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {label}
                </p>
                <p style={{
                  fontSize: '0.8rem', fontWeight: 700,
                  color: '#1A1A1A', margin: 0,
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === 'documents' && (
        <div>
          <p style={{
            fontSize: '0.88rem', color: '#6B6459',
            marginBottom: 16, lineHeight: 1.6,
          }}>
            Tous les documents juridiques sont vérifiés et téléchargeables.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {terrain.documents.map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#FAFAF7', borderRadius: 12,
                padding: '14px 16px',
                border: '1px solid rgba(30,58,47,0.06)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'rgba(192,57,43,0.08)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.3rem',
                  flexShrink: 0,
                }}>
                  {doc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '0.88rem', fontWeight: 600,
                    color: '#1A1A1A', margin: '0 0 2px',
                  }}>
                    {doc.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#8C8278', margin: 0 }}>
                    {doc.type} · {doc.size}
                  </p>
                </div>
                {doc.verified && (
                  <span style={{
                    padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(30,58,47,0.08)', color: '#1E3A2F',
                    fontSize: '0.68rem', fontWeight: 600,
                  }}>
                    ✓ Vérifié
                  </span>
                )}
                <button style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: '#1E3A2F', color: '#F5F0E8',
                  border: 'none', fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  ⬇ PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Juridique ── */}
      {activeTab === 'juridique' && (
        <div>
          <div style={{
            background: 'rgba(30,58,47,0.05)',
            borderLeft: '4px solid #1E3A2F',
            borderRadius: '0 12px 12px 0',
            padding: '14px 16px', marginBottom: 16,
          }}>
            <h4 style={{
              fontSize: '0.9rem', fontWeight: 700,
              color: '#1E3A2F', margin: '0 0 6px',
            }}>
              ℹ️ Nature de vos parts
            </h4>
            <p style={{
              fontSize: '0.82rem', color: '#4A3F35',
              margin: 0, lineHeight: 1.7,
            }}>
              L'achat de parts vous donne un{' '}
              <strong>droit de co-propriété fractionnée</strong>{' '}
              sur le terrain, représenté par une attestation numérique officielle.
            </p>
          </div>
          {[
            {
              title: 'Cadre légal',
              content: 'Conformément au droit OHADA et aux lois béninoises sur l\'investissement foncier. Chaque transaction est enregistrée et tracée par un avocat partenaire.',
            },
            {
              title: 'Risques & liquidité',
              content: 'Investissement de long terme. La revente de parts n\'est pas garantie à court terme. Ne pas investir des sommes dont vous aurez besoin rapidement.',
            },
            {
              title: 'Protection investisseurs',
              content: 'Mécanisme d\'arbitrage OHADA prévu. Les fonds sont séquestrés dans un compte dédié jusqu\'à l\'attribution des parts.',
            },
          ].map(({ title, content }, i) => (
            <div key={i} style={{
              background: '#FAFAF7', borderRadius: 12,
              padding: '14px 16px', marginBottom: 10,
              border: '1px solid rgba(30,58,47,0.06)',
            }}>
              <h4 style={{
                fontSize: '0.88rem', fontWeight: 700,
                color: '#1A1A1A', margin: '0 0 6px',
              }}>
                {title}
              </h4>
              <p style={{
                fontSize: '0.82rem', color: '#6B6459',
                margin: 0, lineHeight: 1.65,
              }}>
                {content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Carte Leaflet ── */}
      {activeTab === 'carte' && (
        <div>
          <p style={{
            fontSize: '0.88rem', color: '#6B6459', marginBottom: 12,
          }}>
            📍 <strong style={{ color: '#1A1A1A' }}>{terrain.location}</strong>
          </p>
          <div style={{
            borderRadius: 14, overflow: 'hidden',
            border: '1px solid rgba(30,58,47,0.1)',
            boxShadow: '0 4px 20px rgba(30,58,47,0.08)',
            marginBottom: 12,
          }}>
            <MapContainer
              center={[terrain.lat, terrain.lng]}
              zoom={15}
              style={{ height: 340, width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[terrain.lat, terrain.lng]}>
                <Popup>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <strong style={{ color: '#1E3A2F' }}>{terrain.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.78rem', color: '#8C8278' }}>
                      {terrain.location}
                    </span>
                    <br />
                    <span style={{
                      fontSize: '0.78rem', color: '#B8972A', fontWeight: 600,
                    }}>
                      15 000 FCFA / m²
                    </span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center',
            background: '#FAFAF7', borderRadius: 10,
            padding: '10px 14px',
            border: '1px solid rgba(30,58,47,0.06)',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#8C8278' }}>
              🛰️ Coordonnées GPS :
            </span>
            <span style={{
              fontFamily: 'monospace', fontSize: '0.8rem',
              color: '#1E3A2F', fontWeight: 600,
            }}>
              {terrain.lat}° N, {terrain.lng}° E
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// BARRE DE PROGRESSION ✅ 100% corrigée
// ═══════════════════════════════════════════════════════════════════
function TerrainProgress({ terrain }) {
  const [animated, setAnimated] = useState(false)
  const progressRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    const el = progressRef.current
    if (el) observer.observe(el)
    // ✅ cleanup correct
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={progressRef} style={{
      background: '#FFFFFF', borderRadius: 16,
      padding: '18px 20px',
      boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
      border: '1px solid rgba(30,58,47,0.06)',
      marginBottom: 16,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 12,
      }}>
        <h4 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.95rem', fontWeight: 700,
          color: '#1A1A1A', margin: 0,
        }}>
          Financement du terrain
        </h4>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700,
          padding: '3px 10px', borderRadius: 20,
          background: 'rgba(30,58,47,0.08)', color: '#1E3A2F',
        }}>
          {terrain.financed}% financé
        </span>
      </div>

      <div style={{
        height: 10, background: '#EDE6D6',
        borderRadius: 5, overflow: 'hidden', marginBottom: 8,
      }}>
        <div style={{
          height: '100%', borderRadius: 5,
          width: animated ? `${terrain.financed}%` : '0%',
          background: 'linear-gradient(90deg, #1E3A2F, #3D6B53)',
          transition: 'width 1.5s ease',
        }} />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.75rem', color: '#8C8278', marginBottom: 14,
      }}>
        <span>
          {(terrain.totalSqm - terrain.availableSqm).toLocaleString()} m² vendus
        </span>
        <span>{terrain.availableSqm.toLocaleString()} m² disponibles</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8,
      }}>
        {[
          { label: 'Total',         value: `${terrain.totalSqm.toLocaleString()} m²` },
          { label: 'Investisseurs', value: terrain.investors                          },
          { label: 'Transactions',  value: terrain.transactions                       },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: '#F5F0E8', borderRadius: 8,
            padding: '8px', textAlign: 'center',
          }}>
            <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:'0 0 2px' }}>
              {label}
            </p>
            <p style={{ fontSize:'0.85rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// CARD D'ACHAT
// ═══════════════════════════════════════════════════════════════════
function BuyCard({ terrain }) {
  const navigate  = useNavigate()
  const [sqm,      setSqm]      = useState(5)
  const [reserved, setReserved] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600)

  const COMMISSION = 0.03
  const subtotal   = sqm * terrain.pricePerSqm
  const commission = Math.round(subtotal * COMMISSION)
  const total      = subtotal + commission

  // ✅ Timer countdown
  useEffect(() => {
    if (!reserved) return
    if (timeLeft <= 0) {
      setReserved(false)
      setTimeLeft(600)
      return
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    // ✅ cleanup correct
    return () => clearTimeout(t)
  }, [reserved, timeLeft])

  const formatTime = (s) => {
    const m   = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const isUrgent = timeLeft < 120

  const handleBuy = () => {
    if (!reserved) { setReserved(true); return }
    navigate('/paiement')
  }

  return (
    <div style={{
      position: 'sticky', top: 88,
      background: '#FFFFFF', borderRadius: 20,
      boxShadow: '0 8px 40px rgba(30,58,47,0.12)',
      border: '1px solid rgba(184,151,42,0.12)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
        padding: '18px 20px',
      }}>
        <p style={{
          fontSize: '0.7rem', color: 'rgba(245,240,232,0.6)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          margin: '0 0 4px',
        }}>
          Investir dans ce terrain
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem', fontWeight: 700, color: '#D4AD3A',
          }}>
            {terrain.pricePerSqm.toLocaleString('fr-FR')}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'rgba(245,240,232,0.6)' }}>
            FCFA / m²
          </span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Sélecteur m² */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 10,
          }}>
            <label style={{
              fontSize: '0.82rem', fontWeight: 600, color: '#4A3F35',
            }}>
              Nombre de m²
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setSqm(s => Math.max(1, s - 1))} style={{
                width: 28, height: 28, borderRadius: 7,
                border: '1.5px solid rgba(30,58,47,0.2)',
                background: 'transparent', cursor: 'pointer',
                fontSize: '1.1rem', color: '#1E3A2F', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                −
              </button>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.4rem', fontWeight: 700,
                color: '#1E3A2F', minWidth: 36, textAlign: 'center',
              }}>
                {sqm}
              </span>
              <button
                onClick={() => setSqm(s => Math.min(terrain.availableSqm, s + 1))}
                style={{
                  width: 28, height: 28, borderRadius: 7,
                  border: '1.5px solid rgba(30,58,47,0.2)',
                  background: 'transparent', cursor: 'pointer',
                  fontSize: '1.1rem', color: '#1E3A2F', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                +
              </button>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={terrain.availableSqm}
            value={sqm}
            onChange={e => setSqm(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#1E3A2F', cursor: 'pointer' }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.65rem', color: '#8C8278', marginTop: 4,
          }}>
            <span>Min : 1 m²</span>
            <span>Max : {terrain.availableSqm} m²</span>
          </div>
        </div>

        {/* Récap prix */}
        <div style={{
          background: '#F5F0E8', borderRadius: 12,
          padding: '14px', marginBottom: 16,
        }}>
          {[
            { label: 'Prix unitaire',   value: `${terrain.pricePerSqm.toLocaleString('fr-FR')} F` },
            { label: `× ${sqm} m²`,     value: `${subtotal.toLocaleString('fr-FR')} F`            },
            { label: 'Commission (3%)', value: `${commission.toLocaleString('fr-FR')} F`           },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '0.8rem', padding: '3px 0', color: '#6B6459',
            }}>
              <span>{label}</span>
              <span style={{ fontFamily: 'monospace' }}>{value}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(30,58,47,0.1)', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A' }}>
              TOTAL TTC
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem', fontWeight: 700, color: '#1E3A2F',
            }}>
              {total.toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>

        {/* Timer */}
        {reserved && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, marginBottom: 14,
            background: isUrgent ? 'rgba(192,57,43,0.08)' : 'rgba(184,151,42,0.08)',
            border: `1px solid ${isUrgent ? 'rgba(192,57,43,0.25)' : 'rgba(184,151,42,0.2)'}`,
          }}>
            <span>{isUrgent ? '🔴' : '⏱️'}</span>
            <div>
              <p style={{
                fontSize: '0.7rem', margin: '0 0 1px', fontWeight: 600,
                color: isUrgent ? '#C0392B' : '#8B6E1A',
              }}>
                {isUrgent ? 'Dépêchez-vous !' : 'Réservation active'}
              </p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#6B6459' }}>
                Expire dans{' '}
                <strong style={{
                  fontFamily: 'monospace', fontSize: '0.9rem',
                  color: isUrgent ? '#C0392B' : '#1E3A2F',
                }}>
                  {formatTime(timeLeft)}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* Bouton principal */}
        <button onClick={handleBuy} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: reserved
            ? 'linear-gradient(135deg, #B8972A, #D4AD3A)'
            : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
          color: '#F5F0E8', fontSize: '0.95rem', fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.2s',
          boxShadow: '0 4px 16px rgba(30,58,47,0.28)',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {reserved
            ? `💳 Payer ${total.toLocaleString('fr-FR')} F`
            : `🔒 Réserver ces ${sqm} m²`
          }
        </button>

        {reserved && (
          <button
            onClick={() => { setReserved(false); setTimeLeft(600) }}
            style={{
              width: '100%', marginTop: 8, padding: '9px',
              background: 'transparent', border: 'none',
              fontSize: '0.78rem', color: '#8C8278',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
            Annuler la réservation
          </button>
        )}

        {/* Badges sécurité */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 14,
          marginTop: 14, paddingTop: 14,
          borderTop: '1px solid rgba(30,58,47,0.08)',
        }}>
          {[
            { icon: '🔒', label: 'SSL'      },
            { icon: '📱', label: 'MTN MoMo' },
            { icon: '💳', label: 'Visa'     },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: '0.7rem', color: '#8C8278',
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
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function TerrainDetail() {
  useFonts()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    // ✅ cleanup correct
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F0E8',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Navbar />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '88px 5vw 60px',
      }}>
        {/* En-tête */}
        <div style={{
          marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s ease',
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {[
              { text: '🟢 Disponible',     bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F'  },
              { text: '🏅 Notaire certifié',bg: 'rgba(184,151,42,0.1)', color: '#8B6E1A'  },
              { text: `📍 ${TERRAIN.location}`, bg: 'rgba(30,58,47,0.05)', color: '#6B6459' },
            ].map(({ text, bg, color }) => (
              <span key={text} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem',
                fontWeight: 600, background: bg, color,
              }}>
                {text}
              </span>
            ))}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700, color: '#1A1A1A',
            letterSpacing: '-0.02em', margin: '0 0 4px',
          }}>
            {TERRAIN.name}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#6B6459', margin: 0 }}>
            {TERRAIN.subtitle}
          </p>
        </div>

        {/* Layout 2 colonnes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: 24, alignItems: 'start',
        }}>
          {/* Colonne gauche */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.6s ease 0.1s',
          }}>
            <PhotoGallery photos={TERRAIN.photos} />
            <TerrainProgress terrain={TERRAIN} />
            <div style={{
              background: '#FFFFFF', borderRadius: 16,
              padding: '24px',
              boxShadow: '0 2px 12px rgba(30,58,47,0.06)',
              border: '1px solid rgba(30,58,47,0.06)',
            }}>
              <ContentTabs terrain={TERRAIN} />
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(20px)',
            transition: 'all 0.6s ease 0.2s',
          }}>
            <BuyCard terrain={TERRAIN} />
            <div style={{
              marginTop: 12, background: 'rgba(30,58,47,0.04)',
              border: '1px solid rgba(30,58,47,0.08)',
              borderRadius: 12, padding: '12px 14px',
              display: 'flex', gap: 8,
            }}>
              <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>⚠️</span>
              <p style={{
                fontSize: '0.72rem', color: '#8C8278',
                margin: 0, lineHeight: 1.6,
              }}>
                Investissement à long terme. La revente de parts
                n'est pas garantie à court terme.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type=range] {
          -webkit-appearance: none;
          height: 6px;
          background: linear-gradient(90deg, #1E3A2F, #3D6B53);
          border-radius: 3px; outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #1E3A2F; cursor: pointer;
          border: 3px solid #F5F0E8;
          box-shadow: 0 2px 8px rgba(30,58,47,0.3);
          transition: transform 0.15s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .leaflet-container {
          font-family: 'DM Sans', sans-serif !important;
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}