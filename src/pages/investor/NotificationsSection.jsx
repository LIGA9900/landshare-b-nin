// ═══════════════════════════════════════════════════════════════════
// NotificationsSection.jsx — Section "Notifications" · Dashboard Investisseur
// LandShare Bénin · Design System identique Dashboard.jsx
// Palette : #F5F0E8 · #1E3A2F · #B8972A · #111810
// Polices : Playfair Display · DM Sans · tailles réduites
// Responsive : desktop + mobile
// ═══════════════════════════════════════════════════════════════════
//
// INTÉGRATION DANS Dashboard.jsx :
// 1. Copier ce fichier dans src/pages/investor/NotificationsSection.jsx
// 2. Importer : import NotificationsSection from './NotificationsSection'
// 3. Dans MainContent(), ajouter :
//    if (active === 'notifications') return <NotificationsSection isMobile={isMobile} />
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

// ─── Config types de notifications ────────────────────────────────
const NOTIF_CFG = {
  paiement:    { icon: '✅', bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F', label: 'Paiement'     },
  attestation: { icon: '🏅', bg: 'rgba(184,151,42,0.1)',  color: '#8B6D14', label: 'Attestation'  },
  kyc:         { icon: '🪪', bg: 'rgba(61,107,83,0.1)',   color: '#3D6B53', label: 'KYC'          },
  terrain:     { icon: '🗺️', bg: 'rgba(30,58,47,0.08)',   color: '#1E3A2F', label: 'Terrain'      },
  alerte:      { icon: '⚠️', bg: 'rgba(192,57,43,0.08)', color: '#C0392B', label: 'Alerte'        },
  info:        { icon: 'ℹ️', bg: 'rgba(100,116,139,0.08)',color: '#64748B', label: 'Info'          },
  systeme:     { icon: '⚙️', bg: 'rgba(100,116,139,0.08)',color: '#64748B', label: 'Système'       },
}

// ─── Données mock ──────────────────────────────────────────────────
const INITIAL_NOTIFS = [
  {
    id: 1, type: 'paiement', read: false,
    titre:   'Paiement confirmé — LS-054',
    message: 'Votre transaction de 77 250 FCFA pour 5 m² sur Calavi Nord a été confirmée avec succès.',
    date:    'Aujourd\'hui', time: '14:32',
    action:  { label: 'Voir la transaction', href: '#' },
    terrain: 'Calavi Nord — Zone Résidentielle',
  },
  {
    id: 2, type: 'attestation', read: false,
    titre:   'Attestation disponible',
    message: 'Votre attestation ATT-2025-LS-00247 est prête. Téléchargez-la depuis la section Documents.',
    date:    'Aujourd\'hui', time: '14:33',
    action:  { label: 'Voir l\'attestation', href: '#' },
    terrain: 'Calavi Nord — Zone Résidentielle',
  },
  {
    id: 3, type: 'terrain', read: false,
    titre:   'Fidjrossè Balnéaire — Presque complet !',
    message: 'Le terrain Fidjrossè Balnéaire est financé à 91%. Il ne reste que 45 m² disponibles. Investissez avant qu\'il soit complet.',
    date:    'Hier', time: '09:15',
    action:  { label: 'Investir maintenant', href: '#' },
    terrain: 'Fidjrossè Balnéaire',
  },
  {
    id: 4, type: 'kyc', read: true,
    titre:   'KYC validé avec succès',
    message: 'Votre identité a été vérifiée et validée. Vous pouvez désormais investir librement sur LandShare Bénin.',
    date:    '20 Sep 2025', time: '11:00',
    action:  null,
    terrain: null,
  },
  {
    id: 5, type: 'paiement', read: true,
    titre:   'Paiement confirmé — LS-047',
    message: 'Votre transaction de 154 500 FCFA pour 10 m² sur Fidjrossè Balnéaire a été confirmée.',
    date:    '15 Oct 2025', time: '11:22',
    action:  { label: 'Voir la transaction', href: '#' },
    terrain: 'Fidjrossè Balnéaire',
  },
  {
    id: 6, type: 'attestation', read: true,
    titre:   'Attestation disponible — ATT-2025-LS-00189',
    message: 'Votre attestation pour Fidjrossè Balnéaire est disponible au téléchargement.',
    date:    '15 Oct 2025', time: '11:23',
    action:  { label: 'Télécharger', href: '#' },
    terrain: 'Fidjrossè Balnéaire',
  },
  {
    id: 7, type: 'alerte', read: true,
    titre:   'Tentative de paiement échouée',
    message: 'Votre paiement LS-035 de 77 250 FCFA via Paystack a échoué. Aucun débit n\'a été effectué. Vous pouvez réessayer.',
    date:    '28 Sep 2025', time: '08:06',
    action:  { label: 'Réessayer', href: '#' },
    terrain: 'Fidjrossè Balnéaire',
  },
  {
    id: 8, type: 'terrain', read: true,
    titre:   'Nouveau terrain disponible — Porto-Novo Est',
    message: 'Un nouveau terrain commercial est disponible à Porto-Novo. À partir de 8 500 FCFA/m². Rendement estimé : 7,8%.',
    date:    '20 Sep 2025', time: '10:00',
    action:  { label: 'Découvrir', href: '#' },
    terrain: 'Porto-Novo Est — Zone Commerciale',
  },
  {
    id: 9, type: 'systeme', read: true,
    titre:   'Bienvenue sur LandShare Bénin',
    message: 'Votre compte a été créé avec succès. Commencez par compléter votre vérification KYC pour pouvoir investir.',
    date:    '18 Sep 2025', time: '08:00',
    action:  { label: 'Compléter mon profil', href: '#' },
    terrain: null,
  },
]

// ─── Carte notification ────────────────────────────────────────────
function NotifCard({ notif, onRead, onDelete, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const cfg = NOTIF_CFG[notif.type] || NOTIF_CFG.info

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:  notif.read ? C.surface : 'rgba(30,58,47,0.03)',
        borderRadius: 12,
        border: `1.5px solid ${!notif.read ? 'rgba(30,58,47,0.14)' : C.border}`,
        padding: isMobile ? '12px' : '14px 16px',
        transition: 'all 0.2s',
        boxShadow: hovered
          ? '0 4px 16px rgba(30,58,47,0.08)'
          : notif.read ? 'none' : '0 2px 10px rgba(30,58,47,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Barre indicateur non-lu */}
      {!notif.read && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: 'linear-gradient(180deg, #1E3A2F, #2D5241)',
          borderRadius: '12px 0 0 12px',
        }} />
      )}

      <div style={{ display: 'flex', gap: 12, paddingLeft: !notif.read ? 6 : 0 }}>
        {/* Icône */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: cfg.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem',
        }}>
          {cfg.icon}
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Titre + badges */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', flex: 1 }}>
              <p style={{
                fontSize: '0.8rem', fontWeight: notif.read ? 500 : 700,
                color: notif.read ? C.subtle : C.text, margin: 0,
              }}>
                {notif.titre}
              </p>
              {!notif.read && (
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: C.green, flexShrink: 0,
                }} />
              )}
            </div>
            {/* Actions hover */}
            {hovered && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {!notif.read && (
                  <button onClick={() => onRead(notif.id)} title="Marquer comme lu" style={{
                    width: 26, height: 26, borderRadius: 6, border: 'none',
                    background: 'rgba(30,58,47,0.07)', color: C.green,
                    fontSize: '0.7rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✓</button>
                )}
                <button onClick={() => onDelete(notif.id)} title="Supprimer" style={{
                  width: 26, height: 26, borderRadius: 6, border: 'none',
                  background: 'rgba(192,57,43,0.07)', color: '#C0392B',
                  fontSize: '0.7rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </div>
            )}
          </div>

          {/* Message */}
          <p style={{
            fontSize: '0.72rem', color: notif.read ? C.muted : C.subtle,
            margin: '0 0 8px', lineHeight: 1.55,
          }}>
            {notif.message}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Badge type */}
              <span style={{
                padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600,
                background: cfg.bg, color: cfg.color,
              }}>{cfg.label}</span>
              {/* Terrain */}
              {notif.terrain && (
                <span style={{ fontSize: '0.62rem', color: C.muted }}>
                  📍 {notif.terrain}
                </span>
              )}
            </div>
            {/* Date + action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.62rem', color: C.muted }}>
                {notif.date} {notif.time && `· ${notif.time}`}
              </span>
              {notif.action && (
                <button style={{
                  padding: '4px 10px', borderRadius: 7, border: 'none',
                  background: notif.read ? 'rgba(30,58,47,0.07)' : C.green,
                  color: notif.read ? C.green : '#F5F0E8',
                  fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.15s',
                }}>
                  {notif.action.label} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : NotificationsSection
// ═══════════════════════════════════════════════════════════════════
export default function NotificationsSection({ isMobile }) {
  const [visible, setVisible]   = useState(false)
  const [notifs,  setNotifs]    = useState(INITIAL_NOTIFS)
  const [filter,  setFilter]    = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const nonLues = notifs.filter(n => !n.read).length

  const markRead    = id => setNotifs(p => p.map(n => n.id===id ? {...n, read:true} : n))
  const deleteNotif = id => setNotifs(p => p.filter(n => n.id!==id))
  const markAllRead = ()  => setNotifs(p => p.map(n => ({...n, read:true})))
  const deleteAll   = ()  => setNotifs([])

  // Filtrage
  const filtered = notifs.filter(n => {
    const matchRead = filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'read' && n.read)
    const matchType = typeFilter === 'all' || n.type === typeFilter
    return matchRead && matchType
  })

  // Stats
  const stats = [
    { icon: '🔔', label: 'Total',       value: notifs.length,                                       sub: 'Toutes notifications' },
    { icon: '📬', label: 'Non lues',    value: nonLues,                                              sub: nonLues > 0 ? 'À consulter' : 'Tout lu !' },
    { icon: '✅', label: 'Paiements',   value: notifs.filter(n=>n.type==='paiement').length,         sub: 'Confirmations'        },
    { icon: '⚠️', label: 'Alertes',     value: notifs.filter(n=>n.type==='alerte').length,           sub: 'À traiter'            },
  ]

  const TYPE_FILTRES = [
    { id: 'all',         label: 'Toutes'       },
    { id: 'paiement',    label: 'Paiements'    },
    { id: 'attestation', label: 'Attestations' },
    { id: 'terrain',     label: 'Terrains'     },
    { id: 'alerte',      label: 'Alertes'      },
    { id: 'kyc',         label: 'KYC'          },
    { id: 'systeme',     label: 'Système'      },
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Centre de notifications
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '1.15rem' : '1.3rem',
              fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px',
            }}>
              Notifications
              {nonLues > 0 && (
                <span style={{
                  marginLeft: 10, padding: '2px 10px', borderRadius: 20,
                  background: 'rgba(220,53,69,0.85)', color: '#fff',
                  fontSize: '0.72rem', fontWeight: 700, verticalAlign: 'middle',
                }}>{nonLues}</span>
              )}
            </h2>
            <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
              {nonLues > 0
                ? `${nonLues} notification(s) non lue(s) · ${notifs.length} au total`
                : `Tout est à jour · ${notifs.length} notifications`}
            </p>
          </div>

          {/* Actions globales */}
          {!isMobile && nonLues > 0 && (
            <button onClick={markAllRead} style={{
              padding: '8px 16px', borderRadius: 10, border: 'none',
              background: 'rgba(245,240,232,0.12)',
              color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(245,240,232,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(245,240,232,0.12)'}
            >
              ✓ Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* ── Stats rapides ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 14, marginBottom: 20,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: C.surface, borderRadius: 14,
            border: `1px solid ${C.border}`,
            padding: '14px 16px',
            boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
            opacity:   visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.4s ease ${i*0.08}s, transform 0.4s ease ${i*0.08}s`,
          }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{s.icon}</div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem', fontWeight: 700,
              color: i===1 && nonLues>0 ? '#C0392B' : C.green,
              margin: '0 0 3px',
            }}>{s.value}</p>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{s.label}</p>
            <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filtres ── */}
      <div style={{
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: '14px 16px', marginBottom: 16,
        boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
      }}>
        {/* Tabs lues/non-lues */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{
            display: 'flex', background: 'rgba(30,58,47,0.05)',
            borderRadius: 10, padding: 3, gap: 2,
          }}>
            {[
              { id: 'all',    label: `Toutes (${notifs.length})`    },
              { id: 'unread', label: `Non lues (${nonLues})`         },
              { id: 'read',   label: 'Lues'                          },
            ].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: filter===tab.id ? C.green : 'transparent',
                color: filter===tab.id ? '#F5F0E8' : C.muted,
                fontSize: '0.7rem', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            {isMobile && nonLues > 0 && (
              <button onClick={markAllRead} style={{
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: 'rgba(30,58,47,0.07)', color: C.green,
                fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>✓ Tout lire</button>
            )}
            {notifs.length > 0 && (
              <button onClick={deleteAll} style={{
                padding: '6px 12px', borderRadius: 8, border: 'none',
                background: 'rgba(192,57,43,0.07)', color: '#C0392B',
                fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>🗑 Tout effacer</button>
            )}
          </div>
        </div>

        {/* Filtres par type */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TYPE_FILTRES.map(f => (
            <button key={f.id} onClick={() => setTypeFilter(f.id)} style={{
              padding: '4px 11px', borderRadius: 20,
              border: `1px solid ${typeFilter===f.id ? C.green : 'rgba(30,58,47,0.15)'}`,
              background: typeFilter===f.id ? C.green : 'transparent',
              color: typeFilter===f.id ? '#F5F0E8' : C.subtle,
              fontSize: '0.65rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* ── Liste notifications ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: '60px 20px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 14 }}>
            {filter === 'unread' ? '🎉' : '🔔'}
          </span>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 6px',
          }}>
            {filter === 'unread' ? 'Tout est à jour !' : 'Aucune notification'}
          </p>
          <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>
            {filter === 'unread'
              ? 'Vous avez lu toutes vos notifications.'
              : 'Aucune notification ne correspond à ce filtre.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(notif => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onRead={markRead}
              onDelete={deleteNotif}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}

      {/* ── Note bas de page ── */}
      <div style={{
        marginTop: 20, padding: '10px 14px',
        background: 'rgba(30,58,47,0.04)',
        border: '1px solid rgba(30,58,47,0.08)',
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: '0.78rem', flexShrink: 0 }}>🔔</span>
        <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
          Les notifications de paiement et d'attestation sont envoyées automatiquement.
          Vous pouvez gérer vos préférences de notification dans les paramètres.
        </p>
      </div>
    </div>
  )
}
