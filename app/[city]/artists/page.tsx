import {createClient} from '@/lib/supabase/server'
import List from '@/components/filter/List'
import NavBar from '@/components/nav/navBar'
import RadiusButton from '@/components/radius/button'




export default async  function Artists( { params }: { params: Promise<{ city: string }> }){
  const {city: city_params} = await params
  const supabase = await createClient()
  const {data: city} = await supabase.from('cities').select('id, city_name').eq('city_slug', city_params)
  const city_id = city[0]?.id
  const {data:artists} =  await supabase.from('users').select('*, user_style(*, styles(*)), shop_id(*, cities(*))').eq('role', 'artist').eq('city_id', city_id).limit(20)
  console.log("data", artists)
  const cityname = city?.[0]?.city_name
  const ville = cityname ? cityname : city


  return (
    <div className="p-5 flex flex-col gap-5  ">
      <h1 className="text-[2em]">{`Résultats pour ${cityname}`}</h1>
      <nav>
        <NavBar city={city_params} isnearby={false}/>
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
        <RadiusButton city={city_params} category={"artists"}/>
      </div>
    }
    </div>
  )
}
