import {createClient} from '@/lib/supabase/server'
import List from '@/components/filter/List'
import RadiusButton from '@/components/radius/button'
import NavBar from '@/components/nav/navBar'





export default async  function Shops( { params }: { params: Promise<{ city: string }> }){

  const {city: city_params} = await params
  console.log("cityinartistspage", city_params)
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, lat, lng, city_name').eq('city_slug', city_params)
  const city_id = city?.[0]?.id
  const {data:shops} = await supabase.from ('shops').select('*, cities(*)').eq('city_id', city_id).limit(20)
  console.log("data city", city?.[0].lat)
  const cityname = city?.[0]?.city_name
  console.log(cityname)
  const ville = cityname ? cityname : city_params


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <h1 className="text-[2em]">{`Résultats pour ${cityname}`}</h1>
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
