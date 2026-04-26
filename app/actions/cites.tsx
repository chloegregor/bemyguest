"use server"
import { createClient } from "@/lib/supabase/server"
import { geocodePlaceId } from "./geocoder"

type cityForm = {
  city_name: string,
  city_slug: string,
  city_id: string,
  lng: number,
  lat: number,
  city_name_en: string,
  country_slug: string,
  country: string,
  country_name_en: string
}

export async function getCity(id:string){
  const supabase =  await createClient()
  const {data} = await supabase.from('cities').select('id, city_slug, country_slug').eq('city_id', id)

  return data?.[0] ?? null
}

export async function createCity(form: cityForm){
  const supabase= await createClient()
  const {data} = await supabase.from('cities').insert({city_name: form.city_name, city_name_en:form.city_name_en, city_slug: form.city_slug, city_id: form.city_id, lng: form.lng, lat: form.lat, country_name: form.country, country_name_en: form.country_name_en, country_slug:form.country_slug}).select()
  return data?.[0] ?? null
}


export async function retrieveCity( placeId:string){

  const data =  await getCity(placeId)

  if (data) {
    return data
  }

  if (!data){

    const results = await geocodePlaceId(placeId)
    if (!results){
      throw new Error ("erreur de geocoding")
    }
    const {fr, en} = results
    
    const dptFr = fr.address_components.find((a) => a.types.includes('administrative_area_level_2')).short_name
    const city_name = fr.address_components.find((a) => a.types.includes('locality')).short_name
    const city_name_en = en.address_components.find((a) => a.types.includes('locality')).short_name
    const city_slug = `${city_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').trim()}_${dptFr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').trim()}`
    const lng = fr.geometry.location.lng
    const lat = fr.geometry.location.lat
    const country = fr.address_components.find((a) => a.types.includes('country')).long_name
    const country_en = en.address_components.find((a) => a.types.includes('country')).long_name
    const country_slug = en.address_components.find((a) => a.types.includes('country')).short_name.toLowerCase()

    const city_form = {
      city_name : city_name,
      city_name_en: city_name_en,
      city_slug: city_slug,
      city_id: placeId,
      lat: lat,
      lng: lng,
      country: country,
      country_name_en: country_en,
      country_slug: country_slug
    }

    const created_city = await createCity(city_form)
    if (!created_city){
      throw new Error ("erreur a la creation de la ville en base de donnée")
    }
    return created_city

  }
}
