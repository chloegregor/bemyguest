import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import RadiusButton from '@/components/radius/button'
import NavBar from '@/components/nav/navBar'


interface CityType {
  id: number
  city_name: string
  lat:number
  lng:number
}



async function getData(city_id: number){
  const supabase = await createClient()
  const data = await supabase.from('shops').select('*, cities(*)').eq('city_id', city_id)


  return data
}


async function getNearByData(city: CityType, radius: string){
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

  const data = await
    supabase.from('shops').select('*, cities(*)').in('city_id', cityIds)


  return data
}



export default async  function Shops( { params, searchParams}: { params: Promise<{ city: string }>, searchParams: Promise<{ radius: string }> }){

  const {city: city_params} = await params
  const {radius} = await searchParams
  console.log("cityinartistspage", city_params)
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, lat, lng, city_name').eq('city_slug', city_params)
  const city_id = city?.[0]?.id
  const {data:shops} = radius ? await getNearByData(city[0] as CityType, radius) : await getData(city_id)
  console.log("data city", city?.[0].lat)
  const cityname = city?.[0]?.city_name
  console.log(cityname)
  const ville = cityname ? cityname : city_params


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <div className='flex gap-5'>
        <h1 className="text-[2em]">{`Résultats pour ${cityname}`}</h1>
        <RadiusButton city={city_params} category={"artists"}/>
      </div>
      <nav>
        <NavBar city={city_params} isnearby={false}/>
      </nav>
      {shops?.length > 0 ?
      <div>
        <h2>{`Shops à ${ville}`}</h2>
        <div className="grid grid-cols-5 gap-5">
          <List data={shops} type={'shops'}/>
        </div>
      </div>
      :
      <div>
        <p>Pas de shop référencé à {cityname} pour le moment.</p>
        <RadiusButton city={city_params} category={"shops"}/>

      </div>

    }
    </div>
  )
}
