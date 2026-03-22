import { addFirearm } from "../actions"
import Link from "next/link"

export default function NewFirearmPage() {
  return (
    <div className="container animate-in" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Add New Firearm</h1>
        <p>Log a new weapon into your armory inventory system.</p>
      </header>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
        <form action={addFirearm} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Make / Manufacturer <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="make" required placeholder="e.g. SIG Sauer, Glock, Ruger" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Model <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="model" required placeholder="e.g. P320, 19 Gen 5, AR-15" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Caliber <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="calibers" required placeholder="e.g. 9x19mm, 5.56 NATO" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Serial Number</label>
              <input type="text" name="serialNumber" placeholder="Leave blank if unknown" style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Classification <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <select name="type" required>
                <option value="Handgun">Handgun</option>
                <option value="Rifle">Rifle</option>
                <option value="Shotgun">Shotgun</option>
                <option value="NFA Item (SBR)">NFA Item (SBR)</option>
                <option value="NFA Item (Suppressor)">NFA Item (Suppressor)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Purchase Price ($)</label>
              <input type="number" step="0.01" name="purchasePrice" placeholder="0.00" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Date Acquired</label>
            <input type="date" name="acquiredDate" style={{ maxWidth: '340px' }} />
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
            <button type="submit" className="primary" style={{ flex: 1, padding: '14px', fontSize: '1.05rem' }}>Save to Armory</button>
            <Link href="/firearms" style={{ flex: 1, display: 'block' }}>
              <button type="button" className="secondary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', textAlign: 'center' }}>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
