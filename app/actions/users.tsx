"use server"
import { createClient } from "@/lib/supabase/server"


interface FormProps {
  auth_id : string
  pseudo?: string
  instagram?: string
  shop_id?: string
  owner_id?: string
}

export async function CreateAuthUser(email: string, password:string){
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.signUp({ email, password })
  return authData
}


export async function CreateUser(form:FormProps){
  const supabase = await createClient()
  const {data} = await supabase.from('users').insert(form).select()
  return data?.[0] ?? null
}
