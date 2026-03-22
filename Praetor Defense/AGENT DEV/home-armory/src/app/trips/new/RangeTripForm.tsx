'use client'

import { useState } from 'react'
import { addRangeTrip } from '../actions'

export default function RangeTripForm({ firearmsList, ammoList }: { firearmsList: any[], ammoList: any[] }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState('')
  const [notes, setNotes] = useState('')
  
  const [firearms, setFirearms] = useState([{ firearmId: '', ammoId: '', roundCount: 0 }])

  const handleAddFirearm = () => {
    setFirearms([...firearms, { firearmId: '', ammoId: '', roundCount: 0 }])
  }

  const handleRemoveFirearm = (index: number) => {
    setFirearms(firearms.filter((_, i) => i !== index))
  }

  const handleUpdateFirearm = (index: number, field: string, value: any) => {
    const updated = [...firearms]
    updated[index] = { ...updated[index], [field]: value }
    setFirearms(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Bypass default FormData to send the complex object payload to the Server Action
    await addRangeTrip(date, location, weather, notes, firearms)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Date <span style={{ color: 'var(--danger-color)' }}>*</span></label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Location / Range Name</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Indoor Range" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Weather Conditions</label>
        <input type="text" value={weather} onChange={e => setWeather(e.target.value)} placeholder="e.g. 70F, Sunny, High wind" />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Firearms Fired</h3>
          <button type="button" onClick={handleAddFirearm} className="primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>+ Add Firearm</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {firearms.map((fa, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 2 }}>
                <label style={{ fontSize: '0.8rem' }}>Firearm <span style={{ color: 'var(--danger-color)' }}>*</span></label>
                <select value={fa.firearmId} onChange={e => handleUpdateFirearm(i, 'firearmId', e.target.value)} required>
                  <option value="">-- Select --</option>
                  {firearmsList.map((f: any) => <option key={f.id} value={f.id}>{f.make} {f.model}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 2 }}>
                <label style={{ fontSize: '0.8rem' }}>Ammo Used (Deducts Inventory)</label>
                <select value={fa.ammoId} onChange={e => handleUpdateFirearm(i, 'ammoId', e.target.value)}>
                  <option value="">-- None / Do not deduct --</option>
                  {ammoList.map((a: any) => <option key={a.id} value={a.id}>{a.caliber} {a.brand} ({a.quantity} rounds available)</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '0.8rem' }}>Round Count <span style={{ color: 'var(--danger-color)' }}>*</span></label>
                <input type="number" min="1" value={fa.roundCount || ''} onChange={e => handleUpdateFirearm(i, 'roundCount', parseInt(e.target.value) || 0)} required placeholder="0" />
              </div>

              {firearms.length > 1 && (
                <button type="button" onClick={() => handleRemoveFirearm(i)} className="danger" style={{ padding: '8px 12px' }}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Overall Notes & Performance</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did the excursion go? Any malfunctions?" rows={4} style={{ padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', color: 'white' }}></textarea>
      </div>

      <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
        <button type="submit" className="primary" style={{ flex: 1, padding: '14px', fontSize: '1.05rem' }}>Log Range Trip</button>
        <a href="/trips" style={{ flex: 1, display: 'block' }}>
          <button type="button" className="secondary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', textAlign: 'center' }}>Cancel</button>
        </a>
      </div>
    </form>
  )
}
