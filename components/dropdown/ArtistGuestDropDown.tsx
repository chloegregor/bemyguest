'use client'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import { getGuestClientFromArtist } from '@/app/actions/guests';
import { ValidateGuest } from '@/app/actions/guests';
import { ChevronDown } from 'lucide-react';
import { Check } from 'lucide-react';
import Link from 'next/link'
import { formDate } from '@/app/utils/date';
import { MoveRight } from 'lucide-react';
import { Trash } from 'lucide-react';




export default function GuestDropDown({data, user_id, slug}: {data: any, user_id: string, slug:string}){
  const router = useRouter()
  const [selected, setSelected] = useState(0)
  const [validated, setValidated] = useState(data)
  const [clicked, setClicked] = useState(false)
  const [toValidate, setToValidate] = useState<any[]>([])
  const [wait, setToWait] = useState<any[]>([])
  const [notification, setNotification] = useState(0)

  async function fetch(){
    const data = await getGuestClientFromArtist(user_id)
    console.log("data drop", data)
    if (!data){
      return
    }
    const [wait, tovalidate] = await Promise.all([
      data.filter((event) => event.created_by === "artist"),
      data.filter((event) => event.created_by === "shop")
    ])
    setToWait(wait)
    setToValidate(tovalidate)
    setNotification(tovalidate.length)
  }

  useEffect (() => {
    fetch()
    setValidated(data)
  },[user_id, data])

  const handleClick = async (shop_id:string, status:string) => {
    await ValidateGuest(shop_id, user_id, status, slug)
   await fetch()
   setSelected(0)
    router.refresh()
  }


  const guests_list = selected === 0 ? validated : selected === 1 ? toValidate : wait

  const categories = ["guests en cours et à venir", "guests à valider", "guests en attente "]

  return(
    <div className="flex flex-col h-fit gap-0 w-full  ">
      <div className="relative w-[300px] font  ">
        {notification > 0 &&
          <span className="absolute -top-5 -right-5  border rounded-full w-5 h-5 flex items-center justify-center">{notification > 0 ? notification : ""}</span>
        }
        <div className="flex  p-2 w-[300px] items-center justify-between">
          <div className=' text-[1.2em]'>
            <p>
            { categories[selected]}
            </p>

          </div>
          <div className="cursor-pointer" onClick={() => setClicked(!clicked)}><ChevronDown/></div>
        </div>
        { clicked &&
          <div className=" absolute z-50 grey top-full w-full border-r border-l border-t ">
            {categories.map((cat:string, index) =>
              <div key={index} className={` flex gap-2 cursor-pointer border-b p-2 hover: ${index === selected ? "hidden" : ""}`}onClick={()=>{setSelected(index); setClicked(false)}}>
                <p>{cat}</p>
                {cat === "guests à valider" && notification > 0 &&
                  <p className="text-[#f0eeea] border  rounded-full w-5 h-5 flex items-center justify-center">
                    {notification}
                  </p>
                }
              </div>
            )}
          </div>
        }
      </div>
      {guests_list && guests_list.map((event, index) =>
        <div key={index} className={` grey border-t p-2  w-full flex items-center  ${selected === 2 ? "text-gray-500" : ""}`}>
          <div className={`flex justify-between items-center w-full`}>
            <div className="flex gap-2 text-[0.9em] items-center  ">
              <p>{formDate(event.start_date)}</p>
              <MoveRight size={16}/>
              <p>{formDate(event.end_date)}</p>
            </div>
            <div className="flex gap-2 ">
              <Link href={`/shop/${event.shop_id.shop_slug}`} className="h-fit"><p  className=" w-[150px] truncate">{`${event.shop_id.shop_name}`}</p></Link>
              <Link href={`/${event.city_id.country_slug}/${event.city_id.city_slug}`} className="  h-fit"><p className=" ">{` ${event.city_id.city_name}`}</p></Link>
            </div>
          </div>

            {selected === 1 &&
            <div className="flex gap-5 ml-[4em]">
              <button onClick={() => handleClick(event.shop_id.id, "validated")}><Check size={20} color="#20900B" /></button>
              <button onClick={() => handleClick(event.shop_id.id, "deleted")}><Trash size={20} color="#ed0a0a" /></button>
            </div>
            }
            {selected === 2 &&
              <p className="ml-[4em]">en attente de validation</p>
            }


        </div> )}
        {guests_list.length === 0 &&
          <p>Cette section est vide</p>
        }
    </div>
  )
}
