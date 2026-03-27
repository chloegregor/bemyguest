import {createClient} from '@/lib/supabase/server'
import GuestsList from '@/components/filter/guestsList'
import ArtistsList from '@/components/filter/artistsList'
import ShopsList from '@/components/filter/shopsList'
import Link from 'next/link'
export const revalidate = 120

type PageProps = {
  searchParams: Promise<{ filter?: string }>
}

async function getData(param: string){
  const today = new Date().toISOString().split('T')[0]
  const supabase = await createClient()
  if(param === "guests") {
    const {data} = await supabase.from ('guest_events').select(`*,users(pseudo, insta, user_style(style_id, styles(name))),shop_id(*)`).gte('end_date', today)
    return data
  }
  if (param === "artists"){
    const {data} = await supabase.from ('users').select('*, user_style(*, styles(*)), shop_id(*)').eq('role', 'artist')
    return data
  }

  if (param === "shops"){
    const {data} = await supabase.from ('shops').select()
    return data
  }

  const [g, a, s] = await Promise.all([
    supabase.from ('guest_events').select(`*,users(pseudo, insta, user_style(style_id, styles(name))),shops(*)`).gte('end_date', today).limit(10),
    supabase.from ('users').select().eq('role', 'artist').limit(10),
    supabase.from ('shops').select().limit(10)
  ] )
  return {guests :g.data || [],
          artists: a.data || [],
          shops: s.data || []
  }
}
export default async function Page({searchParams}: PageProps) {
  const {filter} = await searchParams
  console.log("params in console", filter)

  const data = await getData(filter as string)
  console.log("supa data", data)

 return (
    <div>
      <nav>
        <ul>
          <div className="flex justify-between">
            <li><Link href="/?filter=guests">Guests</Link></li>
            <li><Link href="/?filter=artists">Artistes</Link></li>
            <li><Link href="/?filter=shops">Shops</Link></li>
          </div>
        </ul>
      </nav>
        <div className="grid grid-cols-6 gap-5">
          {filter === 'guests' &&
            <GuestsList data={data}/>}
          {filter === 'artists' &&
            <ArtistsList data={data}/>}
          {filter === 'shops' &&
            <ShopsList data={data}/>}

        </div>
    </div>

  )
}
