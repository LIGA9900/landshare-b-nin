// ═══════════════════════════════════════════════════════════════════
// AdminKYC.jsx — Gestion des dossiers KYC
// ═══════════════════════════════════════════════════════════════════
import { useState } from 'react'
import AdminLayout, { Icon } from './AdminLayout'

const KYC_DOSSIERS = [
  { id:1,  ref:'KYC-091', name:'Mariama Diallo',   email:'mariama.d@yahoo.fr',      country:'🇧🇪 Belgique', type:'Passeport',     submitted:'Il y a 2h',   status:'pending'  },
  { id:2,  ref:'KYC-090', name:'Ibrahim Touré',    email:'ibrahim.toure@pro.com',    country:'🇨🇦 Canada',   type:'CNI',           submitted:'Il y a 5h',   status:'pending'  },
  { id:3,  ref:'KYC-089', name:'Fatou Sow',        email:'fatou.sow@gmail.com',      country:'🇫🇷 France',   type:'Titre de séjour', submitted:'Il y a 1j', status:'pending'  },
  { id:4,  ref:'KYC-088', name:'Koffi Mensah',     email:'koffi.m@email.com',        country:'🇩🇪 Allemagne',type:'Passeport',     submitted:'Il y a 1j',   status:'pending'  },
  { id:5,  ref:'KYC-087', name:'Aminata Kouyaté',  email:'aminata.k@outlook.com',    country:'🇫🇷 France',   type:'Passeport',     submitted:'Il y a 1j',   status:'pending'  },
  { id:6,  ref:'KYC-086', name:'Aisha Koné',       email:'aisha.kone@email.com',     country:'🇫🇷 France',   type:'CNI',           submitted:'Il y a 3j',   status:'validated'},
  { id:7,  ref:'KYC-085', name:'Jean-Paul Koffi',  email:'jpkoffi@email.com',        country:'🇩🇪 Allemagne',type:'Passeport',     submitted:'Il y a 4j',   status:'validated'},
  { id:8,  ref:'KYC-084', name:'Amina Soumaré',    email:'amina.s@outlook.com',      country:'🇫🇷 France',   type:'CNI',           submitted:'Il y a 5j',   status:'rejected' },
]

export default function AdminKYC() {
  const [filter, setFilter]   = useState('pending')
  const [dossiers, setDossiers] = useState(KYC_DOSSIERS)
  const [selected, setSelected] = useState(null)
  const [rejectNote, setRejectNote] = useState('')

  const filtered = filter === 'all'
    ? dossiers
    : dossiers.filter(d => d.status === filter)

  const handleValidate = (id) => {
    setDossiers(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'validated' } : d
    ))
    if (selected?.id === id) setSelected({ ...selected, status: 'validated' })
  }

  const handleReject = (id) => {
    setDossiers(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'rejected' } : d
    ))
    if (selected?.id === id) setSelected({ ...selected, status: 'rejected' })
    setRejectNote('')
  }

  const pending   = dossiers.filter(d=>d.status==='pending').length
  const validated = dossiers.filter(d=>d.status==='validated').length
  const rejected  = dossiers.filter(d=>d.status==='rejected').length

  return (
    <AdminLayout
      title="Gestion KYC"
      subtitle={`${pending} dossier(s) en attente de validation`}
    >
      {/* KPIs */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20,
      }}>
        {[
          { label:'En attente',value:pending,   color:'#8B6E1A', bg:'rgba(184,151,42,0.08)' },
          { label:'Validés',   value:validated, color:'#1E3A2F', bg:'rgba(30,58,47,0.07)'   },
          { label:'Rejetés',   value:rejected,  color:'#C0392B', bg:'rgba(192,57,43,0.07)'  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{
            background:'#fff', borderRadius:12, padding:'14px 16px',
            boxShadow:'0 1px 6px rgba(30,58,47,0.05)',
            border:'1px solid rgba(30,58,47,0.05)',
            borderTop:`3px solid ${color}`,
          }}>
            <p style={{ fontSize:'0.62rem', color:'#8C8278', margin:'0 0 4px',
                         textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {label}
            </p>
            <p style={{ fontFamily:"'Playfair Display', serif",
                         fontSize:'1.4rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Layout : liste + détail */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, alignItems:'start' }}>

        {/* Liste dossiers */}
        <div>
          {/* Filtre tabs */}
          <div style={{
            display:'flex', background:'#fff', borderRadius:10, padding:4,
            gap:3, marginBottom:14, width:'fit-content',
            border:'1px solid rgba(30,58,47,0.08)',
          }}>
            {[
              { id:'pending',   label:`En attente (${pending})`   },
              { id:'validated', label:`Validés (${validated})`    },
              { id:'rejected',  label:`Rejetés (${rejected})`     },
              { id:'all',       label:'Tous'                       },
            ].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer',
                background: filter===tab.id ? '#1E3A2F' : 'transparent',
                color: filter===tab.id ? '#F5F0E8' : '#8C8278',
                fontSize:'0.72rem', fontWeight:600,
                fontFamily:"'DM Sans', sans-serif", transition:'all 0.2s',
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards dossiers */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(d => (
              <div key={d.id}
                   onClick={() => setSelected(d)}
                   style={{
                     background: selected?.id===d.id ? 'rgba(30,58,47,0.04)' : '#fff',
                     borderRadius:12, padding:'14px 16px',
                     border: `1.5px solid ${selected?.id===d.id ? '#1E3A2F' : 'rgba(30,58,47,0.07)'}`,
                     cursor:'pointer', transition:'all 0.18s',
                     display:'flex', alignItems:'center', gap:12,
                   }}
                   onMouseEnter={e => { if(selected?.id!==d.id) { e.currentTarget.style.borderColor='rgba(30,58,47,0.2)'; e.currentTarget.style.background='rgba(245,240,232,0.4)' }}}
                   onMouseLeave={e => { if(selected?.id!==d.id) { e.currentTarget.style.borderColor='rgba(30,58,47,0.07)'; e.currentTarget.style.background='#fff' }}}>

                {/* Avatar */}
                <div style={{
                  width:38, height:38, borderRadius:'50%',
                  background:`hsl(${(d.id*67)%360},40%,35%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.65rem', fontWeight:700, color:'#F5F0E8', flexShrink:0,
                }}>
                  {d.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>

                {/* Infos */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                    <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#1A1A1A', margin:0 }}>
                      {d.name}
                    </p>
                    <span style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#8C8278' }}>
                      {d.ref}
                    </span>
                  </div>
                  <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>
                    {d.country} · {d.type} · {d.submitted}
                  </p>
                </div>

                {/* Statut */}
                <div>
                  {d.status === 'pending' && (
                    <span style={{
                      padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600,
                      background:'rgba(184,151,42,0.1)', color:'#8B6E1A',
                    }}>
                      ⏳ Attente
                    </span>
                  )}
                  {d.status === 'validated' && (
                    <span style={{
                      padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600,
                      background:'rgba(30,58,47,0.08)', color:'#1E3A2F',
                    }}>
                      ✓ Validé
                    </span>
                  )}
                  {d.status === 'rejected' && (
                    <span style={{
                      padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600,
                      background:'rgba(192,57,43,0.08)', color:'#C0392B',
                    }}>
                      ✗ Rejeté
                    </span>
                  )}
                </div>

                {/* Actions rapides (pending seulement) */}
                {d.status === 'pending' && (
                  <div style={{ display:'flex', gap:5 }} onClick={e=>e.stopPropagation()}>
                    <button
                      onClick={() => handleValidate(d.id)}
                      title="Valider"
                      style={{
                        width:30, height:30, borderRadius:8,
                        background:'rgba(30,58,47,0.08)', border:'1px solid rgba(30,58,47,0.15)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', color:'#1E3A2F', transition:'all 0.15s',
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background='#1E3A2F';e.currentTarget.style.color='#F5F0E8'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(30,58,47,0.08)';e.currentTarget.style.color='#1E3A2F'}}>
                      <Icon name="check" size={13} />
                    </button>
                    <button
                      onClick={() => handleReject(d.id)}
                      title="Rejeter"
                      style={{
                        width:30, height:30, borderRadius:8,
                        background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.15)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', color:'#C0392B', transition:'all 0.15s',
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background='#C0392B';e.currentTarget.style.color='#fff'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='rgba(192,57,43,0.08)';e.currentTarget.style.color='#C0392B'}}>
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{
                background:'#fff', borderRadius:12, padding:'32px',
                textAlign:'center', border:'1px solid rgba(30,58,47,0.06)',
              }}>
                <span style={{ fontSize:'2.5rem', display:'block', marginBottom:10 }}>✅</span>
                <p style={{ fontSize:'0.82rem', color:'#8C8278', margin:0 }}>
                  Aucun dossier dans cette catégorie
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel détail dossier */}
        <div style={{ position:'sticky', top:80 }}>
          {selected ? (
            <div style={{
              background:'#fff', borderRadius:14, overflow:'hidden',
              boxShadow:'0 4px 20px rgba(30,58,47,0.08)',
              border:'1px solid rgba(30,58,47,0.08)',
            }}>
              {/* Header */}
              <div style={{
                background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
                padding:'16px 18px',
                display:'flex', justifyContent:'space-between', alignItems:'flex-start',
              }}>
                <div>
                  <p style={{ fontSize:'0.6rem', color:'rgba(245,240,232,0.5)',
                               textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 3px' }}>
                    Dossier KYC · {selected.ref}
                  </p>
                  <h3 style={{ fontFamily:"'Playfair Display', serif",
                                fontSize:'1rem', fontWeight:700, color:'#F5F0E8', margin:0 }}>
                    {selected.name}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)} style={{
                  background:'rgba(245,240,232,0.1)', border:'1px solid rgba(245,240,232,0.15)',
                  borderRadius:7, width:26, height:26,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', color:'rgba(245,240,232,0.7)',
                }}>
                  <Icon name="x" size={12} />
                </button>
              </div>

              <div style={{ padding:'16px' }}>
                {/* Infos */}
                {[
                  { label:'Email',     value:selected.email   },
                  { label:'Pays',      value:selected.country },
                  { label:'Document',  value:selected.type    },
                  { label:'Soumis',    value:selected.submitted },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display:'flex', justifyContent:'space-between',
                    padding:'7px 0', fontSize:'0.75rem',
                    borderBottom:'1px solid rgba(30,58,47,0.05)',
                  }}>
                    <span style={{ color:'#8C8278' }}>{label}</span>
                    <span style={{ fontWeight:600, color:'#1A1A1A', textAlign:'right', maxWidth:'60%' }}>
                      {value}
                    </span>
                  </div>
                ))}

                {/* Document preview */}
                <div style={{
                  marginTop:14, background:'#F5F0E8', borderRadius:10,
                  padding:'20px', textAlign:'center',
                  border:'2px dashed rgba(30,58,47,0.15)',
                }}>
                  <span style={{ fontSize:'2.5rem', display:'block', marginBottom:6 }}>🪪</span>
                  <p style={{ fontSize:'0.72rem', fontWeight:600, color:'#1E3A2F', margin:'0 0 2px' }}>
                    {selected.type}
                  </p>
                  <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:'0 0 12px' }}>
                    Document uploadé
                  </p>
                  <button style={{
                    padding:'6px 14px', borderRadius:7, border:'none',
                    background:'#1E3A2F', color:'#F5F0E8',
                    fontSize:'0.7rem', fontWeight:600, cursor:'pointer',
                    fontFamily:"'DM Sans', sans-serif",
                    display:'inline-flex', alignItems:'center', gap:5,
                  }}>
                    <Icon name="eye" size={12} /> Voir le document
                  </button>
                </div>

                {/* Actions (si pending) */}
                {selected.status === 'pending' && (
                  <div style={{ marginTop:14 }}>
                    <textarea
                      value={rejectNote}
                      onChange={e => setRejectNote(e.target.value)}
                      placeholder="Note de rejet (optionnel)..."
                      rows={2}
                      style={{
                        width:'100%', padding:'9px 12px', borderRadius:9,
                        border:'1.5px solid rgba(30,58,47,0.15)',
                        fontSize:'0.75rem', color:'#4A3F35', outline:'none',
                        resize:'none', marginBottom:10,
                        fontFamily:"'DM Sans', sans-serif",
                        background:'rgba(245,240,232,0.4)',
                      }}
                    />
                    <div style={{ display:'flex', gap:8 }}>
                      <button
                        onClick={() => handleReject(selected.id)}
                        style={{
                          flex:1, padding:'9px', borderRadius:9,
                          background:'rgba(192,57,43,0.08)',
                          border:'1.5px solid rgba(192,57,43,0.2)',
                          color:'#C0392B', fontSize:'0.78rem', fontWeight:600,
                          cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
                        }}>
                        ✗ Rejeter
                      </button>
                      <button
                        onClick={() => handleValidate(selected.id)}
                        style={{
                          flex:1, padding:'9px', borderRadius:9, border:'none',
                          background:'linear-gradient(135deg, #1E3A2F, #2D5241)',
                          color:'#F5F0E8', fontSize:'0.78rem', fontWeight:600,
                          cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
                          boxShadow:'0 3px 10px rgba(30,58,47,0.25)',
                        }}>
                        ✓ Valider
                      </button>
                    </div>
                  </div>
                )}

                {selected.status === 'validated' && (
                  <div style={{
                    marginTop:14, background:'rgba(30,58,47,0.05)',
                    border:'1px solid rgba(30,58,47,0.1)',
                    borderRadius:10, padding:'12px', textAlign:'center',
                  }}>
                    <p style={{ fontSize:'0.78rem', fontWeight:600, color:'#1E3A2F', margin:0 }}>
                      ✓ KYC validé — Compte actif
                    </p>
                  </div>
                )}

                {selected.status === 'rejected' && (
                  <div style={{
                    marginTop:14, background:'rgba(192,57,43,0.05)',
                    border:'1px solid rgba(192,57,43,0.12)',
                    borderRadius:10, padding:'12px', textAlign:'center',
                  }}>
                    <p style={{ fontSize:'0.78rem', fontWeight:600, color:'#C0392B', margin:0 }}>
                      ✗ KYC rejeté
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              background:'#fff', borderRadius:14, padding:'32px',
              textAlign:'center', border:'1px solid rgba(30,58,47,0.06)',
              boxShadow:'0 2px 10px rgba(30,58,47,0.04)',
            }}>
              <span style={{ fontSize:'3rem', display:'block', marginBottom:12 }}>👈</span>
              <p style={{ fontSize:'0.8rem', color:'#8C8278', margin:0 }}>
                Sélectionnez un dossier pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}