'use server'

import { createClient } from "@/lib/supabase/server"
import { retrieveShop } from "./shops"
import { retrieveCity } from "./cites"

interface guestProps{
  user_id: string,
  shop_id: string | null,
  city_id: string,
  start_date: string,
  end_date: string

}

interface FormProps{
  start_date: string,
  end_date: string,
  shop_id: string | null,
  shop_name: string | null,
  shop_slug: string | null,
  shop_place_id: string | null,
  city_place_id: string | null,
  user_id: string | null,
  email: string | null

}

export async function CreateGuest(form: guestProps){

  const supabase = await createClient()

  const {data, error} = await supabase.from('guest_events').insert({user_id: form.user_id, shop_id: form.shop_id, city_id: form.city_id, start_date: form.start_date, end_date: form.end_date}).select()
  console.log("erreur" , error ?? "")
  return data?.[0] ?? null

}


export async function handleForm(form: FormProps){

  if(!form.start_date || !form.end_date ){
    return {error: "champs date manquant."}
  }
  if(!form.user_id && !form.shop_id){
    return {error: 'Erreur, veuillez réessayer.'}
  }

    const start_date = form.start_date
    const end_date = form.end_date
    let shop_id = form.shop_id
    const user_id = form.user_id
    const city_place_id = form.city_place_id
    let city_id = null

  if (form.user_id && form.shop_name && form.shop_slug && form.shop_place_id ){

    try{
      const shop = await retrieveShop(form.shop_slug, form.shop_place_id, form.shop_name)
      if(!shop){
        return{error: "erreur lors de l'association avec le shop"}
      }
      shop_id = shop.id
      city_id = shop.city_id
    }catch(err){
      return {error: err instanceof Error ? err.message : 'Erreur inconnue'}
    }
  } if (user_id && city_place_id){
    try {
      const city = await retrieveCity(city_place_id)
      if (!city){
        return   {error: "erreur lors de l'association avec la ville"}
      }
      shop_id = null
      city_id = city.id
    } catch(err){
      return {error: err instanceof Error ? err.message : "erreur inconnue"}
    }
  }

  if(form.shop_id){
    shop_id = form.shop_id
    // a finir
  }

  const create_form = {
    user_id : user_id as string,
    shop_id: shop_id,
    city_id: city_id,
    end_date: end_date,
    start_date: start_date


  }

  const new_guest = await CreateGuest(create_form)
  if (!new_guest){
    return {error: "une erreur s'est produite."}
  }
  return {success: true}

}
