'use client'
import {useRouter, usePathname, useSearchParams } from 'next/navigation'
import {useState} from 'react'


export default function RadiusButton({country, city, category}:{country:string, city:string, category?:string}){
  const router = useRouter()
  const pathname = usePathname()
  console.log(pathname)
  const search_params = useSearchParams()
  const search_radius = search_params.get('radius')
  const [searchRadius, setSearchRadius] = useState(search_radius || "0")
  const [section, setSection] = useState(category || null)
  const section_url = section ? `/${section}` : ""
  return(
    <div className="flex gap-2  items-center ">
      <div className="flex gap-2  min-w-[250px] justify-between  ">
        <label htmlFor="radius">{searchRadius} km</label>
        <input className="w-[10em]"
          type="range"
          id="radius"
          value={searchRadius!}
          onChange={(e) => setSearchRadius((e.target.value))}
          min={0}
          max={200}
          step={10}
        />
      </div >
      <button onClick={() => router.push(`/${country}/${city}${section_url}?radius=${searchRadius}`)}  className=' cursor-pointer p-2 rounded-full border border-blue'>étendre la recherche</button>
    </div>
  )
}
