import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import Card from "../../components/card/card"

export const revalidate = 120

export async function generateStaticParams() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )
  const {data: cities} = await supabase.from('unique_cities').select()

  return cities?.map((c) => ({city: c.city_slug})) ?? []

}

export default async function City ({ params }: { params: Promise<{ city: string }> }) {
  const {city} = await params
  console.log("city ok", city)
  const supabase = await createClient()
  const {data: events} = await supabase.from('guest_events').select('*, users(pseudo, insta, user_style(style_id, styles(name)))')
  .eq('city_slug', city)
  .order('end_date', { ascending: true })
  console.log("data", events)
  const today = new Date().toISOString().split('T')[0]
  const futur_events = events?.filter((e) => e.end_date >= today)
  const past_events = events?.filter((e) => e.end_date < today || !e.end_date)

  const cityName = events?.[0]?.city_name

  if (!events) {
    return (
      <p>erreur lors du chargement des données</p>
    )
  }
  if (events.length === 0) {
    return (
      <div>
        <div>
          <p>Pas de guest à {city} pour le moment </p>
        </div>
      </div>
    )
  }


  return (
    <div>
      <div>
        <p>{`resultats pour ${cityName}`}</p>
      </div>
      <div>
        <p>Guest à venir</p>
      </div>

      <div className='grid grid-cols-5 gap-10'>
      {futur_events?.map((event, index) => (
        <div key={index}>
          <Card event={event}/>
        </div>
      ))}
      </div>
      <div>
        <p>Guest passés</p>
      </div>
      <div className='grid grid-cols-5 gap-10'>
      {past_events?.map((event, index) => (
        <div key={index}>
          <Card event={event}/>
        </div>
      ))}
      </div>
    </div>
  )
}
