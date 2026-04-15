import {createClient} from '@/lib/supabase/server'
import List from '@/components/filter/List'
import Link from 'next/link'
import { notFound, } from 'next/navigation'
import RadiusButton from '@/components/radius/button'

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



async function getNearByData(city: CityType){
  const supabase = await createClient()

  // Bounding box
  const latDelta = 50 / 111
  const lngDelta = 50 / (111 * Math.cos(city.lat * Math.PI / 180))

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
    supabase.from('guest_events').select('*, cities(*), shops(*), users(*, user_style(*, styles(*)))').in('city_id', cityIds).neq('city_id', city.id),
    supabase.from('shops').select('*, cities(*)').in('city_id', cityIds).neq('city_id', city.id),
    supabase.from('users').select('*, cities(*), user_style(*, styles(*)), shop:shop_id(*)').eq('role', 'artist').in('city_id', cityIds).neq('city_id', city.id)
  ])

  return {
    guests: g.data || [],
    shops: s.data || [],
    artists: a.data || []
  }
}


export default async function City ({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ radius?: string }>}) {
  const {city: city_params} = await params
  const {radius} = await searchParams
  const city_data = await getCity(city_params)
  const city_id = city_data.city.id
  const city_lat = city_data.city.lat
  const city_lng = city_data.city.lng
  const data = await getNearByData(city_data.city as CityType)
  console.log("neardata", data)
  const today = new Date().toISOString().split('T')[0]
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
    <div className="p-5 flex flex-col gap-5  ">
      <h1 className="text-[2em]">{`Résultats à proximité de ${cityname}`}</h1>
      <nav>
          <ul>
            <div className="flex gap-5">
              <li><Link href={`/${city_params}`}>Tout</Link></li>
              <li><Link href={`/${city_params}/guests`}>Guests</Link></li>
              <li><Link href={`/${city_params}/artists`}>Artistes</Link></li>
              <li><Link href={`/${city_params}/shops`}>Shops</Link></li>
            </div>
          </ul>
        </nav>
        <div className='flex flex-col'>
          <div className=" flex flex-col gap-5">
            <div className='flex gap-5'>
              <div className="flex-1">
                <h2 className="text-[1.5em]">Les derniers guests</h2>
                {data.guests.length > 10 ?
                <div className="flex gap-5  overflow-x-auto">
                  <List data={data.guests} type={"guests"}/>
                  <Link href={`/${cityname}/nearby/guests`}><p>Voir plus</p></Link>
                </div> : data.guests.length === 0 ?
                <div>
                  <p className="text-[0.8em] text-gray-500">Pas de guest référencé à proximité de {cityname} pour le moment.</p>
                </div> :
                <div className="flex gap-5  overflow-x-auto">
                  <List data={data.guests} type={"guests"}/>
                </div>
                }
              </div>
              <div className="flex-1">
                <h2 className="text-[1.5em]">Artistes à découvrir</h2>
                {data.artists.length > 0 ?
                  <div className="flex gap-5  overflow-x-auto">
                    <List data={data.artists} type={"artists"}/>
                  </div> :
                    <p className="text-[0.8em] text-gray-500">Pas d'artiste référencé à {cityname} pour le moment. Etendez la recherche pour decouvrir les artistes à proximités.</p>

                }
              </div>
            </div>
            <h2 className="text-[1.5em]">Les shops</h2>
            <div className="flex gap-5  overflow-x-auto">
              <List data={data.shops} type={"shops"}/>
            </div>
          </div>
        </div>
        <div>
          <RadiusButton/>
        </div>
      </div>
  )
}
