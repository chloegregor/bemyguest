
import {createClient} from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { getShopSlugByOwner } from '@/app/actions/shops'
import { GetUser } from '@/app/actions/users'
import Link from 'next/link'



export async function LogComponent(){
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const auth_id = user?.id
  const user_profile = auth_id ? await GetUser(auth_id) : null
  const user_profile_id = user_profile?.id
  const role = user_profile?.role
  let shop_slug = ""
  let url = ""
  if(role === 'shop'){
    const shop = await getShopSlugByOwner(user_profile_id)
    if (!shop){
      return
    }
    shop_slug = shop


  }
  const user_slug = user_profile?.pseudo_slug
  url = role === 'artist' ? `/artist/${user_slug}` : role === 'particulier' ? `/dashboard/${user_slug}` : role === 'shop' ? `/shop/${shop_slug}` :"/"
  return(
    <div className="border flex items-top">
      {user_profile &&
      <>
      <div className="border">
        <Link href={url}><p>profil</p></Link>
      </div>
       <div className="border">
        <form action={logout}>
          <button className="cursor-pointer" type="submit">log out</button>
        </form>
      </div>
      </>
      }
      {!user_profile &&
        <div className="border">
          <Link href="/login">log in</Link>
        </div>
      }
    </div>
  )
}
