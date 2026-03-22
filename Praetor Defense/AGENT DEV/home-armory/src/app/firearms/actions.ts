'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addFirearm(formData: FormData) {
  const make = formData.get('make') as string
  const model = formData.get('model') as string
  const calibers = formData.get('calibers') as string
  const serialNumber = formData.get('serialNumber') as string
  const type = formData.get('type') as string
  
  const purchasePriceRaw = formData.get('purchasePrice') as string
  const purchasePrice = purchasePriceRaw ? parseFloat(purchasePriceRaw) : null
  
  const acquiredDateRaw = formData.get('acquiredDate') as string
  let acquiredDate = null
  if (acquiredDateRaw) {
    acquiredDate = new Date(acquiredDateRaw)
  }

  await prisma.firearm.create({
    data: {
      make,
      model,
      calibers,
      serialNumber,
      type,
      purchasePrice,
      acquiredDate
    }
  })

  revalidatePath('/firearms')
  revalidatePath('/')
  redirect('/firearms')
}

export async function deleteFirearm(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.firearm.delete({ where: { id } })
  revalidatePath('/firearms')
  revalidatePath('/')
}
