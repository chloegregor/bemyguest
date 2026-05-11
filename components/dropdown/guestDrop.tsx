'use client'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import { GetGuestClient, getGuestClientFromArtist } from '@/app/actions/guests';
import { ValidateGuest } from '@/app/actions/guests';
import { ChevronDown } from 'lucide-react';
import { Check } from 'lucide-react';
import Link from 'next/link'
import { formDate } from '@/app/utils/date';
import { MoveRight } from 'lucide-react';
import { Trash } from 'lucide-react';


interface guestEvents {
  shop_id?: {
    shop_name: string,
    shop_slug: string
  }
  user_id?:{
    pseudo: string,
    pseudo_slug: string
  },
  start_date: string,
  end_date: string,
  status: string,
  created_by: string,



}

interface dropDown {
  events: guestEvents[],

  shop_id?: string,
  user_id? : string,
  slug: string,

}




export default function GuestDropDown({events, shop_id, user_id, slug, }: dropDown){
  const router = useRouter()
  const [selected, setSelected] = useState(0)
  const [data, setData] = useState(events)
  const [clicked, setClicked] = useState(false)
  const [toValidate, setToValidate] = useState<guestEvents[]>([])
  const [notification, setNotification] = useState(0)


  async function fetch(){

    const ToConfirm = shop_id ? await GetGuestClient(shop_id!) : user_id ? await getGuestClientFromArtist(user_id!) : []
    if (!ToConfirm){
      return
    }
    setToValidate(ToConfirm)
    setNotification(ToConfirm.length)
  }

  useEffect (() => {
    fetch()
    setData(events)

  },[shop_id, events])

  const handleClick = async (else_id:string, status:string) => {
    const primary = user_id! ?? shop_id!
    await ValidateGuest(primary, else_id, status, slug)
   await fetch()
   setSelected(0)
    router.refresh()
  }


  const guests_list = selected === 0 ? data : toValidate

  const categories = ["guests en cours ou à venir", "guests à valider"]

  return(
    <div className="flex flex-col h-fit gap-5 w-full  ">
      <div className="relative w-[300px] font  ">
        {notification > 0 &&
          <span className="absolute -top-5 -right-5 text-[#f0eeea] border border-[#f0eeea] rounded-full w-5 h-5 flex items-center justify-center">{notification > 0 ? notification : ""}</span>
        }
        <div className="flex  p-2 w-[300px] items-center justify-between">
          <div >
            <h3 className='text-[1.2em]' >
            { categories[selected]}
            </h3>

          </div>
          <div className="cursor-pointer" onClick={() => setClicked(!clicked)}><ChevronDown/></div>
        </div>
        { clicked &&
          <div className=" absolute z-50  grey top-full w-full border-r border-l border-t ">
            {categories.map((cat:string, index) =>
              <div key={index} className={` flex gap-2 cursor-pointer border-b p-2 hover:text-[#ed0a0a] ${index === selected ? "hidden" : ""}`}onClick={()=>{setSelected(index); setClicked(false)}}>
                <h3 className='text-[1.2em]'>{cat}</h3>
                {cat === "guests à valider" && notification > 0 &&
                  <p className="text-[#f0eeea] border border-[#f0eeea] rounded-full w-5 h-5 flex items-center justify-center">
                    {notification}
                  </p>
                }
              </div>
            )}
          </div>
        }
      </div>
      {guests_list && guests_list.map((event, index) =>
        <div key={index} className={` p-2 border w-full flex items-center  ${selected === 2 ? "text-gray-500" : ""}`}>
          <div className={`flex justify-between items-center flex-1`}>
            <div className="flex gap-2 text-[0.9em] items-center ">
              <p>{formDate(event.start_date)}</p>
              <MoveRight size={16}/>
              <p>{formDate(event.end_date)}</p>
            </div>
            { event.status === 'validated' ?
              <Link href={`/${user_id ? 'shop' : 'artist'}/${event.user_id?.pseudo_slug ?? event.shop_id?.shop_slug}`}><p  className="">{`${event.user_id?.pseudo ?? event.shop_id?.shop_name}`}</p></Link>
              : <p  className="">{`${event.user_id?.pseudo ?? event.shop_id?.shop_name}`}</p>

            }

          </div>

            {selected === 1 &&
            <div className="flex gap-5 ml-[4em]">
              <button onClick={() => handleClick(event.user_id?.id ?? event.shop_id?.id, "validated")}><Check size={20} color="#39eb14" /></button>
              <button onClick={() => handleClick(event.user_id?.id ?? event.shop_id?.id, "deleted")}><Trash size={20} color="#ed0a0a" /></button>
            </div>
            }




        </div> )}
        {guests_list.length === 0 &&
          <p>Cette section est vide</p>
        }
    </div>
  )
}
