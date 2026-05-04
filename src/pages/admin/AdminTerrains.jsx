// ═══════════════════════════════════════════════════════════════════
// AdminTerrains.jsx — Gestion des Terrains
// ═══════════════════════════════════════════════════════════════════
import { useState } from 'react'
import AdminLayout, { Icon } from './AdminLayout'

const TERRAINS = [
  { id:1, ref:'TRN-001', name:'Calavi Nord — Lot 12',    city:'Abomey-Calavi', totalSqm:1000, soldSqm:680,  price:15000, status:'published', investors:47, revenue:10200000, created:'01 Sep 2025' },
  { id:2, ref:'TRN-002', name:'Fidjrossè Balnéaire',     city:'Cotonou',       totalSqm:500,  soldSqm:455,  price:35000, status:'published', investors:32, revenue:15925000, created:'15 Sep 2025' },
  { id:3, ref:'TRN-003', name:'Porto-Novo Est — Zone Com.',city:'Porto-Novo',  totalSqm:1500, soldSqm:420,  price:8500,  status:'published', investors:28, revenue:3570000,  created:'20 Sep 2025' },
  { id:4, ref:'TRN-004', name:'Parakou Nord — Lot B',    city:'Parakou',       totalSqm:800,  soldSqm:0,    price:12000, status:'draft',     investors:0,  revenue:0,         created:'25 Oct 2025' },
  { id:5, ref:'TRN-005', name:'Ouidah Historique',       city:'Ouidah',        totalSqm:600,  soldSqm:600,  price:20000, status:'full',      investors:55, revenue:12000000, created:'01 Août 2025' },
]

const STATUS_CONFIG = {
  published: { bg:'rgba(30,58,47,0.08)',  color:'#1E3A2F', label:'🟢 Publié'   },
  draft:     { bg:'rgba(184,151,42,0.1)', color:'#8B6E1A', label:'📝 Brouillon' },
  full:      { bg:'rgba(30,58,47,0.15)', color:'#1E3A2F',  label:'✅ Complet'  },
  archived:  { bg:'rgba(100,116,139,0.08)',color:'#64748B', label:'📦 Archivé'  },
}

export default function AdminTerrains() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [terrains, setTerrains] = useState(TERRAINS)
  const [showForm, setShowForm] = useState(false)

  const filtered = terrains.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.city.toLowerCase().includes(search.toLowerCase()) ||
                        t.ref.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  return (
    <AdminLayout
      title="Gestion des Terrains"
      subtitle={`${terrains.length} terrains enregistrés`}
      actions={
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: '#1E3A2F', color: '#F5F0E8',
            border: 'none', fontSize: '0.75rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Icon name="plus" size={14} />
          Nouveau terrain
        </button>
      }
    >
      {/* ── KPIs ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: 'Total terrains',  value: terrains.length,                                 color: '#1E3A2F' },
          { label: 'Publiés',         value: terrains.filter(t=>t.status==='published').length, color: '#1E3A2F' },
          { label: 'm² total gérés',  value: `${terrains.reduce((s,t)=>s+t.totalSqm,0).toLocaleString()}`, color: '#B8972A' },
          { label: 'Revenus générés', value: `${(terrains.reduce((s,t)=>s+t.revenue,0)/1000000).toFixed(1)}M F`, color: '#1E3A2F' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            boxShadow: '0 1px 6px rgba(30,58,47,0.05)',
            border: '1px solid rgba(30,58,47,0.05)',
            borderTop: `3px solid ${color}`,
          }}>
            <p style={{ fontSize: '0.62rem', color: '#8C8278', margin: '0 0 4px',
                         textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif",
                         fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filtres ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#fff', border: '1px solid rgba(30,58,47,0.12)',
          borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200,
        }}>
          <Icon name="search" size={14} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un terrain..."
            style={{
              border:'none', background:'transparent', fontSize:'0.78rem',
              color:'#4A3F35', outline:'none', width:'100%',
              fontFamily:"'DM Sans', sans-serif",
            }}
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
                style={{
                  padding:'7px 12px', borderRadius:8,
                  border:'1px solid rgba(30,58,47,0.12)',
                  background:'#fff', fontSize:'0.75rem',
                  color:'#4A3F35', cursor:'pointer', outline:'none',
                  fontFamily:"'DM Sans', sans-serif",
                }}>
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
          <option value="full">Complets</option>
          <option value="archived">Archivés</option>
        </select>
      </div>

      {/* ── Grille terrains ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 14 }}>
        {filtered.map(terrain => {
          const progress = Math.round((terrain.soldSqm / terrain.totalSqm) * 100)
          const cfg = STATUS_CONFIG[terrain.status] || STATUS_CONFIG.draft

          return (
            <div key={terrain.id} style={{
              background: '#fff', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(30,58,47,0.06)',
              border: '1px solid rgba(30,58,47,0.06)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow='0 6px 24px rgba(30,58,47,0.12)'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 10px rgba(30,58,47,0.06)'; e.currentTarget.style.transform='translateY(0)' }}>

              {/* Image placeholder */}
              <div style={{
                height: 100,
                background: 'linear-gradient(135deg, #1E3A2F, #2D5241, #B8972A)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ opacity: 0.15, position: 'absolute', inset: 0,
                  backgroundImage: `linear-gradient(rgba(245,240,232,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(245,240,232,.4) 1px,transparent 1px)`,
                  backgroundSize: '20px 20px' }} />
                <span style={{ fontSize: '2rem', opacity: 0.4 }}>🏡</span>
                <span style={{
                  position:'absolute', top:8, right:8,
                  padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600,
                  background: cfg.bg, color: cfg.color,
                  backdropFilter:'blur(4px)',
                }}>
                  {cfg.label}
                </span>
              </div>

              <div style={{ padding: '14px' }}>
                {/* Réf + Ville */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontFamily:'monospace', fontSize:'0.65rem', color:'#8C8278', fontWeight:600 }}>
                    {terrain.ref}
                  </span>
                  <span style={{ fontSize:'0.65rem', color:'#8C8278' }}>
                    📍 {terrain.city}
                  </span>
                </div>

                <h3 style={{
                  fontFamily:"'Playfair Display', serif",
                  fontSize:'0.88rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 10px',
                }}>
                  {terrain.name}
                </h3>

                {/* Stats mini */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:10 }}>
                  {[
                    { label:'m² total', value:`${terrain.totalSqm.toLocaleString()}` },
                    { label:'Prix/m²',  value:`${terrain.price.toLocaleString()} F`   },
                    { label:'Investisseurs', value:terrain.investors                  },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background:'#F5F0E8', borderRadius:7, padding:'6px 8px', textAlign:'center',
                    }}>
                      <p style={{ fontSize:'0.58rem', color:'#8C8278', margin:'0 0 1px' }}>{label}</p>
                      <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between',
                                 fontSize:'0.65rem', color:'#8C8278', marginBottom:4 }}>
                    <span>{terrain.soldSqm.toLocaleString()} m² vendus</span>
                    <span style={{ fontWeight:600, color:'#1E3A2F' }}>{progress}%</span>
                  </div>
                  <div style={{ height:5, background:'#EDE6D6', borderRadius:3, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:3, width:`${progress}%`,
                      background: progress >= 100
                        ? 'linear-gradient(90deg, #B8972A, #D4AD3A)'
                        : 'linear-gradient(90deg, #1E3A2F, #3D6B53)',
                      transition:'width 1s ease',
                    }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:6 }}>
                  <button style={{
                    flex:1, padding:'7px', borderRadius:8, border:'none',
                    background:'rgba(30,58,47,0.07)', color:'#1E3A2F',
                    fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                    fontFamily:"'DM Sans', sans-serif",
                  }}>
                    <Icon name="eye" size={13} /> Voir
                  </button>
                  <button style={{
                    flex:1, padding:'7px', borderRadius:8, border:'none',
                    background:'rgba(30,58,47,0.07)', color:'#1E3A2F',
                    fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                    fontFamily:"'DM Sans', sans-serif",
                  }}>
                    <Icon name="edit" size={13} /> Éditer
                  </button>
                  {terrain.status === 'draft' && (
                    <button style={{
                      flex:1, padding:'7px', borderRadius:8, border:'none',
                      background:'#1E3A2F', color:'#F5F0E8',
                      fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                      fontFamily:"'DM Sans', sans-serif",
                    }}>
                      ✓ Publier
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal nouveau terrain (simplifié) */}
      {showForm && (
        <div style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding: '20px',
        }}
        onClick={() => setShowForm(false)}>
          <div style={{
            background:'#fff', borderRadius:16, padding:'24px', width:'100%', maxWidth:480,
            boxShadow:'0 24px 60px rgba(0,0,0,0.2)',
          }}
          onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>
                Nouveau terrain
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background:'none', border:'none', cursor:'pointer', color:'#8C8278', padding:4,
              }}>
                <Icon name="x" size={18} />
              </button>
            </div>

            {[
              { label:'Nom du terrain *',   placeholder:'Ex: Calavi Nord — Lot 15', type:'text'   },
              { label:'Ville *',             placeholder:'Ex: Abomey-Calavi',         type:'text'   },
              { label:'Superficie totale (m²)*', placeholder:'Ex: 1000',             type:'number' },
              { label:'Prix par m² (FCFA)*', placeholder:'Ex: 15000',               type:'number' },
            ].map(({ label, placeholder, type }) => (
              <div key={label} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600,
                                  color:'#4A3F35', marginBottom:4 }}>
                  {label}
                </label>
                <input type={type} placeholder={placeholder} style={{
                  width:'100%', padding:'9px 12px', borderRadius:9,
                  border:'1.5px solid rgba(30,58,47,0.15)',
                  fontSize:'0.82rem', color:'#1A1A1A', outline:'none',
                  fontFamily:"'DM Sans', sans-serif",
                  background:'rgba(245,240,232,0.4)',
                }} />
              </div>
            ))}

            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              <button onClick={() => setShowForm(false)} style={{
                flex:1, padding:'10px', borderRadius:9,
                border:'1.5px solid rgba(30,58,47,0.2)', background:'transparent',
                color:'#1E3A2F', fontSize:'0.8rem', fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans', sans-serif",
              }}>
                Annuler
              </button>
              <button style={{
                flex:1, padding:'10px', borderRadius:9, border:'none',
                background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
                color:'#F5F0E8', fontSize:'0.8rem', fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans', sans-serif",
              }}>
                Créer le terrain
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}