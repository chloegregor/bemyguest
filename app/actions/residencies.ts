'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from 'next/cache'


interface residency_form {
  user_id: string,
  shop_id: string,
  status: string
}

interface upsertResidency {
  id?: string,
  user_id: string,
  shop_id: string,
  status: string
}


export async function CreateResidency(form:residency_form){
  const supabase = await createClient()
  const {data, error} = await supabase.from('residencies').insert(form).select()
  return  data?.[0] ?? null

}

export async function GetResidencyShop(id:string){
    const supabase = await createClient()

      const {data, error} = await supabase.from('residencies').select('shop_id').eq('shop_id', id)
      if (error){
        throw new Error ('erreur de reseau')
      }
      return data[0]
}

export async function GetResidencyCity(id: string){
  const supabase = await createClient()

  const {data, error} = await supabase.from('residencies').select('city_id').eq('user_id', id)

      if (error){
        throw new Error ('erreur de reseau')
      }
      return data[0]
}

export async function GetPendingResidencies(shop_id: string){
  const supabase = await createClient()
  const {data} = await supabase.from('residencies').select('*, users(*)').eq('shop_id', shop_id).eq('status', 'pending')
  return data ?? null
}


export async function ValidateResidency(id:string, status: string , slug:string){
  const supabase = await createClient()

  if(status === 'validated'){
    const {data, error} =  await supabase.from('residencies').update({status: status}).eq("id", id)

  } else {
    const {data, error} =  await supabase.from('residencies').update({status: 'validated', shop_id: null}).eq("id", id)
  }
  revalidatePath(`/shop/${slug}`)
}


export async function upsertResidency(form:upsertResidency){
  const supabase = await createClient()
  const {data, error} = await supabase.from('residencies').upsert(form, {onConflict:'id'}).select()
  return data?.[0] ?? error

}
