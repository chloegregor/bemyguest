import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import NavBar from '@/components/nav/navBar'
import GetMore from '@/components/lists/getMore'


export const revalidate = 120




async function getGuests(page: number, city_id?: number){
  'use server'
  const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]
  const limit = 15
  const from = (page - 1) * limit
  const to = from + limit - 1

  const {data, count} = await supabase.from ('guest_events').select(`*, users(pseudo, pseudo_slug, insta, user_style(style_id, styles(name))),shops(*), cities(*)`, {count: "exact"}).eq('status', 'validated').gte('end_date', today).range(from, to)
    return {data: data, count:count}
}

export default async function ArtistPage(){

  const {data: guests, count } = await getGuests(1, undefined)

  return(
    <div className='p-5 flex flex-col gap-5'>
      <div>
        <NavBar/>
      </div>
      <h1 className="text-[2em]">Tous les guests</h1>
      {guests && guests.length > 0 ?
        <div className="grid grid-cols-5 gap-5">
          <List data={guests} type={"guests"}/>
        </div> :
        <p></p>
        }
        <GetMore key={"artists"} category={"artists"} initial_data={guests} total={count} data_function={getGuests}/>
    </div>
  )
}
