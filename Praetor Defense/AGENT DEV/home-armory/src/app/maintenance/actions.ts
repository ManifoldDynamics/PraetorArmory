'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addMaintenanceLog(formData: FormData) {
  const firearmId = formData.get('firearmId') as string
  const dateRaw = formData.get('date') as string
  const date = dateRaw ? new Date(dateRaw) : new Date()
  const actionType = formData.get('actionType') as string
  const roundCount = parseInt(formData.get('roundCount') as string, 10) || 0
  const notes = formData.get('notes') as string

  await prisma.maintenanceLog.create({
    data: { firearmId, date, actionType, roundCount, notes }
  })

  revalidatePath('/maintenance')
  revalidatePath('/firearms')
  revalidatePath('/')
  redirect('/maintenance')
}

export async function deleteMaintenanceLog(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.maintenanceLog.delete({ where: { id } })
  revalidatePath('/maintenance')
  revalidatePath('/firearms')
  revalidatePath('/')
}
