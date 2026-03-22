import { addNfaItem } from "../actions"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function NewNfaPage() {
  const firearms = await prisma.firearm.findMany({ orderBy: { make: 'asc' } })
  const accessories = await prisma.accessory.findMany({ orderBy: { brand: 'asc' } })

  return (
    <div className="container animate-in" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Log NFA Tax Stamp</h1>
        <p>Track your Form 1s, Form 4s, and pending wait times.</p>
      </header>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
        <form action={addNfaItem} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Form Type <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <select name="formType" required>
                <option value="Form 1 (SBR/SBS)">Form 1 (SBR/SBS/Destructive Device)</option>
                <option value="Form 4 (Suppressor)">Form 4 (Suppressor/Transfer)</option>
                <option value="Form 5">Form 5</option>
                <option value="Amnesty Form 1">Amnesty Form 1</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Status <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <select name="status" required defaultValue="Pending">
                <option value="Drafting">Drafting / Preparing</option>
                <option value="Pending">Pending ATF Approval</option>
                <option value="Approved">Approved</option>
                <option value="Denied">Denied / Withdrawn</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Control Number</label>
              <input type="text" name="controlNumber" placeholder="e.g. 2024123456" style={{ fontFamily: 'var(--font-mono)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Tax Stamp Cost ($)</label>
              <input type="number" step="0.01" name="taxStampCost" defaultValue="200.00" />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Submission Date</label>
              <input type="date" name="submissionDate" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Fingerprints Dispatched</label>
              <input type="date" name="fingerprintsSent" />
            </div>
          </div>

          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '3px solid var(--accent-color)' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>Link this Tax Stamp to an item in your Armory (Optional):</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem' }}>Host Firearm (SBR/SBS)</label>
                <select name="firearmId" defaultValue="">
                  <option value="">-- Unlinked --</option>
                  {firearms.map((f: any) => <option key={f.id} value={f.id}>{f.make} {f.model}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem' }}>Accessory (Suppressor)</label>
                <select name="accessoryId" defaultValue="">
                  <option value="">-- Unlinked --</option>
                  {accessories.map((a: any) => <option key={a.id} value={a.id}>{a.brand} {a.model}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Notes</label>
            <input type="text" name="notes" placeholder="e.g. Trust name, engraver info..." />
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
            <button type="submit" className="primary" style={{ flex: 1, padding: '14px', fontSize: '1.05rem' }}>Track Stamp</button>
            <Link href="/nfa" style={{ flex: 1, display: 'block' }}>
              <button type="button" className="secondary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', textAlign: 'center' }}>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
