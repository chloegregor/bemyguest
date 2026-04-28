'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SingUpData } from '@/types'
import { retrieveShop, UpdateShop } from './shops'
import { retrieveCity } from './cites'
import { CreateUser } from './users'


export async function CreateAuthUser(email: string, password:string){
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.signUp({ email, password })
  return authData
}


export async function LogIn(email: string, password:string){
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({email: email, password: password})

  if (error){
    return {error: error.message}
  }
  redirect('/')
}
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}



export async function SingUp(data: SingUpData): Promise<{error?: string, redirect?: string}> {

  try{
    let shop_id = null
    let city_id = null

    if (!data.role || !data.email || !data.password){

      return {error: "Champ obligatoire manquant"}
    }

    if (data.role === "artist" && data.resident && data.shopSlug && data.shopName && data.shopPlaceId) {
      const shop = await retrieveShop(data.shopSlug, data.shopPlaceId, data.shopName)
      if (!shop) {
        return {error: "erreur lors de la récupération du shop"}
      }else{

          shop_id = shop.id
          city_id = shop.city_id
      }

    }
    if (data.role === "artist" && !data.resident && data.cityPlaceId){
      const city = await retrieveCity(data.cityPlaceId)
      if (!city){
        return {error: "erreur lors de la récupération de la ville"}
      }
      city_id = city.id

    }

      const {user} = await CreateAuthUser(data.email, data.password)

      if (!user){

        return {error: "erreur lors de la creation du user"}
      }
      const auth_id = user.id
      const user_data = {
        auth_id: auth_id,
        email: data.email,
        role: data.role,
        pseudo: data.pseudo,
        pseudo_slug: data.role === "particulier" ? auth_id.slice(0, 7) : data.pseudoSlug,
        insta : data.insta,
        shop_id: shop_id,
        city_id: city_id
      }
      const new_user = await CreateUser(user_data)
      if (!new_user) {

        return {error: "erreur lors de la creation du profil"}
      }

      if (data.role === "shop" && data.shopSlug && data.shopName && data.shopPlaceId ){
        const shop = await retrieveShop(data.shopSlug, data.shopPlaceId, data.shopName)

        if (!shop){
          return {error: "erreur lors de la récupération du shop"}
        }
        const owner_id = new_user.id
        const shop_id = shop.id
        const updated_shop = await UpdateShop(shop_id, owner_id)
        if(!updated_shop){
          return {error: "erreur lors de l'association du profil au shop"}
        }

        return {redirect:`/shop/${shop.shop_slug}`}

      }


      if (data.role === "artist"){
        return {redirect:`/artist/${new_user.pseudo_slug}`}
      }

      if (data.role ==='particulier'){
        return {redirect: `/dashboard/${new_user.pseudo_slug}`}
      }

      return {error: "rôle inconnu"}

  } catch (err) {
    return {error: err instanceof Error ? err.message : "erreur inconnue"}
  }
}
