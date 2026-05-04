// ═══════════════════════════════════════════════════════════════════
// AdminUsers.jsx — Gestion des Utilisateurs
// ═══════════════════════════════════════════════════════════════════
import { useState } from 'react'
import AdminLayout, { Icon } from './AdminLayout'

// ─── Données simulées ──────────────────────────────────────────────
const USERS = [
  { id: 1,  ref: 'USR-241', name: 'Aisha Koné',       email: 'aisha.kone@email.com',    country: '🇫🇷 France',   sqm: 15,  invested: 225000, kyc: 'validated', status: 'active',    joined: '12 Oct 2025' },
  { id: 2,  ref: 'USR-240', name: 'Malick Fassinou',  email: 'malick.f@gmail.com',      country: '🇧🇯 Bénin',    sqm: 8,   invested: 120000, kyc: 'validated', status: 'active',    joined: '10 Oct 2025' },
  { id: 3,  ref: 'USR-239', name: 'Mariama Diallo',   email: 'mariama.d@yahoo.fr',      country: '🇧🇪 Belgique', sqm: 0,   invested: 0,      kyc: 'pending',   status: 'active',    joined: '08 Oct 2025' },
  { id: 4,  ref: 'USR-238', name: 'Ibrahim Touré',    email: 'ibrahim.toure@pro.com',   country: '🇨🇦 Canada',   sqm: 22,  invested: 385000, kyc: 'validated', status: 'active',    joined: '05 Oct 2025' },
  { id: 5,  ref: 'USR-237', name: 'Sylvie Dossou',    email: 'sylvie.d@hotmail.com',    country: '🇧🇯 Bénin',    sqm: 5,   invested: 75000,  kyc: 'validated', status: 'suspended', joined: '02 Oct 2025' },
  { id: 6,  ref: 'USR-236', name: 'Jean-Paul Koffi',  email: 'jpkoffi@email.com',       country: '🇩🇪 Allemagne',sqm: 30,  invested: 510000, kyc: 'validated', status: 'active',    joined: '28 Sep 2025' },
  { id: 7,  ref: 'USR-235', name: 'Amina Soumaré',    email: 'amina.s@outlook.com',     country: '🇫🇷 France',   sqm: 0,   invested: 0,      kyc: 'rejected',  status: 'active',    joined: '25 Sep 2025' },
  { id: 8,  ref: 'USR-234', name: 'Romaric Houénou',  email: 'romaric.h@gmail.com',     country: '🇧🇯 Bénin',    sqm: 12,  invested: 180000, kyc: 'validated', status: 'active',    joined: '20 Sep 2025' },
]

const KYC_STYLE = {
  validated: { bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F', label: '✓ Validé'    },
  pending:   { bg: 'rgba(184,151,42,0.1)',   color: '#8B6E1A', label: '⏳ En attente' },
  rejected:  { bg: 'rgba(192,57,43,0.08)',   color: '#C0392B', label: '✗ Rejeté'    },
  none:      { bg: 'rgba(100,116,139,0.08)', color: '#64748B', label: '— Aucun'     },
}

const STATUS_STYLE = {
  active:    { bg: 'rgba(30,58,47,0.08)',  color: '#1E3A2F', label: 'Actif'     },
  suspended: { bg: 'rgba(192,57,43,0.08)', color: '#C0392B', label: 'Suspendu'  },
}

export default function AdminUsers() {
  const [search,     setSearch]     = useState('')
  const [filterKyc,  setFilterKyc]  = useState('all')
  const [filterStat, setFilterStat] = useState('all')
  const [selected,   setSelected]   = useState(null)
  const [users,      setUsers]       = useState(USERS)

  // Filtrage
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase()) ||
                        u.ref.toLowerCase().includes(search.toLowerCase())
    const matchKyc    = filterKyc  === 'all' || u.kyc    === filterKyc
    const matchStat   = filterStat === 'all' || u.status === filterStat
    return matchSearch && matchKyc && matchStat
  })

  const toggleSuspend = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
        : u
    ))
  }

  return (
    <AdminLayout
      title="Gestion des Utilisateurs"
      subtitle={`${users.length} comptes enregistrés`}
      actions={
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 8,
          background: '#1E3A2F', color: '#F5F0E8',
          border: 'none', fontSize: '0.75rem', fontWeight: 600,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        }}>
          <Icon name="download" size={14} />
          Exporter CSV
        </button>
      }
    >
      {/* ── KPI rapides ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: 'Total',       value: users.length,                              color: '#1E3A2F', bg: 'rgba(30,58,47,0.07)'    },
          { label: 'KYC validés', value: users.filter(u=>u.kyc==='validated').length, color: '#1E3A2F', bg: 'rgba(30,58,47,0.07)' },
          { label: 'En attente',  value: users.filter(u=>u.kyc==='pending').length,  color: '#8B6E1A', bg: 'rgba(184,151,42,0.08)' },
          { label: 'Suspendus',   value: users.filter(u=>u.status==='suspended').length, color: '#C0392B', bg: 'rgba(192,57,43,0.07)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            boxShadow: '0 1px 6px rgba(30,58,47,0.05)',
            border: '1px solid rgba(30,58,47,0.05)',
            borderTop: `3px solid ${color}`,
          }}>
            <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: '0 0 4px',
                         textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif",
                         fontSize: '1.4rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filtres ── */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 16,
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Recherche */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#fff', border: '1px solid rgba(30,58,47,0.12)',
          borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200,
        }}>
          <Icon name="search" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            style={{
              border: 'none', background: 'transparent',
              fontSize: '0.78rem', color: '#4A3F35', outline: 'none',
              width: '100%', fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Filtre KYC */}
        <select
          value={filterKyc}
          onChange={e => setFilterKyc(e.target.value)}
          style={{
            padding: '7px 12px', borderRadius: 8,
            border: '1px solid rgba(30,58,47,0.12)',
            background: '#fff', fontSize: '0.75rem',
            color: '#4A3F35', cursor: 'pointer', outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value="all">Tous les KYC</option>
          <option value="validated">KYC Validé</option>
          <option value="pending">KYC En attente</option>
          <option value="rejected">KYC Rejeté</option>
        </select>

        {/* Filtre statut */}
        <select
          value={filterStat}
          onChange={e => setFilterStat(e.target.value)}
          style={{
            padding: '7px 12px', borderRadius: 8,
            border: '1px solid rgba(30,58,47,0.12)',
            background: '#fff', fontSize: '0.75rem',
            color: '#4A3F35', cursor: 'pointer', outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="suspended">Suspendu</option>
        </select>
      </div>

      {/* ── Tableau ── */}
      <div style={{
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
        border: '1px solid rgba(30,58,47,0.06)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF7' }}>
                {['Réf.','Utilisateur','Pays','m² détenus','Investi','KYC','Statut','Inscrit','Actions'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: '0.62rem', fontWeight: 700, color: '#8C8278',
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
              {filtered.map((user, i) => {
                const kyc  = KYC_STYLE[user.kyc]  || KYC_STYLE.none
                const stat = STATUS_STYLE[user.status]
                return (
                  <tr key={user.id}
                      style={{ transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,232,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                    {/* Réf */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.72rem',
                                      color: '#1E3A2F', fontWeight: 600 }}>
                        {user.ref}
                      </span>
                    </td>

                    {/* Utilisateur */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: `hsl(${(user.id * 47) % 360}, 40%, 35%)`,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '0.6rem',
                          fontWeight: 700, color: '#F5F0E8', flexShrink: 0,
                        }}>
                          {user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.78rem', fontWeight: 600,
                                       color: '#1A1A1A', margin: '0 0 1px' }}>
                            {user.name}
                          </p>
                          <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pays */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)',
                                  fontSize: '0.75rem', color: '#4A3F35' }}>
                      {user.country}
                    </td>

                    {/* m² */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A1A1A' }}>
                        {user.sqm} m²
                      </span>
                    </td>

                    {/* Investi */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily: "'Playfair Display', serif",
                                      fontSize: '0.8rem', fontWeight: 700, color: '#1E3A2F' }}>
                        {user.invested.toLocaleString('fr-FR')} F
                      </span>
                    </td>

                    {/* KYC */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: 20,
                        background: kyc.bg, color: kyc.color,
                        fontSize: '0.65rem', fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}>
                        {kyc.label}
                      </span>
                    </td>

                    {/* Statut */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{
                        padding: '3px 9px', borderRadius: 20,
                        background: stat.bg, color: stat.color,
                        fontSize: '0.65rem', fontWeight: 600,
                      }}>
                        {stat.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)',
                                  fontSize: '0.7rem', color: '#8C8278' }}>
                      {user.joined}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button
                          title="Voir le profil"
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: 'rgba(30,58,47,0.07)',
                            border: '1px solid rgba(30,58,47,0.1)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer',
                            color: '#1E3A2F', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(30,58,47,0.14)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(30,58,47,0.07)'}
                        >
                          <Icon name="eye" size={13} />
                        </button>
                        <button
                          title={user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                          onClick={() => toggleSuspend(user.id)}
                          style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: user.status === 'active'
                              ? 'rgba(192,57,43,0.08)'
                              : 'rgba(30,58,47,0.08)',
                            border: '1px solid rgba(30,58,47,0.1)',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer',
                            color: user.status === 'active' ? '#C0392B' : '#1E3A2F',
                            transition: 'all 0.15s',
                          }}
                        >
                          <Icon name={user.status === 'active' ? 'x' : 'check'} size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer tableau */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(30,58,47,0.06)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.68rem', color: '#8C8278', margin: 0 }}>
            {filtered.length} utilisateur(s) affiché(s) sur {users.length}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {['←','1','2','3','→'].map(p => (
              <button key={p} style={{
                width: 28, height: 28, borderRadius: 6,
                border: '1px solid rgba(30,58,47,0.12)',
                background: p === '1' ? '#1E3A2F' : '#fff',
                color: p === '1' ? '#F5F0E8' : '#4A3F35',
                fontSize: '0.7rem', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}