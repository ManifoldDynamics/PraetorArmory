import { addAmmo } from "../actions"
import Link from "next/link"

export default function NewAmmoPage() {
  return (
    <div className="container animate-in" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Add Ammunition Stock</h1>
        <p>Register a new caliber or brand of ammo to track.</p>
      </header>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
        <form action={addAmmo} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Caliber <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="caliber" required placeholder="e.g. 9mm, .223 Rem" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Brand / Manufacturer <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="brand" required placeholder="e.g. Federal, Hornady" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Grain Weight</label>
              <input type="number" name="grain" placeholder="e.g. 115, 55" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Initial Quantity <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="number" name="quantity" required placeholder="Number of rounds" defaultValue="0" min="0" />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Storage Location</label>
            <input type="text" name="location" placeholder="e.g. Safe Shelf 1, Range Bag" />
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
            <button type="submit" className="primary" style={{ flex: 1, padding: '14px', fontSize: '1.05rem' }}>Add Ammo</button>
            <Link href="/ammo" style={{ flex: 1, display: 'block' }}>
              <button type="button" className="secondary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', textAlign: 'center' }}>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
