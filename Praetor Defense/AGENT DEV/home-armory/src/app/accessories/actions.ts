'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addAccessory(formData: FormData) {
  const type = formData.get('type') as string
  const brand = formData.get('brand') as string
  const model = formData.get('model') as string
  const notes = formData.get('notes') as string
  const firearmId = formData.get('firearmId') as string || null

  await prisma.accessory.create({
    data: { type, brand, model, notes, firearmId }
  })

  revalidatePath('/accessories')
  revalidatePath('/firearms')
  revalidatePath('/')
  redirect('/accessories')
}

export async function deleteAccessory(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.accessory.delete({ where: { id } })
  revalidatePath('/accessories')
  revalidatePath('/firearms')
  revalidatePath('/')
}

export async function updateAccessoryMount(formData: FormData) {
  const id = formData.get('id') as string
  const firearmId = formData.get('firearmId') as string || null
  await prisma.accessory.update({
    where: { id },
    data: { firearmId }
  })
  revalidatePath('/accessories')
  revalidatePath('/firearms')
}
