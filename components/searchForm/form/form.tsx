'use client'
import {createClient} from '@/lib/supabase/client'
import GooglePlace from "../google/googlePlace"
import  {useState} from 'react'
import { useRouter } from 'next/navigation'

type cityForm = {
  city_name: string,
  city_slug: string,
  city_id: string,
  lng: number,
  lat: number
}

async function getData(id:string){
  const supabase =  createClient()
  const {data, error} = await supabase.from('cities').select('city_slug').eq('city_id', id)
  return {data: data, error: error}
}

async function createData(form: cityForm){
  const supabase= createClient()
  const {error} = await supabase.from('cities').insert({city_name: form.city_name, city_slug: form.city_slug, city_id: form.city_id, lng: form.lng, lat: form.lat})
}


export default function Form() {
  const router = useRouter()
  const [citySlug, setCitySlug] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [loading, setLoading] = useState(false)

  const  handleClick = async (city: string, id) => {
    setLoading(true)
    const data = await getData(id)

    if (data.data && data.data.length > 0) {
      setLoading(false)
      router.push(`/${city}`)
    }
    if (data.data && data.data.length === 0){
      try {
        const res = await fetch(`https://places.googleapis.com/v1/places/${id}?fields=id,displayName,location&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`)
        const place = await res.json()
        const city_name = place.displayName.text
        const lng = place.location.longitude
        const lat = place.location.latitude
        const city_form = {
          city_name : city_name,
          city_slug: citySlug,
          city_id: id,
          lat: lat,
          lng: lng
        }

        try{
          await createData(city_form)
        }catch (error){
          throw new Error
        }

      } catch (error){
        console.log(error)
      }

    }

  }

  return (
    <div className='flex gap-2'>
      <GooglePlace setCity={(slug: string, placeId: string) => {
        setCitySlug(slug)
        setPlaceId(placeId)
      }}></GooglePlace>

      <button onClick={() => handleClick(citySlug, placeId)}>rechercher</button>
    </div>
  )
}
