import {createClient} from '@/lib/supabase/server'
import { GetParticulier } from '@/app/actions/users'


export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }){
  const {id: params_id} = await params
  const user = await GetParticulier(params_id)
  console.log(user)
  return (
    <p>bjr</p>
  )
}
