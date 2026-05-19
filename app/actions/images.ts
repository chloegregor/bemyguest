'use server'
import { createClient } from "@/lib/supabase/server"



export async function CreateAvatar(url: string, id: string, type: string ){
  const supabase = await createClient()
  if (type === "shop"){
    const {data, error} = await supabase.from('shops').update({avatar: url}).eq('id', id).select('avatar')
    return data?.[0]

  }else{
    const {data, error} = await supabase.from('users').update({avatar: url}).eq('id', id).select()
    return data ?? error
  }

}
