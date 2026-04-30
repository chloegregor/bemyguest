import {createClient} from '@/lib/supabase/server'
import { GetParticulier } from '@/app/actions/users'


export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }){
  const {id: params_id} = await params
  const supabase = await createClient()
  const { data} = await supabase.auth.getClaims()
  const user = data?.claims
  const connected_user_id = user?.sub
  const particulier = await GetParticulier(params_id)
  const particulier_id = particulier?.auth_id
  const is_connected = connected_user_id === particulier_id

  return (
    <div></div>
  )
}
