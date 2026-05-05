"use server"
import { createClient } from "@/lib/supabase/server"


interface FormProps {
  auth_id?: string
  role: string
  email: string
  pseudo?: string | null
  pseudo_slug?: string | null
  insta?: string | null
  shop_id?: string | null
  city_id?: number | null
  status?: string
}


export async function CreateUser(form:FormProps){
  const supabase = await createClient()
  const {data, } = await supabase.from('users').insert(form).select()
  return data?.[0] ?? null
}


export async function GetUser(auth_id: string){
  const supabase = await createClient()
  const {data: profile} =  await supabase.from ('users').select('*, shop:shop_id(*), cities(*)').eq('auth_id', auth_id)
  return profile?.[0] ?? null

}


export async function GetParticulier(id: string){
  const supabase = await createClient()
  const {data:profile, error} = await supabase.from('users').select('*').eq('role', 'particulier').eq('pseudo_slug', id)
  return profile?.[0] ?? error
}
