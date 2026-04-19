import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import Link from 'next/link'
import { notFound, } from 'next/navigation'
import RadiusButton from '@/components/radius/button'
import NavBar from '@/components/nav/navBar'

export const revalidate = 120

interface CityType {
  id: number
  city_name: string
  lat:number
  lng:number
}


async function getCity(city_slug: string){
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, city_name, lat, lng').eq('city_slug', city_slug)
  return {city: city?.[0] || [],}
}

async function getData(city_id: number){
  const supabase = await createClient()
  const [g, s, a] = await Promise.all([
    supabase.from('guest_events').select('*, cities(*), shops(*), users(*,user_style(*, styles(*)))').eq('city_id', city_id),
    supabase.from('shops').select('*, cities(*)').eq('city_id', city_id),
    supabase.from('users').select('*, cities(*), user_style(*, styles(*)), shop:shop_id(*)').eq('role', 'artist').eq('city_id', city_id)
  ] )

  return {
    guests: g.data || [],
    shops: s.data || [],
    artists: a.data || []
  }
}


async function getNearByData(city: CityType, radius: string){
  const supabase = await createClient()

  // Bounding box
  const latDelta = parseInt(radius) / 111
  const lngDelta = parseInt(radius) / (111 * Math.cos(city.lat * Math.PI / 180))

  // Villes dans le rayon
  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id')
    .gte('lat', city.lat - latDelta)
    .lte('lat', city.lat + latDelta)
    .gte('lng', city.lng - lngDelta)
    .lte('lng', city.lng + lngDelta)

  const cityIds = nearbyCities?.map(c => c.id) || []

  const [g, s, a] = await Promise.all([
    supabase.from('guest_events').select('*, cities(*), shops(*), users(*, user_style(*, styles(*)))').in('city_id', cityIds),
    supabase.from('shops').select('*, cities(*)').in('city_id', cityIds),
    supabase.from('users').select('*, cities(*), user_style(*, styles(*)), shop:shop_id(*)').eq('role', 'artist').in('city_id', cityIds)
  ])

  return {
    guests: g.data || [],
    shops: s.data || [],
    artists: a.data || []
  }
}




export default async function City ({ params, searchParams }: { params: Promise<{ city: string }>, searchParams:Promise<{radius: string}>}) {
  const {city: city_params} = await params
  const {radius} = await searchParams
  const city_data = await getCity(city_params)
  const city_id = city_data.city.id
  const data = radius ? await getNearByData(city_data.city as CityType, radius) : await getData(city_id)
  console.log("data", data)
  const today = new Date().toISOString().split('T')[0]
  const futur_events = data.guests?.filter((e) => e.end_date >= today)
  const past_events = data.guests?.filter((e) => e.end_date < today || !e.end_date)
  const cityname = city_data.city.city_name
  console.log("cityname", city_data)


  if (!data) {
    return (
      <p>erreur lors du chargement des données</p>
    )
  }

  if (!cityname){
    notFound()
  }




  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex gap-5">
        <h1 className="text-[2em]">{`Résultats pour ${cityname}`}</h1>
        <RadiusButton city={city_params}/>
      </div>
      <nav>
          <NavBar city={city_params} isnearby={false}/>
        </nav>
        {data.artists.length === 0 && data.shops.length === 0 && data.guests.length === 0 ?
          <div>
            <p>Aucun résultat à {cityname} pour le moment.</p>
          </div> :

        <div className='flex flex-col'>
          <div className=" flex flex-col gap-5">
            <div className='flex flex-col gap-5'>
              <div className="flex-1">
                <h2 className="text-[1.5em]">Les guests</h2>
                <div className="p-2 ">
                  {data.guests.length > 10 ?
                  <div className="flex gap-5  overflow-x-auto">
                    <List data={data.guests} type={"guests"}/>
                    <Link className="w-[200px] flex items-center" href={`/${city_params}/guests`}><p className="text-center">Voir plus</p></Link>
                  </div> : data.guests.length === 0 ?
                  <div>
                    <p className="text-[0.8em] text-gray-500">Pas de guest référencé à {cityname} pour le moment.</p>
                    <Link href={`/${cityname}/nearby/guests?radius=50`}><p >Voir plus</p>
                  </Link>
                  </div> :
                  <div className="flex gap-5  overflow-x-auto">
                    <List data={data.guests} type={"guests"}/>
                    <div className="flex items-center">
                      <Link className="w-[200px] p-1 h-fit border bg-white rounded-full" href={`/${city_params}/nearby/guests?radius=50`}><p className="text-center text-[0.8em]">Voir plus</p></Link>
                    </div>
                  </div>
                  }
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-[1.5em]">Artistes à découvrir</h2>
               {data.artists.length > 10 ?
                  <div className="flex gap-5 overflow-x-auto">
                    <List data={data.artists} type={"artists"}/>
                    <Link className="w-[200px] flex items-center" href={`/${city_params}/guests`}><p className="text-center">Voir plus</p></Link>
                  </div> : data.artists.length === 0 ?
                  <div>
                    <p className="text-[0.8em] text-gray-500">Pas d'artiste référencé à {cityname} pour le moment.</p>
                    <Link href={`/${city_params}/nearby/artists?radius=50`}><p >Voir plus</p>
                  </Link>
                  </div> :
                  <div className="flex gap-5  overflow-x-auto">
                    <List data={data.artists} type={"artists"}/>
                   <div className="flex items-center">
                      <Link className="w-[200px] p-1 h-fit border bg-white rounded-full" href={`/${city_params}/nearby/artists?radius=50`}><p className="text-center text-[0.8em]">Voir plus</p></Link>
                    </div>
                  </div>
                }
              </div>
            </div>
            <h2 className="text-[1.5em]">Les shops</h2>
            <div className="flex gap-5  overflow-x-auto">
              {data.shops.length > 10 ?
                  <div className="flex gap-5  overflow-x-auto">
                    <List data={data.shops} type={"shops"}/>
                    <Link className="w-[200px] flex items-center" href={`/${city_params}/guests`}><p className="text-center">Voir plus</p></Link>
                  </div>
                  : data.shops.length === 0 ?
                  <div>
                    <p className="text-[0.8em] text-gray-500">Pas de shop référencé à {cityname} pour le moment.</p>
                    <Link href={`/${cityname}/nearby/shops?radius=50`}><p >Voir plus</p>
                  </Link>
                  </div> :
                  <div className="flex gap-5 items-center  overflow-x-auto">
                    <List data={data.shops} type={"shops"}/>
                    <div className="flex items-center">
                      <Link className="w-[200px] p-1 h-fit border bg-white rounded-full" href={`/${city_params}/nearby/shops?radius=50`}><p className="text-center text-[0.8em]">Voir plus</p></Link>
                    </div>
                  </div>
                }
            </div>
          </div>
        </div>
        }

      </div>
  )
}
