"use server"
import { createClient } from "@/lib/supabase/server"
import { geocodeAddress, geocodePlaceId } from "./geocoder"
import { getCity, createCity } from "./cites"

type shopForm = {
  shop_name: string,
  shop_slug: string,
  owner_id?: number,
  shop_place_id: string,
  city_id: number
}


export async function getShop(id:string){
  const supabase = await createClient()
  const {data} = await supabase.from('shops').select('*').eq('shop_place_id', id)
  return data?.[0] ?? null
}

export async function getShopSlugByOwner(id: string){
  const supabase = await createClient()
  const {data} = await supabase.from('shops').select('shop_slug').eq('owner_id', id)
  return data?.[0].shop_slug ?? null
}


export async function createShop(form: shopForm){
  const supabase = await createClient()
  const {data} = await supabase.from('shops').insert({shop_name: form.shop_name, shop_slug:form.shop_slug, shop_place_id: form.shop_place_id, city_id: form.city_id, owner_id: form.owner_id}).select()
  return data?.[0] ?? null

}


export async function UpdateShop(id:string, owner_id:string){
  const supabase = await createClient()
  const {data} = await supabase.from('shops').update({owner_id: owner_id}).eq('id', id).select()
  return data?.[0] ?? null
}

export async function retrieveShop(nameSlug:string, placeId:string, name:string){

  const data =  await getShop(placeId)

  if (data) {
    return data
  }

  if (!data){

      const results = await geocodePlaceId(placeId)
      if (!results){
        throw new Error("erreur de geogocing")
      }
      const {fr, en} = results
      const city_name = fr.address_components.find((a) => a.types.includes('locality')).short_name
      const place_id = await geocodeAddress(city_name)
      if (!place_id) {
        throw new Error("erreur de geogocing")
      }
      const data = await getCity(place_id)

      if(!data) {
        const dptFr = fr.address_components.find((a) => a.types.includes('administrative_area_level_2')).short_name
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
          throw new Error ("erreur lors de la création de la ville en base de donnée")
        }

        const shop_form = {
          city_id : created_city.id,
          shop_name : name,
          shop_slug: nameSlug,
          shop_place_id: placeId
        }

        const shop  = await createShop(shop_form)
        if (!shop) {
          throw new Error ("erreur lors de la création du shop en base de donnée")
        }
        return shop
      }

      if (data) {
        const shop_form = {
           city_id : data.id,
            shop_place_id : placeId,
            shop_name : name,
            shop_slug : nameSlug
        }

        const shop  = await createShop(shop_form)
        if (!shop) {
          throw new Error ('erreur lors de la création du shop en base de donnée')
        }
        return shop

      }

  }
}
