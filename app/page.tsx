import { createClient } from '@/lib/supabase/server'
import Card from "../components/card/card"

export default async function Page() {
  const today = new Date().toISOString().split('T')[0]
  const supabase = await createClient()

  const { data: guest_events, error } = await supabase.from('guest_events').select(`
    *,
    users(pseudo, insta, user_style(style_id, styles(name)))')
  `).gte('end_date', today)

  console.log('data:', guest_events)
  console.log('error:', error)

 return (
    <div>
      <h1>Les guest en cours et à venir</h1>
        <div className="grid grid-cols-6 gap-5">
          {guest_events?.map((event, index) => (
            <div key={index}>
                <Card event={event}/>
            </div>
          ))}

        </div>
    </div>

  )
}
