
'use client'
import {useState} from 'react'
import { Plus } from 'lucide-react';
import CreateGuestFromArtist from '../forms/CreateGuestFromArtist';
import CreateGuestFromShop from '../forms/CreateGuestFromShop';
import {useRouter} from 'next/navigation'

export default function AddModale({user_id, shop_id, city_id, type}: {user_id?: string, shop_id?:string, city_id?:number, type: string}){
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()

  }
  console.log(open)

  return(
    <div className=" h-fit absolute left-100 -top-5 ">
      <button onClick={()=>setOpen(true)}>
        <div className="flex p-2 polygon">
          <Plus/>
        </div>
      </button>
      {open && type === "guest" &&
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center'>
          <div className='p-5 border border-[#2f0c71]  bg-[#cccc] w-[30%] relative flex flex-col'>
          <p className=" self-end" onClick={() => setOpen(false)}>
            x
          </p>
            {user_id &&
              <CreateGuestFromArtist user_id={user_id} onSuccess={handleSuccess}/>
            }
            {shop_id && city_id &&
              <CreateGuestFromShop city_id={city_id} shop_id={shop_id} onSuccess={handleSuccess} />
            }
          </div>

        </div>
      }
      {open && type === 'residency' &&
        <div className='fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='p-5 border border-[#2f0c71]  bg-[#cccc] w-[30%] relative flex flex-col'>
          </div>
        </div>
      }
    </div>
  )
}
