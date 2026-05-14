'use client'
import {useState} from 'react'
import { Pencil } from 'lucide-react'
import {useRouter} from 'next/navigation'
import ArtistProfile from '../forms/ArtistProfile'

interface ResidencyProps{
  id: string
  shop_id: string
  shops: {
    shop_name: string,
    shop_slug:string
    shop_place_id: string,

  }
}

interface CityProps {
  city_name: string,
  city_id: string
}

interface EditModal {
  id: string
  Artistpseudo: string,
  instagram?: string,
  residency?: ResidencyProps
  city?: CityProps
}

export default function EditModale({id, Artistpseudo, instagram, residency, city}: EditModal){
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()

  }
  console.log(open)

  return(
    <div className=" h-fit absolute left-100 -top-5">
      <button onClick={()=>setOpen(true)}>
        <div className="flex p-2 polygon">
          <Pencil/>
        </div>
      </button>
      {open &&
      <div className='fixed z-50 inset-0 backdrop-blur-sm flex items-center justify-center'>
        <div className='p-5 border border-[#2f0c71]  bg-[#cccc] w-[30%] relative flex flex-col'>
          <p className=" self-end" onClick={() => setOpen(false)}>
            x
          </p>
          <ArtistProfile id={id} Artistpseudo={Artistpseudo} instagram={instagram} residency={residency} city={city}/>
        </div>
      </div>
      }
    </div>
  )
}
