'use client'
import {useState} from 'react'
import { Pencil } from 'lucide-react'
import {useRouter} from 'next/navigation'
import ArtistProfile from '../forms/ArtistProfile'
import ShopProfil from '../forms/ShopProfile'

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
  shop?:{
    shop_name: string,
    shop_id: string
    instagram: string | null
    avatar: string | null

  },
  artist?:{
    id: string
    pseudo: string,
    insta: string | null,
  }
  residency?: ResidencyProps
  city?: CityProps
}

export default function EditModale({ artist, shop, residency, city}: EditModal){
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSuccess = (slug:string) => {
    setOpen(false)
    router.push(`${slug}`)

  }


  return(
    <div className=" h-fit absolute -right-20 -top-5">
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
          {artist &&
            <ArtistProfile onSuccess={handleSuccess}  artist={artist!} residency={residency} city={city}/>
          }
          {shop &&
            <ShopProfil onSuccess={handleSuccess} shop={shop}/>
          }
        </div>
      </div>
      }
    </div>
  )
}
