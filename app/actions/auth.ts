'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SingUpData } from '@/types'
import { retrieveShop, UpdateShop } from './shops'
import { retrieveCity } from './cites'
import { CreateUser } from './users'
import { CreateResidency } from './residencies'


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
      console.log("owner email", data.owner_email)
      const result = await retrieveShop(data.shopSlug, data.shopPlaceId, data.shopName, data.owner_email)
      if (!result){
        return  {error: 'erreur a la récupération du shop'}
      }
      if (result.error){
        console.log("une erreur oui")
        return {error:result.error}

      }
      if (!result.shop) {
        return {error: "erreur lors de la récupération du shop"}
      }else{
          shop_id = result.shop.id
          city_id = result.shop.city_id
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
        insta : data.role === "artist" ? data.insta : null,
      }

      const new_user = await CreateUser(user_data)
      if (!new_user) {

        return {error: "erreur lors de la creation du profil"}
      }


      if ( data.role === "artist"){

        const residency_form = {
          user_id : new_user.id,
          shop_id : shop_id,
          city_id:city_id,
          status: "pending"
        }

        const new_residency = await CreateResidency(residency_form)
        console.log(new_residency)
        if (!new_residency){
          return {error: "erreur lors de la création du lien etre le user et le shop"}
        }
      }




      if (data.role === "shop" && data.shopSlug && data.shopName && data.shopPlaceId ){
        const shop = await retrieveShop(data.shopSlug, data.shopPlaceId, data.shopName, data.email)

        if (!shop){
          return {error: "erreur lors de la récupération du shop"}
        }
        const update_form = {
          owner_id: new_user.id,
          shop_id: shop.shop.id,
          owner_email: new_user.email,
          insta: data.insta

        }

        const updated_shop = await UpdateShop(update_form)


        if(!updated_shop){
          return {error: "erreur lors de l'association du profil au shop"}
        }

        return {redirect:`/shop/${shop.shop.shop_slug}`}

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
