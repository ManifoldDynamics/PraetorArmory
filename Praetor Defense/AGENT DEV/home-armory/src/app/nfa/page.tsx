import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteNfaItem, updateNfaStatus } from "./actions"

export default async function NfaPage() {
  const nfaItems = await prisma.nfaItem.findMany({
    orderBy: { submissionDate: 'desc' },
    include: { firearm: true, accessory: true }
  })

  const calculateDaysPending = (submitted: Date | null, approved: Date | null) => {
    if (!submitted) return 0;
    const end = approved ? new Date(approved) : new Date();
    const diff = end.getTime() - new Date(submitted).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 3600 * 24)));
  }

  return (
    <div className="container animate-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>NFA Tracker</h1>
          <p>Monitor your eForms and live wait times.</p>
        </div>
        <Link href="/nfa/new">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Add Form
          </button>
        </Link>
      </header>

      {nfaItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>No NFA items tracked.</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Log a Form 1 or Form 4 to start tracking your pending tax stamps.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
          {nfaItems.map((item: any) => {
            const daysPending = calculateDaysPending(item.submissionDate, item.approvedDate);
            const isApproved = item.status === 'Approved';
            const statusColor = isApproved ? 'var(--success-color)' : item.status === 'Pending' ? '#eab308' : 'var(--text-secondary)';

            return (
              <div key={item.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.formType}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>#{item.controlNumber || 'Awaiting Control Num'}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: `rgba(${isApproved? '46,160,67': '234,179,8'}, 0.15)`, borderRadius: '12px', color: statusColor, fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {item.status}
                  </span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Submitted</span>
                      <span>{item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : '-'}</span>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: isApproved ? 'var(--success-color)' : 'var(--text-primary)', lineHeight: '1' }}>{daysPending}</span>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Days {isApproved ? 'Waited' : 'Pending'}</span>
                    </div>
                  </div>

                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px' }}>&quot;{item.notes}&quot;</p>}
                  
                  {(item.firearm || item.accessory) && (
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>Linked item:</span>
                      <strong style={{ color: 'var(--accent-color)' }}>
                        {item.firearm ? `${item.firearm.make} ${item.firearm.model}` : `${item.accessory.brand} ${item.accessory.model}`}
                      </strong>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                  {!isApproved ? (
                    <form action={updateNfaStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="Approved" />
                      <button type="submit" className="primary" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Mark Approved</button>
                    </form>
                  ) : <div></div>}
                  
                  <form action={deleteNfaItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="danger" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Delete Form</button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
