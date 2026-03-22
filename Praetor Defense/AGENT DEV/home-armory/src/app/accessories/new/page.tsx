import { addAccessory } from "../actions"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function NewAccessoryPage() {
  const firearms = await prisma.firearm.findMany({
    orderBy: { make: 'asc' }
  })

  return (
    <div className="container animate-in" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Add Accessory</h1>
        <p>Register a new optic, light, or attachment.</p>
      </header>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
        <form action={addAccessory} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Type <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <select name="type" required>
                <option value="Optic">Optic (Red Dot, Scope)</option>
                <option value="Light">Weapon Light</option>
                <option value="Laser">Laser</option>
                <option value="Suppressor">Suppressor</option>
                <option value="Sling">Sling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Brand / Manufacturer <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="brand" required placeholder="e.g. Trijicon, SureFire" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Model <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input type="text" name="model" required placeholder="e.g. RMR Type 2" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Mounted On (Optional)</label>
            <select name="firearmId" defaultValue="">
              <option value="">-- Unassigned / Not Mounted --</option>
              {firearms.map((f: any) => (
                <option key={f.id} value={f.id}>{f.make} {f.model} ({f.serialNumber || 'No SN'})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Notes</label>
            <input type="text" name="notes" placeholder="e.g. Warranty active, bought used" />
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
            <button type="submit" className="primary" style={{ flex: 1, padding: '14px', fontSize: '1.05rem' }}>Add Accessory</button>
            <Link href="/accessories" style={{ flex: 1, display: 'block' }}>
              <button type="button" className="secondary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', textAlign: 'center' }}>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
