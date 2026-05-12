'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from 'next/cache'


interface residency_form {
  user_id: string,
  shop_id: string,
  status: string
}


export async function CreateResidency(form:residency_form){
  const supabase = await createClient()
  const {data, error} = await supabase.from('residencies').insert(form).select()
  return  data?.[0] ?? null

}


export async function GetClientResidency(shop_id: string){
  const supabase = await createClient()
  const {data, error} = await supabase.from('residencies').select('*, users(*)').eq('shop_id', shop_id).eq('status', 'pending')
  return data ?? null
}


export async function ValidateResidency(id:string, status: string , slug:string){
  const supabase = await createClient()
  const {data, error} =  await supabase.from('residencies').update({status: status}).eq("id", id)
  revalidatePath(`/shop/${slug}`)
}
