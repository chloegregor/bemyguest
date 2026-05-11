import {createClient} from '@/lib/supabase/server'
import { GetUserBySlug } from '@/app/actions/users'
import Image from 'next/image'
import Link from 'next/link'
import AddModale from '@/components/modale/AddModale'
import GuestDropDown from '@/components/dropdown/guestDrop'
import { formDate } from '@/app/utils/date'
import { MoveRight } from 'lucide-react';


export default async function Artist({ params }: { params: Promise<{ artist: string }> }) {
  const {artist} = await params
  const supabase = await createClient()
  const { data} = await supabase.auth.getClaims()
  const user = data?.claims
  const connected_user_id = user?.sub
  const artist_data = await GetUserBySlug(artist)
  const artist_auth_id = artist_data?.[0]?.auth_id
  const artist_id = artist_data?.[0]?.id
  console.log("data", artist_data)
  const is_connected = connected_user_id === artist_auth_id
  const pseudo = artist_data?.[0]?.pseudo
  const city = artist_data?.[0]?.cities.city_name
  const city_slug = artist_data?.[0]?.cities.city_slug
  const shop = artist_data?.[0]?.shop_id?.shop_name
  const shop_slug = artist_data?.[0]?.shop_id?.shop_slug
  const img = artist_data?.[0]?.illustration
  const validated = artist_data?.guest_events.filter((guest) => guest.status === 'validated') ?? []
  const not_confirmed = artist_data?.guest_events.filter((guest) => guest.status === 'pending' && guest.created_by === 'artist') ?? []
  const events = [...validated, ...not_confirmed].sort((a,b) => new Date(a.start_date) - new Date(b.start_date))



  return (
    <div className="  flex flex-col flex-1">
      <div>
        <p>{pseudo}</p>
        <Link href={`/shop/${shop_slug}`}><p>{shop}</p></Link>
        <Link href={`/${city_slug}`}><p>{city}</p></Link>
      </div>
      <div className=" flex-1 flex gap-10 ">
        <div className="flex-1 flex flex-col ">
          <h2>Gallerie</h2>
          <div className=''>
            <Image src={"https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"} alt="illustration"  width="400" height="800" className="h-full w-auto"/>
          </div>
        </div>

        <div className="w-[40%] h-fit p-2 flex flex-col gap-5">
          <div className="flex relative">
            {is_connected &&
              <div className="w-full ">
                <GuestDropDown events={events} user_id={artist_id} slug={artist}/>
                <AddModale user_id={artist_id}></AddModale>
              </div>
            }

          </div>
          {!is_connected &&
            <div>
              <h2>Guests en cours et à venir</h2>
              {events?.map((event, index) => {
                return (
                  <div key={index} className="flex justify-between  p-2">
                    <div className="flex gap-2">
                      <p>{formDate(event.start_date)}</p>
                      <MoveRight/>
                      <p>{formDate(event.end_date)}</p>
                    </div>
                    <div className='flex gap-2'>
                      {event.shop_id && event.status === 'validated' &&
                        <>
                          <Link href={`/shop/${event?.shop_id?.shop_slug}`}><p>{`${event?.shop_id?.shop_name}`}</p></Link>
                          <p>|</p>
                        </>
                      }
                      {event.shop_id && event.status === 'pending' &&
                        <p>{`${event?.shop_id?.shop_name}`}</p>
                      }
                      <Link href={`/${event?.city_id?.city_slug}`}><p>{`${event?.city_id?.city_name}`}</p></Link>
                    </div>

                  </div>

                )
              })}
              {events && events.length === 0 &&
                <p>Pas de guests prévu.</p>
              }
            </div>


          }
        </div>
      </div>
    </div>
  )
}
