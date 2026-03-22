import { prisma } from "@/lib/prisma"
import RangeTripForm from "./RangeTripForm"

export default async function NewTripPage() {
  const firearmsList = await prisma.firearm.findMany({ orderBy: { make: 'asc' } })
  const ammoList = await prisma.ammo.findMany({ orderBy: { caliber: 'asc' }, where: { quantity: { gt: 0 } } })

  return (
    <div className="container animate-in" style={{ paddingBottom: '60px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Log Range Trip</h1>
        <p>Record a range session. Ammo fired will be automatically deducted from your inventory, and added to the respective firearms&apos; lifetime logs.</p>
      </header>

      <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px' }}>
        <RangeTripForm firearmsList={firearmsList} ammoList={ammoList} />
      </div>
    </div>
  )
}
