
'use client'
import {useState} from 'react'
import { Plus } from 'lucide-react';
import CreateGuestFromArtist from '../forms/CreateGuestFromArtist';
import CreateGuestFromShop from '../forms/CreateGuestFromShop';
import {useRouter} from 'next/navigation'

export default function AddModale({user_id, shop_id, city_id}: {user_id?: string, shop_id?:string, city_id?:number}){
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()

  }
  console.log(open)

  return(
    <div>
      <button onClick={()=>setOpen(true)}>
        <div className="flex gap-3">
          <p>Ajouter</p>
          <Plus/>
        </div>
      </button>
      {open &&
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center'>
          <div className='p-5 border border-[#f3cc09]  bg-[#2b2921] w-[50%]'>
            <div>
              </div>
              {user_id &&
                <CreateGuestFromArtist user_id={user_id} onSuccess={handleSuccess} onClose={(open: boolean) => {
                  setOpen(open)
                }}/>
              }
              {shop_id && city_id &&
                <CreateGuestFromShop city_id={city_id} shop_id={shop_id} onSuccess={handleSuccess} onClose={(open: boolean) => {
                  setOpen(open)}}/>
              }
            </div>

        </div>
      }
    </div>
  )
}
