
import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import NavBar from '@/components/nav/navBar'
import RadiusButton from '@/components/radius/button'
import GetMore from '@/components/lists/getMore'


interface CityType {
  id: number
  city_name: string
  lat:number
  lng:number
}

async function getData(page: number, city_id: number){
  'use server'
  const supabase = await createClient()

  const limit = 15
  const from = (page - 1) * limit
  const to = from + limit - 1

  const {data, count} = await supabase.from('users').select('*, cities(*), user_style(*, styles(*)), shop:shop_id(*)', {count: "exact"}).eq('role', 'artist').eq('city_id', city_id).range(from, to)
  return {data: data,
          count: count
  }
}

async function getNearByData(page: number, city: CityType, radius: string){
  'use server'
  const supabase = await createClient()

  // Bounding box
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

  const limit = 15
  const from = (page - 1) * limit
  const to = from + limit - 1

  const {data, count} = await supabase.from('users').select('*, cities(*), user_style(*, styles(*)), shop:shop_id(*)',  {count: "exact"}).eq('role', 'artist').in('city_id', cityIds).range(from, to)


  return {data: data,
          count: count
  }
}


export default async  function Artists( { params, searchParams }: { params: Promise<{ country:string, city: string }>, searchParams: Promise<{ radius: string }> }){
  const {country, city: city_params} = await params
  const {radius} = await searchParams
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, city_name, country_name, lat, lng').eq('country_slug', country).eq('city_slug', city_params)
  const city_id = city[0]?.id
  const {data: artists, count} =  radius && radius != "0" ? await getNearByData(1, city[0] as CityType, radius) : await getData(1, city_id)
  console.log("count", count)
  const cityname = city?.[0]?.city_name
  const ville = cityname ? cityname : city


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <div className ='flex gap-5'>
        <h1 className="text-[2em]">{`Résultats pour ${cityname}`}</h1>
        <RadiusButton country={country} city={city_params} category={"artists"}/>
      </div>
      <nav>
        <NavBar country={country} city={city_params} />
      </nav>
      {artists.length > 0 ?
      <div>
        <h1>{`Artistes résidents à ${ville}`}</h1>
        <div className="grid grid-cols-5 gap-5">
          <List data={artists} type={'artists'}/>
        </div>
      </div>
      :
      <div>
        <p>Pas d'artiste référencé à {cityname} pour le moment.</p>
      </div>
    }
      <GetMore key={radius} category={"artists"} initial_data={artists} total={count} city_id={city_id} radius={radius} city={city[0]} data_function={radius && radius !="0" ? getNearByData : getData}  />
    </div>
  )
}
