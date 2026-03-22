import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteFirearm } from "./actions"

export default async function FirearmsPage() {
  const firearms = await prisma.firearm.findMany({
    orderBy: { createdAt: 'desc' },
    include: { accessories: true }
  })

  return (
    <div className="container animate-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Firearms Collection</h1>
          <p>Total logged in vault: {firearms.length}</p>
        </div>
        <Link href="/firearms/new">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Add Firearm
          </button>
        </Link>
      </header>

      {firearms.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>No firearms registered</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Add your first firearm to build out your digital armory.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
          {firearms.map((firearm: any) => (
            <div key={firearm.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{firearm.make} <span style={{ fontWeight: 'normal' }}>{firearm.model}</span></h3>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {firearm.type}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>Caliber: <span style={{ color: 'var(--text-primary)' }}>{firearm.calibers}</span></p>
              </div>
              
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Serial Number</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{firearm.serialNumber || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Acquired</span>
                  <span style={{ color: 'var(--text-primary)' }}>{firearm.acquiredDate ? new Date(firearm.acquiredDate).toLocaleDateString() : '-'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Purchase Price</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{firearm.purchasePrice ? `$${firearm.purchasePrice.toFixed(2)}` : '-'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Attachments</span>
                  <span style={{ color: 'var(--text-primary)' }}>{firearm.accessories.length}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Link href={`/maintenance`}>
                    <button type="button" className="secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Logs</button>
                 </Link>
                 <form action={deleteFirearm}>
                   <input type="hidden" name="id" value={firearm.id} />
                   <button type="submit" className="danger" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Delete Record</button>
                 </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
