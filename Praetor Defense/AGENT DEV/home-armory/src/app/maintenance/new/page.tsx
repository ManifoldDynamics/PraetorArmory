import { addMaintenanceLog } from "../actions"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function NewMaintenanceLogPage() {
  const firearms = await prisma.firearm.findMany({
    orderBy: { make: 'asc' }
  })

  return (
    <div className="container animate-in" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Log Maintenance or Range Event</h1>
        <p>Record cleaning, part replacements, or rounds fired.</p>
      </header>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
        <form action={addMaintenanceLog} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Firearm <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <select name="firearmId" required>
              <option value="">-- Select Firearm --</option>
              {firearms.map((f: any) => (
                <option key={f.id} value={f.id}>{f.make} {f.model} ({f.serialNumber || 'No SN'})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Action Type <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input type="text" name="actionType" required placeholder="e.g. Cleaned, Part Replaced, Range Day" list="actionTypes" />
              <datalist id="actionTypes">
                <option value="Basic Cleaning"/>
                <option value="Deep Cleaning"/>
                <option value="Part Replaced"/>
                <option value="Inspection"/>
                <option value="Range Session"/>
                <option value="Zeroing Optic"/>
              </datalist>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Date</label>
              <input type="date" name="date" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Round Count</label>
            <input type="number" name="roundCount" placeholder="Rounds fired or total count" defaultValue="0" min="0" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Log 0 if this was just a cleaning/maintenance.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Notes</label>
            <textarea name="notes" placeholder="Detailed notes about the maintenance or range session..." rows={4} style={{ padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', color: 'white' }}></textarea>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
            <button type="submit" className="primary" style={{ flex: 1, padding: '14px', fontSize: '1.05rem' }}>Save Log</button>
            <Link href="/maintenance" style={{ flex: 1, display: 'block' }}>
              <button type="button" className="secondary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', textAlign: 'center' }}>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
