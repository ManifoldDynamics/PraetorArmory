import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { deleteMaintenanceLog } from "./actions"

export default async function MaintenancePage() {
  const logs = await prisma.maintenanceLog.findMany({
    orderBy: { date: 'desc' },
    include: { firearm: true }
  })

  // Calculate total rounds fired grouped by Firearm
  const uniqueFirearmIds = Array.from(new Set(logs.map((l: any) => l.firearmId)))
  const aggregates = await Promise.all(
    uniqueFirearmIds.map(async (id: any) => {
      const agg = await prisma.maintenanceLog.aggregate({
        where: { firearmId: id },
        _sum: { roundCount: true }
      })
      return { id, total: agg._sum.roundCount || 0 }
    })
  )
  const roundMap = Object.fromEntries(aggregates.map((a: any) => [a.id, a.total]))

  return (
    <div className="container animate-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Maintenance & Range Logs</h1>
          <p>Activity history and lifetime round counts across your armory.</p>
        </div>
        <Link href="/maintenance/new">
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> New Log
          </button>
        </Link>
      </header>

      {logs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>No maintenance recorded</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Log your range trips and cleanings here to keep track of round counts.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
          {logs.map((log: any) => (
            <div key={log.id} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{log.firearm.make} {log.firearm.model}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    Lifetime Rounds: {roundMap[log.firearmId]}
                  </span>
                </div>
                <p style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.1rem', margin: '4px 0' }}>{log.actionType}</p>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                  <span>&bull;</span>
                  <span>+{log.roundCount} rds added</span>
                </div>
                
                {log.notes && (
                  <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', borderLeft: '3px solid var(--border-color)' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>&quot;{log.notes}&quot;</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                 <form action={deleteMaintenanceLog}>
                   <input type="hidden" name="id" value={log.id} />
                   <button type="submit" className="danger" style={{ fontSize: '0.85rem' }}>Delete</button>
                 </form>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
