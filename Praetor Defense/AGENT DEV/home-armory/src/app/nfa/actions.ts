'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addNfaItem(formData: FormData) {
  const formType = formData.get('formType') as string
  const controlNumber = formData.get('controlNumber') as string || null
  
  const submissionDateRaw = formData.get('submissionDate') as string
  const submissionDate = submissionDateRaw ? new Date(submissionDateRaw) : null
  
  const fingerprintsSentRaw = formData.get('fingerprintsSent') as string
  const fingerprintsSent = fingerprintsSentRaw ? new Date(fingerprintsSentRaw) : null
  
  const status = formData.get('status') as string
  
  const taxStampCostRaw = formData.get('taxStampCost') as string
  const taxStampCost = taxStampCostRaw ? parseFloat(taxStampCostRaw) : 200.00
  
  const notes = formData.get('notes') as string || null

  const firearmId = (formData.get('firearmId') as string) || null
  const accessoryId = (formData.get('accessoryId') as string) || null

  await prisma.nfaItem.create({
    data: {
      formType,
      controlNumber,
      submissionDate,
      fingerprintsSent,
      status,
      taxStampCost,
      notes,
      firearmId,
      accessoryId
    }
  })

  revalidatePath('/nfa')
  revalidatePath('/')
  redirect('/nfa')
}

export async function updateNfaStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  
  const updateData: any = { status }
  if (status === 'Approved') {
    updateData.approvedDate = new Date()
  }

  await prisma.nfaItem.update({
    where: { id },
    data: updateData
  })
  
  revalidatePath('/nfa')
  revalidatePath('/')
}

export async function deleteNfaItem(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.nfaItem.delete({ where: { id } })
  revalidatePath('/nfa')
  revalidatePath('/')
}
