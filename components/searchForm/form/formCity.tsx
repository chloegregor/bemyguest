'use client'
import GooglePlace from "../google/googlePlace"
import  {useState} from 'react'
import { useRouter } from 'next/navigation'
import { geocodePlaceId} from '@/app/actions/geocoder'
import { getCity, createCity } from '@/app/actions/cites'



export default function Form({type}:{type:string}) {
  const router = useRouter()
  const [nameSlug, setNameSlug] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const  handleClick = async ( id: string) => {
    setLoading(true)
      const {data} =  await getCity(id)
      if (data && data.length > 0) {
        setLoading(false)
        router.push(`/${data[0].country_slug}/${data[0].city_slug}`)
      }
      if (data && data.length === 0){
        try {
          const {fr, en} = await geocodePlaceId(id)
          console.log('fr', fr)
          const dptFr = fr.address_components.find((a) => a.types.includes('administrative_area_level_2')).short_name
          const city_name = fr.address_components.find((a) => a.types.includes('locality')).short_name
          const city_name_en = en.address_components.find((a) => a.types.includes('locality')).short_name
          const city_slug = `${city_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').trim()}_${dptFr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').trim()}`
          const lng = fr.geometry.location.lng
          const lat = fr.geometry.location.lat
          const country = fr.address_components.find((a) => a.types.includes('country')).long_name
          const country_en = en.address_components.find((a) => a.types.includes('country')).long_name
          const country_slug = en.address_components.find((a) => a.types.includes('country')).short_name.toLowerCase()



          const city_form = {
            city_name : city_name,
            city_name_en: city_name_en,
            city_slug: city_slug,
            city_id: id,
            lat: lat,
            lng: lng,
            country: country,
            country_name_en: country_en,
            country_slug: country_slug
          }

          try{
            const data = await createCity(city_form)
            router.push(`/${country_slug}/${city_slug}`)

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
      <GooglePlace setObject={(slug: string, placeId: string, name:string) => {
        setNameSlug(slug)
        setPlaceId(placeId)
        setName(name)
      }} type={type}></GooglePlace>

      <button onClick={() => handleClick(placeId)}>rechercher</button>
    </div>
  )
}
