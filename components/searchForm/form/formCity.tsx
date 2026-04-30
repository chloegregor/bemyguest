'use client'
import GooglePlace from "../google/googlePlace"
import  {useState} from 'react'
import { useRouter } from 'next/navigation'
import { navigateOrCreateCity } from "@/app/actions/cites"



export default function Form({type}:{type:string}) {
  const router = useRouter()
  const [placeId, setPlaceId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const  handleClick = async ( id: string) => {
    setLoading(true)
      try{

        const result = await navigateOrCreateCity(id)
        if (!result){
          setError("Une erreur est survenue")
          return
        }
        if(result.error){
          setError(result.error)
          return
        }
        router.push(result.redirect!)


      }catch (err){
          setError("Une erreur est survenue")
        }

    }


  return (
    <div className='flex gap-2'>
      <GooglePlace setObject={(slug: string, placeId: string, name:string) => {
        setPlaceId(placeId)
      }} type={type}></GooglePlace>

      <button onClick={() => handleClick(placeId)}>rechercher</button>
    </div>
  )
}
