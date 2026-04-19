import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import Link from 'next/link'
import NavBar from '@/components/nav/navBar'
import RadiusButton from '@/components/radius/button'


interface CityType {
  id: number
  city_name: string
  lat:number
  lng:number
}

async function getNearByShops(city: CityType, radius:string){
  const supabase = await createClient()

  const latDelta = parseInt(radius) / 111
  const lngDelta = parseInt(radius) / (111 * Math.cos(city.lat * Math.PI / 180))

  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id')
    .gte('lat', city.lat - latDelta)
    .lte('lat', city.lat + latDelta)
    .gte('lng', city.lng - lngDelta)
    .lte('lng', city.lng + lngDelta)

  const cityIds = nearbyCities?.map(c => c.id) || []

  const shops = supabase.from('shops').select('*, cities(*)').in('city_id', cityIds)


  return shops
}


export default async function Shops ({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ radius?: string }>}) {
  const {city: city_params} = await params
  const {radius} = await searchParams
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, lat, lng, city_name').eq('city_slug', city_params)
  const city_id = city?.[0]?.id
  const { data: shops} = await getNearByShops(city[0], radius)
  console.log("data city", city?.[0].lat)
  const cityname = city?.[0]?.city_name
  console.log(cityname)
  const ville = cityname ? cityname : city_params


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <div className="flex items-center gap-5 ">
        <div className="flex gap-5 items-center">
          <Link href={`/${city_params}`}><p>{`${cityname} >`}</p></Link>
          <h1 className="text-[1.8em]">{`Résultats à proximité de ${cityname}`}</h1>
        </div>
        <div className=''>
          <RadiusButton city={city_params} category={"shops"} />
        </div>
      </div>
      <nav>
      <NavBar city={city_params} isnearby={true}/>
      </nav>

      {shops?.length > 0 ?
      <div>
        <h2>{`Shops à proximité de ${ville}`}</h2>
        <div className="grid grid-cols-5 gap-5">
          <List data={shops} type={'shops'}/>
        </div>
      </div>
      :
      <p>Pas de résultat.</p>

    }
    </div>
  )
}
