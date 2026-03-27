import { createClient } from '@/lib/supabase/client'
import Card from "../../components/card/guestCard"

export const revalidate = 120


export default async function City ({ params }: { params: Promise<{ city: string }> }) {
  const {city} = await params
  console.log("city ok", city)
  const supabase = createClient()
  const {data: events} = await supabase.from('shops').select('*, users(pseudo, insta, user_style(style_id, styles(name)))')
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
      <div className="flex">
        <p>Guest à venir</p>
        <p>Artistes et shops résidants</p>
      </div>

      <div className='grid grid-cols-5 gap-10'>
      {futur_events?.map((event, index) => (
        <div key={index}>
          <Card event={event} />
        </div>
      ))}
      </div>
      <div>
        <p>Guest passés</p>
      </div>
      <div className='grid grid-cols-5 gap-10'>
      {past_events?.map((event, index) => (
        <div key={index}>
          <Card event={event} />
        </div>
      ))}
      </div>
    </div>
  )
}
