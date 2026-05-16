import {createClient} from '@/lib/supabase/server'
import { GetUserBySlug } from '@/app/actions/users'
import Image from 'next/image'
import { House } from 'lucide-react';
import { MapPin } from 'lucide-react';
import EditModale from '@/components/modale/editModale'
import Link from 'next/link'
import AddModale from '@/components/modale/AddModale'
import DropDown from '@/components/dropdown/dataDropDown'
import { formDate } from '@/app/utils/date'
import { MoveRight } from 'lucide-react';
import { notFound } from 'next/navigation'



export default async function Artist({ params }: { params: Promise<{ artist: string }> }) {
  const {artist} = await params
  const supabase = await createClient()
  const { data} = await supabase.auth.getClaims()
  const user = data?.claims
  const connected_user_id = user?.sub
  const artist_data = await GetUserBySlug(artist)
  const artist_auth_id = artist_data?.auth_id
  const artist_id = artist_data?.id
  const instagram = artist_data?.insta
  const is_connected = connected_user_id === artist_auth_id
  const pseudo = artist_data?.pseudo
  const residency = artist_data?.residencies?.[0]
  const city = residency?.cities
  const img = artist_data?.illustration
  const validated = artist_data?.guest_events.filter((guest) => guest.status === 'validated') ?? []
  const not_confirmed = artist_data?.guest_events.filter((guest) => guest.status === 'pending' && guest.created_by === 'artist') ?? []
  const events = [...validated, ...not_confirmed].sort((a,b) => new Date(a.start_date) - new Date(b.start_date))


  if(!artist_data){
    notFound()
  }


  return (
    <div className="flex flex-col flex-1 gap-5">
      <div className=" flex flex-col gap-5 relative ">
        {is_connected &&
          <EditModale id={artist_id} Artistpseudo={pseudo} instagram={instagram} residency={residency} city={city}/>
        }
        <h1>{pseudo}</h1>
        <div>
          {residency.shops &&
            <Link href={`/shop/${residency.shops?.shop_slug}`} className='flex gap-2 items-center'><House/><h2>{residency.shops?.shop_name}</h2></Link>
          }
          <Link href={`/${city.country_slug}/${residency.cities.city_slug}`} className='flex gap-2 items-center'><MapPin/><h2>{residency.cities.city_name}</h2></Link>
        </div>
      </div>
      <div className=" flex-1 flex gap-10 ">
        <div className="flex-1 flex flex-col p-2 ">
          <h3 className='text-[1.2em] font'>Gallerie</h3>
          <div className=''>

          </div>
        </div>

        <div className="w-[40%] h-fit p-2 flex flex-col gap-5">
            {is_connected &&
              <div className="flex relative">
                <div className="w-full ">
                  <DropDown data_props={events} user_id={artist_id} slug={artist} type={'guest'}/>
                  <AddModale user_id={artist_id} type={"guest"}></AddModale>
                </div>
              </div>
            }
          {!is_connected &&
            <div>
              <h3 className='text-[1.2em] font'>Guests en cours et à venir</h3>
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
