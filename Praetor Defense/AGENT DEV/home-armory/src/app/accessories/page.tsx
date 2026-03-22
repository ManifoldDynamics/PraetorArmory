import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteAccessory, updateAccessoryMount } from "./actions"

export default async function AccessoriesPage() {
  const accessories = await prisma.accessory.findMany({
    orderBy: { createdAt: 'desc' },
    include: { firearm: true }
  })

  // To allow quick reassignment, we fetch all firearms
  const firearms = await prisma.firearm.findMany({ orderBy: { make: 'asc' }})

  return (
    <div className="container animate-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Accessories</h1>
          <p>Total logged: {accessories.length}</p>
        </div>
        <Link href="/accessories/new">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Add Accessory
          </button>
        </Link>
      </header>

      {accessories.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>No accessories tracked</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Add your optics, lights, and gear.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
          {accessories.map((acc: any) => (
            <div key={acc.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>{acc.brand} {acc.model}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Type: {acc.type}</p>
                </div>
              </div>
              
              <div style={{ flex: 1, marginBottom: '20px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', minHeight: '40px' }}>{acc.notes || 'No notes.'}</p>
                
                <form action={updateAccessoryMount} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="hidden" name="id" value={acc.id} />
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mounted On</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select name="firearmId" defaultValue={acc.firearmId || ""} style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}>
                      <option value="">-- Unassigned --</option>
                      {firearms.map((f: any) => (
                        <option key={f.id} value={f.id}>{f.make} {f.model}</option>
                      ))}
                    </select>
                    <button type="submit" className="secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Update</button>
                  </div>
                </form>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                 <form action={deleteAccessory}>
                   <input type="hidden" name="id" value={acc.id} />
                   <button type="submit" className="danger" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>Delete Record</button>
                 </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
