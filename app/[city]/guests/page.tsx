import {createClient} from '@/lib/supabase/server'
import List from '@/components/filter/List'
import Link from 'next/link'




export default async  function Artists( { params }: { params: Promise<{ city: string }> }){
  const {city} = await params
  console.log("cityinartistspage", city)
  const supabase = await createClient()
  const {data: city_id} = await supabase.from('cities').select('id').eq('city_slug', city)
  const trimed_id = city_id[0]?.id
  const {data: guests} =  await supabase.from('guest_events').select('*, cities(*), shops(*), users(*,user_style(*, styles(*)))').eq('city_id', trimed_id).limit(20)

  console.log("data", guests)
  const cityName = guests?.[0]?.city_name
  console.log(cityName)
  const ville = cityName ? cityName : city


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <nav>
        <ul>
          <div className="flex gap-5">
            <li><Link href={`/${city}`}>Tout</Link></li>
            <li><Link href={`/${city}/guests`}>Guests</Link></li>
            <li><Link href={`/${city}/artists`}>Artistes</Link></li>
            <li><Link href={`/${city}/shops`}>Shops</Link></li>
          </div>
        </ul>
      </nav>
      <h1>{`Les guests à ${ville}`}</h1>

      <div className="grid grid-cols-5 gap-5">
        <List data={guests} type={'guests'}/>
      </div>
    </div>
  )
}
