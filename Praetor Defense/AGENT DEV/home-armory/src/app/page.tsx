import { prisma } from "@/lib/prisma"
import Link from 'next/link'
import { Target, ShieldCheck, Flame, Database, Crosshair, Activity, Clock, Box } from 'lucide-react'

export default async function Dashboard() {
  const firearmsCount = await prisma.firearm.count()
  
  // Aggregate Firearms by type
  const firearmsByTypeRaw = await prisma.firearm.groupBy({
    by: ['type'],
    _count: { id: true }
  })
  
  // Calculate total rounds fired
  const maintenanceStats = await prisma.maintenanceLog.aggregate({
    _sum: { roundCount: true }
  })
  const totalRoundsFired = maintenanceStats._sum.roundCount || 0

  // Quick Ammo Overview
  const topAmmo = await prisma.ammo.findMany({
    orderBy: { quantity: 'desc' },
    take: 5
  })
  const totalAmmoAgg = await prisma.ammo.aggregate({ _sum: { quantity: true } })
  const totalAmmo = totalAmmoAgg._sum.quantity || 0

  // NFA Pending
  const pendingNfaCount = await prisma.nfaItem.count({ where: { status: 'Pending' } })
  const approvedNfaCount = await prisma.nfaItem.count({ where: { status: 'Approved' } })

  // Recent Range Trips
  const recentTrips = await prisma.rangeTrip.findMany({
    orderBy: { date: 'desc' },
    take: 3,
    include: { firearms: true }
  })

  // Pending NFA Items (to calculate max wait time)
  const pendingNFAItemsDesc = await prisma.nfaItem.findMany({
    where: { status: 'Pending' },
    orderBy: { submissionDate: 'asc' },
    take: 1
  })
  const longestWaitString = pendingNFAItemsDesc.length > 0 && pendingNFAItemsDesc[0].submissionDate ? `${Math.floor((new Date().getTime() - new Date(pendingNFAItemsDesc[0].submissionDate).getTime()) / (1000 * 3600 * 24))} Days` : '0 Days';

  return (
    <div className="container animate-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={32} color="var(--accent-color)" />
            Armory Intelligence Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Strategic overview of stored assets, stock metrics, and compliance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/firearms/new">
            <button className="secondary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crosshair size={16} /> Log Asset
            </button>
          </Link>
          <Link href="/trips/new">
            <button className="primary" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} /> Log Range Session
            </button>
          </Link>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Crosshair size={20} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>Total Assets</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }} className="mono-num">{firearmsCount}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid var(--warning-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Database size={20} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>Total Rounds</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }} className="mono-num">{totalAmmo.toLocaleString()}</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid var(--danger-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Flame size={20} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>Rounds Expended</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }} className="mono-num">{totalRoundsFired.toLocaleString()}</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid #ab47bc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Clock size={20} /> <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>NFA Pending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }} className="mono-num">{pendingNfaCount}</div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({approvedNfaCount} Approved)</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Longest Wait: <strong style={{color: 'var(--text-primary)'}}>{longestWaitString}</strong></div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.8fr) minmax(300px, 1fr)', gap: '24px' }}>
        
        {/* Left Column: Ammo & Type Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box size={20} color="var(--accent-color)" /> Strategic Munitions Stockpile
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {topAmmo.length === 0 ? <p style={{color: 'var(--text-secondary)'}}>No ammunition tracked.</p> : topAmmo.map(ammo => {
                const percent = totalAmmo > 0 ? (ammo.quantity / totalAmmo) * 100 : 0;
                return (
                  <div key={ammo.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                      <strong style={{ fontWeight: 500, letterSpacing: '0.5px' }}>{ammo.caliber} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{ammo.brand} ({ammo.grain || '?'}gr)</span></strong>
                      <span className="mono-num">{ammo.quantity.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#010409', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(2, percent)}%`, height: '100%', backgroundColor: 'var(--warning-color)', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
            {topAmmo.length > 0 && <div style={{ marginTop: '32px' }}><Link href="/ammo" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 500 }}>View Full Inventory &rarr;</Link></div>}
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color="var(--accent-color)" /> Asset Class Distribution
            </h3>
            {firearmsByTypeRaw.length === 0 ? <p style={{color: 'var(--text-secondary)'}}>No assets to analyze.</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
                {firearmsByTypeRaw.map(type => (
                  <div key={type.type} style={{ background: '#010409', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{type.type}</span>
                    <strong style={{ fontSize: '2rem', lineHeight: 1 }} className="mono-num">{type._count.id}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px', flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={20} color="var(--danger-color)" /> Recent Excursions
            </h3>

            {recentTrips.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No range activity detected on the network.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentTrips.map(trip => {
                   const totalRounds = trip.firearms.reduce((sum: number, f: any) => sum + f.roundCount, 0);
                   return (
                     <div key={trip.id} style={{ display: 'flex', gap: '16px' }}>
                       <div style={{ width: '2px', background: 'var(--border-color)', position: 'relative', marginTop: '10px' }}>
                         <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger-color)', border: '2px solid #161b22' }}></div>
                       </div>
                       <div style={{ flex: 1, paddingBottom: '20px', paddingTop: '4px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                           <strong style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>{trip.location || 'Unknown Location'}</strong>
                           <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }} className="mono-num">{new Date(trip.date).toLocaleDateString()}</span>
                         </div>
                         <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Asset deployments: {trip.firearms.length} unit(s)<br/>Munitions Expended: <span style={{color: 'var(--text-primary)'}}>{totalRounds} rds</span></p>
                       </div>
                     </div>
                   )
                })}
              </div>
            )}
            {recentTrips.length > 0 && <div style={{ marginTop: '16px' }}><Link href="/trips" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 500 }}>View Operational History &rarr;</Link></div>}
          </div>
        </div>

      </div>
    </div>
  )
}
