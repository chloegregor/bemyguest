"use server"
import { createClient } from "@/lib/supabase/server"
import { retrieveShop } from "./shops"
import { retrieveCity } from "./cites"
import { upsertResidency, GetResidencyShop, GetResidencyCity } from "./residencies"
import Form from "@/components/searchForm/form/formCity"


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


interface FormEditArtistProps {
  id: string,
  role: string
  pseudo: string
  insta?: string
  pseudo_slug: string
  avatar: string |null


}

interface handleEditArtistProps {
  id:string
  pseudo: string,
  avatar: string | null
  resident: boolean
  residency_id?: string
  instagram?: string
  pseudoSlug: string
  shopPlaceId?: string | null
  shopName?: string | null
  shopSlug?: string | null
  cityPlaceId?:string | null
  owner_email?:string
}


export async function CreateUser(form:FormProps){
  const supabase = await createClient()
  const {data } = await supabase.from('users').insert(form).select()
  return data?.[0] ?? null
}

export async function UpsertUser(form:FormProps){
  const supabase = await createClient()
  const {data, error} = await supabase.from('users').upsert(form, {onConflict:'email'}).select().single()
  return data ?? error

}

export async function GetUser(auth_id: string){
  const supabase = await createClient()
  const {data: profile} =  await supabase.from ('users').select('*, residencies(*, shops(*), cities(*))').eq('auth_id', auth_id)
  return profile?.[0] ?? null

}

export async function GetUserBySlug(slug: string){
  const supabase = await createClient()
  const {data} = await supabase.from ('users').select('*, user_style(*, styles(*)), residencies(*, cities(*), shops(*)), guest_events(*, shop_id(*), city_id(*))').eq('role', 'artist').eq('pseudo_slug', slug)
  return data?.[0] ?? null
}

export async function GetParticulier(id: string){
  const supabase = await createClient()
  const {data:profile, error} = await supabase.from('users').select('*').eq('role', 'particulier').eq('pseudo_slug', id)
  return profile?.[0] ?? error
}


export async function findUser(email:string){
  const supabase = await createClient()
  const {data} = await supabase.from('users').select('id').eq('role', "artist").eq('email', email)
  return data?.[0] ?? null

}


export async function handleArtistForm(data : handleEditArtistProps){

  let shop_id = null
  let city_id = null

  try {

    if ( !data.pseudo && !(data.cityPlaceId || data.shopPlaceId)){

      return {error: "Champ obligatoire manquant"}
    }

    if (data.resident && data.shopSlug && data.shopName && data.shopPlaceId) {
      const result = await retrieveShop(data.shopSlug, data.shopPlaceId, data.shopName, data.owner_email )
      if (!result){
        return  {error: 'erreur a la récupération du shop'}
      }
      if (result.error){
        return {error:result.error}

      }
      if (!result.shop) {
        return {error: "erreur lors de la récupération du shop"}
      }else{
          shop_id = result.shop.id
          city_id = result.shop.city_id
      }

    }
    if (!data.resident && data.cityPlaceId){
      const city = await retrieveCity(data.cityPlaceId)
      if (!city){
        return {error: "erreur lors de la récupération de la ville"}
      }
      city_id = city.id

    }

      const user_data: FormEditArtistProps = {
        role: "artist",
        id: data.id,
        pseudo: data.pseudo,
        pseudo_slug: data.pseudoSlug,
        insta : data.instagram,
        avatar: data.avatar
      }

      const updated_user = await EditArtist(user_data)

      if (updated_user.error) {
        return {error: "erreur lors de la creation du profil"}
      }

        if(shop_id){
          const present_shop_id = await GetResidencyShop(updated_user.id)
          console.log("present shop", present_shop_id)

          if (present_shop_id?.shop_id === shop_id){
            return {success: 'ok', slug: updated_user.pseudo_slug}
          }

          const residency_form = {
            id: data.residency_id,
            user_id : updated_user.id,
            shop_id : shop_id,
            status: "pending",
            city_id: city_id
          }

          const updated_residency = await upsertResidency(residency_form)
          console.log(updated_residency)
          if (!updated_residency){
            return {error: "erreur lors de la création du lien etre le user et le shop"}
          }

        } else {
          const residency_form = {
            id: data.residency_id,
            user_id : updated_user.id,
            shop_id : shop_id,
            status: "validated",
            city_id: city_id
          }
           const updated_residency = await upsertResidency(residency_form)
          console.log(updated_residency)
          if (!updated_residency){
            return {error: "erreur lors de la création du lien etre le user et le shop"}
          }
        }


      return {success: 'ok', slug: updated_user.pseudo_slug}
  } catch (err){
    return {error: err instanceof Error ? err.message : "erreur inconnie"}
  }

}


export async function EditArtist(form: FormEditArtistProps){
  const supabase = await createClient()
  const {data, error} = await supabase.from('users').update(form).eq('id', form.id).select()
  return data?.[0] ?? error

}
