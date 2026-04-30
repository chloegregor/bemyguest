
'use client'
import {useState} from 'react'
import { Plus } from 'lucide-react';
import CreateGuest from '../forms/CreateGuestFromArtist';

export default function AddModale({user_id}: {user_id?: string}){
  const [open, setOpen] = useState(false)
  const [loading, isLoading] = useState(false)
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
          {loading ?
            <p>loading</p>
            :

            <div>
              <div><p className='close' onClick={() => setOpen(false)}>x</p>
              </div>
              <CreateGuest  setLoading={(isloading:boolean)=> {isLoading(isloading)}} user_id={user_id}/>
            </div>
          }
          </div>
      </div>
      }
    </div>
  )
}
