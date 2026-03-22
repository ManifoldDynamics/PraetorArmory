'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addAmmo(formData: FormData) {
  const caliber = formData.get('caliber') as string
  const brand = formData.get('brand') as string
  const grainRaw = formData.get('grain') as string
  const grain = grainRaw ? parseInt(grainRaw, 10) : null
  const quantity = parseInt(formData.get('quantity') as string, 10) || 0
  const location = formData.get('location') as string

  await prisma.ammo.create({
    data: { caliber, brand, grain, quantity, location }
  })

  revalidatePath('/ammo')
  revalidatePath('/')
  redirect('/ammo')
}

export async function updateAmmoQuantity(formData: FormData) {
  const id = formData.get('id') as string
  const newQuantity = parseInt(formData.get('newQuantity') as string, 10)
  await prisma.ammo.update({
    where: { id },
    data: { quantity: newQuantity }
  })
  revalidatePath('/ammo')
  revalidatePath('/')
}

export async function deleteAmmo(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.ammo.delete({ where: { id } })
  revalidatePath('/ammo')
  revalidatePath('/')
}
