import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import NavBar from '@/components/nav/navBar'
import GetMore from '@/components/lists/getMore'


export const revalidate = 120




async function getShops(page: number, city_id?: number){
  'use server'
  const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]
  const limit = 15
  const from = (page - 1) * limit
  const to = from + limit - 1

  const {data, count} = await supabase.from ('shops').select('*, cities(*)', {count: "exact"}).range(from, to)
    return {data: data, count:count}
}

export default async function ArtistPage(){

  const {data: shops, count } = await getShops(1, undefined)

  return(
    <div className='p-5 flex flex-col gap-5'>
      <div>
        <NavBar/>
      </div>
      <h1 className="text-[2em]">Tous les shops</h1>
      {shops && shops.length > 0 ?
        <div className="grid grid-cols-5 gap-5">
          <List data={shops} type={"shops"}/>
        </div> :
        <p></p>
        }
        <GetMore key={"artists"} category={"artists"} initial_data={shops} total={count} data_function={getShops}/>
    </div>
  )
}
