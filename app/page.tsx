import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import NavBar from '@/components/nav/navBar'
export const revalidate = 120

type PageProps = {
  searchParams: Promise<{ filter?: string }>
}

async function getData(param: string){
  const today = new Date().toISOString().split('T')[0]
  const supabase = await createClient()

  const [g, a, s] = await Promise.all([
    supabase.from ('guest_events').select(`*,users(pseudo, pseudo_slug, insta, user_style(style_id, styles(name))),shops(*), cities(*)`).gte('end_date', today).eq('status', "validated").limit(10),
    supabase.from ('users').select('*, shop:shop_id(*), cities(*)').eq('role', 'artist').eq('status', "validated").limit(10),
    supabase.from ('shops').select('*, cities(*)').limit(10)
  ] )
  console.log(a.error)
  return { guests : g.data || [],
          artists: a.data || [],
          shops: s.data || []
  }
}
export default async function Page({searchParams}: PageProps) {
  const {filter} = await searchParams
  console.log("filter", filter)
  const data = await getData(filter as string)

 return (
      <div className='p-5 flex flex-col gap-5' >
        <div>
          <NavBar/>
        </div>
        <div className=" flex flex-col gap-5">
          <h2 className="text-[2em]">Les derniers guests</h2>
          <div className="flex gap-5  overflow-x-auto">
            <List data={data.guests} type={"guests"}/>
          </div>
          <h2 className="text-[2em]">Artistes à découvrir</h2>
          <div className="flex gap-5  overflow-x-auto">
            <List data={data.artists} type={"artists"}/>
          </div>
          <h2 className="text-[2em]">Les shops</h2>
          <div className="flex gap-5 overflow-x-auto">
            <List data={data.shops} type={"shops"}/>
          </div>

        </div>
      </div>



  )
}
