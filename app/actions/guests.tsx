'use server'

import { createClient } from "@/lib/supabase/server"
import { retrieveShop } from "./shops"
import { retrieveCity } from "./cites"
import { CreateUser } from "./users"

interface guestProps{
  user_id: string,
  shop_id?: string,
  city_id: number,
  start_date: string,
  end_date: string,
  status: string,
  created_by: string

}

interface FormProps{
  start_date: string,
  end_date: string,
  shop_id?: string,
  shop_name?: string | null,
  shop_slug?: string | null,
  shop_place_id?: string | null,
  city_place_id?: string | null,
  user_id?: string | null,
  email: string | null
  pseudo?: string
  city_id?: number

}



export async function CreateGuest(form: guestProps){

  const supabase = await createClient()

  const {data, error} = await supabase.from('guest_events').insert(form).select()
  console.log("erreur" , error ?? "")
  return data?.[0] ?? null

}


export async function handleForm(form: FormProps){

  if(!form.start_date || !form.end_date ){
    return {error: "champs date manquant."}
  }
  if(!form.user_id && !form.shop_id ){
    return {error: 'Erreur, veuillez réessayer.'}
  }

    const start_date = form.start_date
    const end_date = form.end_date
    let shop_id = form.shop_id
    let user_id = form.user_id
    const city_place_id = form.city_place_id
    let city_id = form.city_id
    let created_by = null


  if (form.user_id && form.shop_name && form.shop_slug && form.shop_place_id ){

    try{
      const result = await retrieveShop(form.shop_slug, form.shop_place_id, form.shop_name, form.email ?? undefined)

      if(!result){
        return{error: "erreur lors de l'association avec le shop"}
      }
      if (result.error){
        return {error: result.error}
      }
      if (result.shop){
        shop_id = result.shop.id
        city_id = result.shop.city_id
      }
    }catch(err){
      return {error: err instanceof Error ? err.message : 'Erreur inconnue'}
    }
  } if (user_id && city_place_id){
    try {
      const city = await retrieveCity(city_place_id)
      if (!city){
        return   {error: "erreur lors de l'association avec la ville"}
      }
      shop_id = undefined
      city_id = city.id
    } catch(err){
      return {error: err instanceof Error ? err.message : "erreur inconnue"}
    }
  }
  created_by = 'artist'
  if(form.shop_id && form.city_id){


   if (!form.start_date || !form.end_date || !form.email ){
      return {error: 'champs obligatoires manquants'}
   }else{
    const formCreateUser = {
      email: form.email,
      role: "artist",
      pseudo: form.pseudo,
      status: 'pending'
    }
    const artist = await CreateUser(formCreateUser)
    console.log("artiste crée", artist)
    if(!artist){
      return {error: "erreur à la création de l'artiste"}
    }else{
      user_id = artist.id
      created_by = 'shop'

    }
   }

  }

  const create_form = {
    user_id : user_id as string,
    shop_id: shop_id,
    city_id: city_id!,
    end_date: end_date,
    start_date: start_date,
    created_by: created_by,
    status: "pending"


  }

  const new_guest = await CreateGuest(create_form)
  if (!new_guest){
    return {error: "une erreur s'est produite."}
  }
  return {success: true}

}
