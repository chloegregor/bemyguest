'use client'
import { createClient } from '@/lib/supabase/client'
import GooglePlace from "../google/googlePlace"
import  {useState} from 'react'
import { useRouter } from 'next/navigation'

export default function Form() {
  const router = useRouter()
  const [citySlug, setCitySlug] = useState('')
  console.log("ville", citySlug)

  const  handleClick = async (city) => {
    console.log("ville recue", city)
    const supabase = createClient()
    const { data: event_in_db, error } =  await supabase.from('guest_events').select('city_slug').eq('city_slug', city)

    console.log("villedb",event_in_db )
    router.push(`/${city}`)


  }

  return (
    <div className='flex gap-2'>
      <GooglePlace setCity={setCitySlug}></GooglePlace>
      <button onClick={() => handleClick(citySlug)}>rechercher</button>
    </div>
  )
}
