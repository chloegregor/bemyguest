import {createClient} from '@/lib/supabase/server'
import List from '@/components/filter/List'
import Link from 'next/link'





export default async  function Shops( { params }: { params: Promise<{ city: string }> }){

  const {city: city_params} = await params
  console.log("cityinartistspage", city_params)
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, lat, lng, city_name').eq('city_slug', city_params)
  const city_id = city?.[0]?.id
  const {data:shops} = await supabase.from ('shops').select('*, cities(*)').eq('city_id', city_id).limit(20)
  console.log("data city", city?.[0].lat)
  const cityName = city?.[0]?.city_name
  console.log(cityName)
  const ville = cityName ? cityName : city_params


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <h1 className="text-[2em]">{}</h1>
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
      <h2>{`Artistes résidents à ${ville}`}</h2>
      <div className="grid grid-cols-5 gap-5">
        <List data={shops} type={'shops'}/>
      </div>
    </div>
  )
}
