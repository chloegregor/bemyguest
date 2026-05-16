'use client'
import {useState, useEffect} from 'react'
import { GetGuestClient, getGuestClientFromArtist } from '@/app/actions/guests';
import { GetPendingResidencies} from '@/app/actions/residencies';
import { ValidateGuest } from '@/app/actions/guests';
import { ValidateResidency } from '@/app/actions/residencies';
import { ChevronDown } from 'lucide-react';
import { Check } from 'lucide-react';
import Link from 'next/link'
import { formDate } from '@/app/utils/date';
import { MoveRight } from 'lucide-react';
import { Trash } from 'lucide-react';
import ArtistShopCard from '../card/artistShopCard';


interface Residents {
  id: string,
  status: string,
  shop_id: string,
  user_id: string,
  users: {
    pseudo: string,
    pseudo_slug: string

  }
}


interface guestEvents {
  shop_id?: {
    id:string,
    shop_name: string,
    shop_slug: string
  }
  user_id?:{
    id: string,
    pseudo: string,
    pseudo_slug: string
  },
  id: string
  start_date: string,
  end_date: string,
  status: string,
  created_by: string,



}

interface dropDown {
  data_props: guestEvents[],
  type: string,
  shop_id?: string,
  user_id? : string,
  slug: string,

}




export default function DropDown({data_props, shop_id, user_id, slug, type }: dropDown){
  const [selected, setSelected] = useState(0)
  const [data, setData] = useState(data_props)
  const [clicked, setClicked] = useState(false)
  const [toValidate, setToValidate] = useState<guestEvents[] | Residents[]>([])
  const [notification, setNotification] = useState(0)
  console.log("ToValidate", toValidate)

  async function fetch(){

    let ToConfirm = []

      if(type === 'guest'){

         ToConfirm = shop_id ? await GetGuestClient(shop_id!) ?? [] : user_id ? await getGuestClientFromArtist(user_id!) ?? [] : []
        if (!ToConfirm){
          return
        }
      }
      if (type === 'residency'){

         ToConfirm = await GetPendingResidencies(shop_id!) ?? []
      }
      setToValidate(ToConfirm)
      setNotification(ToConfirm.length)
    }


  useEffect (() => {
    fetch()
    setData(data_props)

  },[shop_id, data_props])

  const handleClick = async (id:string, status:string) => {

   if (type === "guest"){
    await ValidateGuest(id, status, slug)
   } else {
    await ValidateResidency(id, status, slug)
   }   await fetch()

  }


  const list = selected === 0 ? data : toValidate

  const categories = type === 'guest' ? ["Guests en cours ou à venir", "Guests à valider"] : ["Artistes résident.es", "Artistes à valider"]

  return(
    <div className="flex flex-col h-fit gap-5 w-full  ">
      <div className="relative w-[300px] font  ">
        {notification > 0 &&
          <span className="absolute -top-5 -right-5  text-[#2f0c71]  text-[1.1em] border border-[#ed0a0a] rounded-full w-5 h-5 flex items-center justify-center">{notification > 0 ? notification : ""}</span>
        }
        <div className="flex  p-2 w-[350px] items-center justify-between">
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
                {index === 1 && notification > 0 &&
                  <p className=" border border-[#f0551d]   rounded-full w-5 h-5 flex items-center justify-center">
                    {notification}
                  </p>
                }
              </div>
            )}
          </div>
        }
      </div>
      <div className={`${type=== 'residency' ? 'p-5 flex flex-wrap gap-2 border border-[] flex-1' : ""}`}>
        {list && list.map((event, index) => {
            if (type === "guest"){
              return (
              <div key={index} className={` p-2 border w-full flex items-center`}>
                <div className={`flex justify-between items-center flex-1`}>
                  <div className="flex gap-2 text-[0.9em] items-center ">
                    <p>{formDate(event.start_date)}</p>
                    <MoveRight size={16}/>
                    <p>{formDate(event.end_date)}</p>
                  </div>
                  { event.status === 'validated' ?

                    <Link href={`/${user_id ? 'shop' : shop_id ? 'artist': ""}/${event.user_id?.pseudo_slug ?? event.shop_id?.shop_slug}`}><p  className="">{`${event.user_id?.pseudo ?? event.shop_id?.shop_name}`}</p></Link>
                    : <p  className="">{`${event.user_id?.pseudo ?? event.shop_id?.shop_name ?? ""}`}</p>

                  }

                </div>

                  {selected === 1 &&
                  <div className="flex gap-5 ml-[4em]">
                    <button onClick={() => handleClick(event.id, "validated")}><Check size={20} color="#39eb14" /></button>
                    <button onClick={() => handleClick(event.id, "deleted")}><Trash size={20} color="#ed0a0a" /></button>
                  </div>
                  }
                  {selected === 0 &&
                    <div className="flex gap-5 ml-[4em]">
                      <button onClick={() => handleClick(event.id, "deleted")}><Trash size={20} color="#ed0a0a" /></button>
                    </div>
                  }

              </div>

              )

            }else{
              return(
                <div key={index} className="flex flex-col items-center">
                    <div >
                      <ArtistShopCard artist={event.users}/>
                    </div>
                    {selected === 1 &&
                      <div className="flex gap-5">
                        <button className="" onClick={() => handleClick(event.id, "validated")}><Check size={25} color="#1dbf1f" /></button>
                        <button onClick={() => handleClick(event.id, "deleted")}><Trash size={25} color="#ed0a0a" /></button>
                      </div>
                      }
                      {selected === 0 &&
                      <div className="flex gap-5 ">
                        <button onClick={() => handleClick(event.id, "deleted")}><Trash size={20} color="#ed0a0a" /></button>
                      </div>
                    }
                </div>

              )
            }
           }

        )}


        {(!list || list.length === 0 )&&
          <p>Cette section est vide</p>
        }
      </div>

    </div>
  )
}
