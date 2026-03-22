'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addRangeTrip(dateRaw: string, location: string, weather: string, notes: string, firearms: { firearmId: string, ammoId: string | null, roundCount: number }[]) {
  const date = dateRaw ? new Date(dateRaw) : new Date()

  // Use a transaction to ensure all deductions and logs happen atomically
  await prisma.$transaction(async (tx) => {
    // 1. Create the Range Trip
    const trip = await tx.rangeTrip.create({
      data: { date, location, weather, notes }
    })

    // 2. Loop through the firearms logged in this trip
    for (const fa of firearms) {
      if (fa.firearmId && fa.roundCount > 0) {
        // Create the TripFirearm link
        await tx.tripFirearm.create({
          data: {
            rangeTripId: trip.id,
            firearmId: fa.firearmId,
            ammoId: fa.ammoId || null,
            roundCount: fa.roundCount,
            notes: "Logged via Range Trip"
          }
        })

        // 3. Deduct Ammo from Inventory automatically!
        if (fa.ammoId) {
          await tx.ammo.update({
            where: { id: fa.ammoId },
            data: { quantity: { decrement: fa.roundCount } }
          })
        }

        // 4. Create a Maintenance Log automatically for lifetime tracking!
        await tx.maintenanceLog.create({
          data: {
            firearmId: fa.firearmId,
            date,
            actionType: "Range Session",
            roundCount: fa.roundCount,
            notes: `Auto-logged from Range Trip at ${location || 'Unspecified Location'}`
          }
        })
      }
    }
  })

  revalidatePath('/trips')
  revalidatePath('/maintenance')
  revalidatePath('/ammo')
  revalidatePath('/firearms')
  revalidatePath('/')
  redirect('/trips')
}

export async function deleteRangeTrip(formData: FormData) {
  const id = formData.get('id') as string
  // Prisma Cascade handles deletion of TripFirearm links. 
  // Note: Ammo refunds and MaintenanceLog pruning would require complex reverse engineering, skipped for V1.
  await prisma.rangeTrip.delete({ where: { id } })
  revalidatePath('/trips')
  revalidatePath('/')
}
