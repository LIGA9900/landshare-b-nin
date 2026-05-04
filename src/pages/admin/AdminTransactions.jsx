// ═══════════════════════════════════════════════════════════════════
// AdminTransactions.jsx — Gestion des Transactions
// ═══════════════════════════════════════════════════════════════════
import { useState } from 'react'
import AdminLayout, { Icon } from './AdminLayout'

const TRANSACTIONS = [
  { id:1,  ref:'LS-054', user:'Aisha Koné',      terrain:'Calavi Nord',      sqm:5,  amount:77250,  method:'MTN MoMo',   status:'confirmed', date:'03 Mai 2026',  time:'14:32' },
  { id:2,  ref:'LS-053', user:'Romaric H.',       terrain:'Fidjrossè',        sqm:5,  amount:77250,  method:'Stripe',     status:'confirmed', date:'27 Oct 2025',  time:'11:15' },
  { id:3,  ref:'LS-052', user:'Aïcha Traoré',     terrain:'Porto-Novo Est',   sqm:3,  amount:46500,  method:'MTN MoMo',   status:'pending',   date:'27 Oct 2025',  time:'09:48' },
  { id:4,  ref:'LS-051', user:'Kevin Agossa',     terrain:'Parakou Nord',     sqm:8,  amount:68000,  method:'Moov Money', status:'confirmed', date:'26 Oct 2025',  time:'16:22' },
  { id:5,  ref:'LS-050', user:'Sylvie Dossou',    terrain:'Calavi Nord',      sqm:15, amount:231750, method:'Stripe',     status:'failed',    date:'26 Oct 2025',  time:'08:05' },
  { id:6,  ref:'LS-049', user:'Jean-Paul K.',     terrain:'Fidjrossè',        sqm:20, amount:309000, method:'Paystack',   status:'confirmed', date:'25 Oct 2025',  time:'13:40' },
  { id:7,  ref:'LS-048', user:'Ibrahim Touré',    terrain:'Ouidah Historique',sqm:10, amount:154500, method:'MTN MoMo',   status:'confirmed', date:'24 Oct 2025',  time:'10:18' },
  { id:8,  ref:'LS-047', user:'Amina Soumaré',    terrain:'Calavi Nord',      sqm:3,  amount:46350,  method:'Stripe',     status:'refunded',  date:'23 Oct 2025',  time:'15:55' },
]

const STATUS_CFG = {
  confirmed: { bg:'rgba(30,58,47,0.08)',   color:'#1E3A2F', label:'✓ Confirmé'  },
  pending:   { bg:'rgba(184,151,42,0.1)',  color:'#8B6E1A', label:'⏳ En attente' },
  failed:    { bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'✗ Échoué'    },
  refunded:  { bg:'rgba(100,116,139,0.08)',color:'#64748B', label:'↩ Remboursé' },
}

const METHOD_CFG = {
  'MTN MoMo':   { bg:'#FFCC00', color:'#1A1A1A' },
  'Moov Money': { bg:'#0056A2', color:'#fff'     },
  'Stripe':     { bg:'#635BFF', color:'#fff'     },
  'Paystack':   { bg:'#00C3F7', color:'#fff'     },
}

export default function AdminTransactions() {
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')

  const filtered = TRANSACTIONS.filter(tx => {
    const matchSearch = tx.ref.toLowerCase().includes(search.toLowerCase()) ||
                        tx.user.toLowerCase().includes(search.toLowerCase()) ||
                        tx.terrain.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || tx.status === filterStatus
    const matchMethod = filterMethod === 'all' || tx.method === filterMethod
    return matchSearch && matchStatus && matchMethod
  })

  const totalRevenue  = TRANSACTIONS.filter(tx=>tx.status==='confirmed').reduce((s,tx)=>s+tx.amount,0)
  const totalPending  = TRANSACTIONS.filter(tx=>tx.status==='pending').length
  const totalFailed   = TRANSACTIONS.filter(tx=>tx.status==='failed').length

  return (
    <AdminLayout
      title="Gestion des Transactions"
      subtitle={`${TRANSACTIONS.length} transactions enregistrées`}
      actions={
        <button style={{
          display:'flex', alignItems:'center', gap:6,
          padding:'7px 14px', borderRadius:8,
          background:'#1E3A2F', color:'#F5F0E8',
          border:'none', fontSize:'0.75rem', fontWeight:600,
          cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
        }}>
          <Icon name="download" size={14} />
          Exporter CSV
        </button>
      }
    >
      {/* KPIs */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20,
      }}>
        {[
          { label:'Revenus confirmés', value:`${(totalRevenue/1000).toFixed(0)}K F`, color:'#1E3A2F' },
          { label:'Total transactions', value:TRANSACTIONS.length,                   color:'#1E3A2F' },
          { label:'En attente',         value:totalPending,                          color:'#8B6E1A' },
          { label:'Échouées',           value:totalFailed,                           color:'#C0392B' },
        ].map(({ label, value, color }) => (
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
                         fontSize:'1.3rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background:'#fff', border:'1px solid rgba(30,58,47,0.12)',
          borderRadius:8, padding:'7px 12px', flex:1, minWidth:200,
        }}>
          <Icon name="search" size={14} />
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Réf., utilisateur, terrain..."
                 style={{ border:'none', background:'transparent', fontSize:'0.78rem',
                           color:'#4A3F35', outline:'none', width:'100%',
                           fontFamily:"'DM Sans', sans-serif" }} />
        </div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)',
                          background:'#fff', fontSize:'0.75rem', color:'#4A3F35',
                          cursor:'pointer', outline:'none', fontFamily:"'DM Sans', sans-serif" }}>
          <option value="all">Tous les statuts</option>
          <option value="confirmed">Confirmé</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
          <option value="refunded">Remboursé</option>
        </select>
        <select value={filterMethod} onChange={e=>setFilterMethod(e.target.value)}
                style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)',
                          background:'#fff', fontSize:'0.75rem', color:'#4A3F35',
                          cursor:'pointer', outline:'none', fontFamily:"'DM Sans', sans-serif" }}>
          <option value="all">Tous les modes</option>
          <option value="MTN MoMo">MTN MoMo</option>
          <option value="Moov Money">Moov Money</option>
          <option value="Stripe">Stripe</option>
          <option value="Paystack">Paystack</option>
        </select>
      </div>

      {/* Tableau */}
      <div style={{
        background:'#fff', borderRadius:14, overflow:'hidden',
        boxShadow:'0 2px 10px rgba(30,58,47,0.05)',
        border:'1px solid rgba(30,58,47,0.06)',
      }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAF7' }}>
                {['Réf.','Investisseur','Terrain','m²','Montant','Mode','Statut','Date','Actions'].map(h => (
                  <th key={h} style={{
                    padding:'10px 14px', textAlign:'left',
                    fontSize:'0.62rem', fontWeight:700, color:'#8C8278',
                    textTransform:'uppercase', letterSpacing:'0.06em',
                    borderBottom:'1px solid rgba(30,58,47,0.06)', whiteSpace:'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => {
                const sc  = STATUS_CFG[tx.status]  || STATUS_CFG.pending
                const mc  = METHOD_CFG[tx.method]  || { bg:'#E2E8F0', color:'#4A3F35' }
                return (
                  <tr key={tx.id}
                      style={{ transition:'background 0.15s', cursor:'pointer' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(245,240,232,0.5)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily:'monospace', fontSize:'0.72rem',
                                      color:'#1E3A2F', fontWeight:600 }}>
                        {tx.ref}
                      </span>
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{
                          width:28, height:28, borderRadius:'50%',
                          background:`hsl(${(tx.id*53)%360},40%,35%)`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'0.58rem', fontWeight:700, color:'#F5F0E8', flexShrink:0,
                        }}>
                          {tx.user.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontSize:'0.78rem', fontWeight:600, color:'#1A1A1A' }}>
                          {tx.user}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)',
                                  fontSize:'0.75rem', color:'#4A3F35' }}>
                      {tx.terrain}
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)',
                                  fontSize:'0.78rem', fontWeight:700, color:'#1A1A1A' }}>
                      {tx.sqm} m²
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{ fontFamily:"'Playfair Display', serif",
                                      fontSize:'0.82rem', fontWeight:700, color:'#1E3A2F' }}>
                        {tx.amount.toLocaleString('fr-FR')} F
                      </span>
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{
                        padding:'3px 9px', borderRadius:5, fontSize:'0.62rem',
                        fontWeight:800, background:mc.bg, color:mc.color,
                        letterSpacing:'0.03em',
                      }}>
                        {tx.method}
                      </span>
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <span style={{
                        padding:'3px 9px', borderRadius:20, fontSize:'0.65rem',
                        fontWeight:600, background:sc.bg, color:sc.color, whiteSpace:'nowrap',
                      }}>
                        {sc.label}
                      </span>
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <p style={{ fontSize:'0.7rem', color:'#4A3F35', margin:0, whiteSpace:'nowrap' }}>
                        {tx.date}
                      </p>
                      <p style={{ fontSize:'0.62rem', color:'#8C8278', margin:0 }}>{tx.time}</p>
                    </td>

                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                      <div style={{ display:'flex', gap:5 }}>
                        <button title="Voir détails" style={{
                          width:28, height:28, borderRadius:7,
                          background:'rgba(30,58,47,0.07)', border:'1px solid rgba(30,58,47,0.1)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          cursor:'pointer', color:'#1E3A2F', transition:'all 0.15s',
                        }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(30,58,47,0.14)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(30,58,47,0.07)'}>
                          <Icon name="eye" size={13} />
                        </button>
                        {tx.status === 'pending' && (
                          <button title="Valider manuellement" style={{
                            width:28, height:28, borderRadius:7,
                            background:'rgba(30,58,47,0.08)', border:'1px solid rgba(30,58,47,0.1)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', color:'#1E3A2F',
                          }}>
                            <Icon name="check" size={13} />
                          </button>
                        )}
                        {tx.status === 'failed' && (
                          <button title="Intervention requise" style={{
                            width:28, height:28, borderRadius:7,
                            background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.15)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', color:'#C0392B',
                          }}>
                            <Icon name="edit" size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{
          padding:'10px 16px', borderTop:'1px solid rgba(30,58,47,0.06)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>
            {filtered.length} transaction(s) sur {TRANSACTIONS.length}
          </p>
          <div style={{ display:'flex', gap:6 }}>
            {['←','1','2','→'].map(p => (
              <button key={p} style={{
                width:28, height:28, borderRadius:6,
                border:'1px solid rgba(30,58,47,0.12)',
                background: p==='1' ? '#1E3A2F' : '#fff',
                color: p==='1' ? '#F5F0E8' : '#4A3F35',
                fontSize:'0.7rem', cursor:'pointer',
                fontFamily:"'DM Sans', sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center',
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