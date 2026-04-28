
import {createClient} from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { GetUser } from '@/app/actions/users'
import Link from 'next/link'



export async function LogComponent(){
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const auth_id = user?.id
  const user_profile = auth_id ? await GetUser(auth_id) : null
  const user_id = user_profile?.id
  const user_slug = user_profile?.pseudo_slug
  const url = user_profile?.role === ''
  return(
    <div className="border flex items-top">
      {user_profile &&
      <>
      <div className="border">
        <Link href={``}><p>profil</p></Link>
      </div>
       <div className="border">
        <form action={logout}>
          <button type="submit">log out</button>
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
