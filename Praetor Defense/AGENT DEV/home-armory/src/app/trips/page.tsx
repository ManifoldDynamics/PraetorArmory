import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteRangeTrip } from "./actions"

export default async function TripsPage() {
  const trips = await prisma.rangeTrip.findMany({
    orderBy: { date: 'desc' },
    include: {
      firearms: {
        include: { firearm: true, ammo: true }
      }
    }
  })

  return (
    <div className="container animate-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Range Trips</h1>
          <p>Track your range excursions, performance, and total round usage.</p>
        </div>
        <Link href="/trips/new">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Log Session
          </button>
        </Link>
      </header>

      {trips.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>No trips recorded</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Hit the range and log a session to deduct ammo inventory and increase firearm round counts automatically!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
          {trips.map((trip: any) => {
            const totalTripRounds = trip.firearms.reduce((sum: number, f: any) => sum + f.roundCount, 0);

            return (
              <div key={trip.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{new Date(trip.date).toLocaleDateString()} &middot; {trip.location || 'Unspecified Location'}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Weather: {trip.weather || 'N/A'}</p>
                  </div>
                  <span style={{ fontSize: '1rem', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                    {totalTripRounds} Rounds Fired
                  </span>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  {trip.notes && <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '20px' }}>&quot;{trip.notes}&quot;</p>}
                  
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Firearms Rolled Out:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {trip.firearms.map((tf: any) => (
                      <div key={tf.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', borderLeft: '3px solid var(--accent-color)' }}>
                        <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{tf.firearm.make} {tf.firearm.model}</strong>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Fired: {tf.roundCount} rds</span>
                          {tf.ammo && <span style={{ color: 'var(--text-secondary)' }}>({tf.ammo.caliber} {tf.ammo.brand})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <form action={deleteRangeTrip}>
                    <input type="hidden" name="id" value={trip.id} />
                    <button type="submit" className="danger" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Delete Trip</button>
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
