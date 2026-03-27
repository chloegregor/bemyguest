'use client'
import { createClient } from '@/lib/supabase/client'
import GooglePlace from "../google/googlePlace"
import  {useState} from 'react'
import { useRouter } from 'next/navigation'

export default function Form() {
  const router = useRouter()
  const [citySlug, setCitySlug] = useState('')
  const [style, setStyle] = useState(null)
  console.log("ville", citySlug)

  const  handleClick = async (city: string) => {
    router.push(`/${city}`)


  }

  return (
    <div className='flex gap-2'>
      <GooglePlace setCity={setCitySlug}></GooglePlace>
      <input></input>
      <button onClick={() => handleClick(citySlug)}>rechercher</button>
    </div>
  )
}
