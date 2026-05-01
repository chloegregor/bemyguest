
'use client'
import {useState} from 'react'
import { Plus } from 'lucide-react';
import CreateGuest from '../forms/CreateGuestFromArtist';
import {useRouter} from 'next/navigation'

export default function AddModale({user_id}: {user_id?: string}){
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
          <div className='p-5 border  bg-gray-50 '>
            <div>
              </div>
              <CreateGuest user_id={user_id} onSuccess={handleSuccess} onClose={(open: boolean) => {
                setOpen(open)
              }}/>
            </div>

        </div>
      }
    </div>
  )
}
