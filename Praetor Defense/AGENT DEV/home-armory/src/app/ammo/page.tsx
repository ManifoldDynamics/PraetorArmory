import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { updateAmmoQuantity, deleteAmmo } from "./actions"

export default async function AmmoPage() {
  const ammoStock = await prisma.ammo.findMany({
    orderBy: { caliber: 'asc' }
  })

  // Group by caliber
  const groupedStock = ammoStock.reduce((acc: any, ammo: any) => {
    if (!acc[ammo.caliber]) acc[ammo.caliber] = []
    acc[ammo.caliber].push(ammo)
    return acc
  }, {} as Record<string, typeof ammoStock>)

  const calibers = Object.keys(groupedStock).sort()

  return (
    <div className="container animate-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Ammunition Inventory</h1>
          <p>Track your rounds and log range usage.</p>
        </div>
        <Link href="/ammo/new">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Add Stock
          </button>
        </Link>
      </header>

      {calibers.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>No ammunition tracked</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Add your first stock to manage your inventory.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
          {calibers.map(caliber => (
            <div key={caliber} className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-color)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {caliber} <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 'normal', marginLeft: '8px' }}>
                  ({groupedStock[caliber].reduce((sum: number, a: any) => sum + a.quantity, 0)} total rounds)
                </span>
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {groupedStock[caliber].map((ammo: any) => (
                  <div key={ammo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--border-radius)', flexWrap: 'wrap', gap: '20px' }}>
                    
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{ammo.brand} {ammo.grain ? <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>({ammo.grain}gr)</span> : ''}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Location: {ammo.location || 'Unspecified'}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center', minWidth: '60px' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Stock</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{ammo.quantity}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <form action={updateAmmoQuantity}>
                           <input type="hidden" name="id" value={ammo.id} />
                           <input type="hidden" name="newQuantity" value={Math.max(0, ammo.quantity - 50)} />
                           <button type="submit" className="secondary" style={{ padding: '8px 12px' }}>-50</button>
                        </form>
                        <form action={updateAmmoQuantity}>
                           <input type="hidden" name="id" value={ammo.id} />
                           <input type="hidden" name="newQuantity" value={Math.max(0, ammo.quantity - 20)} />
                           <button type="submit" className="secondary" style={{ padding: '8px 12px' }}>-20</button>
                        </form>
                        <form action={updateAmmoQuantity}>
                           <input type="hidden" name="id" value={ammo.id} />
                           <input type="hidden" name="newQuantity" value={ammo.quantity + 20} />
                           <button type="submit" className="secondary" style={{ padding: '8px 12px' }}>+20</button>
                        </form>
                         <form action={updateAmmoQuantity}>
                           <input type="hidden" name="id" value={ammo.id} />
                           <input type="hidden" name="newQuantity" value={ammo.quantity + 50} />
                           <button type="submit" className="secondary" style={{ padding: '8px 12px' }}>+50</button>
                        </form>
                      </div>

                      <form action={deleteAmmo} style={{ marginLeft: '16px' }}>
                        <input type="hidden" name="id" value={ammo.id} />
                        <button type="submit" className="danger" style={{ padding: '8px 12px' }}>Delete</button>
                      </form>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
