'use client'
import GooglePlace from "../google/googlePlace"
import  {useState, useEffect} from 'react'


interface FormProp {
  type: string
  setObject: (nameSlug: string, placeId:string, name:string) => void
}

export default function FormShopInCreateUser({type, setObject}:FormProp) {
  const [nameSlug, setNameSlug] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [name, setName] = useState('')


  useEffect(() => {
  if (nameSlug || placeId || name){
    setObject(nameSlug, placeId, name)
  }
}, [nameSlug, placeId, name])

  return (
    <div className='flex gap-2'>
      <GooglePlace setObject={(slug: string, placeId: string, name:string) => {
        setNameSlug(slug)
        setPlaceId(placeId)
        setName(name)
      }} type={type}></GooglePlace>

    </div>
  )
}
