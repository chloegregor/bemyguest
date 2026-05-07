import {createClient} from '@/lib/supabase/server'
import { getShopBySlug } from '@/app/actions/shops'
import ArtistCard from '@/components/card/artistShopCard'
import AddModale from '@/components/modale/AddModale'
import GuestDropDown from '@/components/dropdown/guestDrop'
import Link from 'next/link'
import { formDate } from '@/app/utils/date'
import { MoveRight } from 'lucide-react';







export default async function Artist({ params }: { params: Promise<{ shop: string }> }) {
  const {shop: shop_slug} = await params
  const supabase = await createClient()
  const { data} = await supabase.auth.getClaims()
  const user = data?.claims
  const connected_user_id = user?.sub ? user.sub : null
  const shop = await getShopBySlug(shop_slug)
  const shop_owner_id = shop?.owner?.auth_id
  const shop_id = shop?.id
  const shopName = shop?.shop_name
  const city = shop?.cities.city_name
  const city_slug = shop?.cities.city_slug
  const city_id = shop?.cities.id
  const country_slug = shop?.cities.country_slug
  const events_validated = shop?.guest_events
  const artists = shop?.artists
  const is_connected = connected_user_id === shop_owner_id

  return (
    <div className=" flex flex-col flex-1 gap-10">
      <div>
        <p className="text-[1.2em]">{shopName}</p>
        <Link href={`/${country_slug}/${city_slug}`}><p>{city}</p></Link>
      </div>
      <div className=" flex-1 flex flex-row gap-10">
        <div className=" flex-1 flex flex-col gap-5 ">
          <h2 className='text-[1.5em]'>Artistes résident..es</h2>
          <div className=" p-5 flex flex-wrap gap-2 border border-[] flex-1 ">
            {artists?.map((artist,index)=> {
              return (
                <div key={index}>
                  <Link href={`/artist/${artist.pseudo_slug}`}>
                    <ArtistCard artist={artist}/>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        <div className=" w-[40%] h-fit p-2 flex flex-col gap-5">
          <div className="flex relative ">
            {is_connected &&
              <div className=" w-full">
                <GuestDropDown shop_id={shop_id} data={events_validated} slug={shop_slug}></GuestDropDown>
                <AddModale shop_id={shop_id} city_id={city_id}></AddModale>
              </div>
            }
          </div>
          { !is_connected &&
            <div>
              <h2>Guests en cours et à venir</h2>
             { events_validated?.map((event, index) => {
              return (
                <div key={index} className="flex p-2 border justify-between">
                  <div className="flex gap-2">
                    <p>{formDate(event.start_date)}</p>
                    <MoveRight/>
                    <p>{formDate(event.end_date)}</p>
                  </div>
                  <Link href={`/artist/${event.user_id.pseudo_slug}`}><p>{`${event.user_id.pseudo}`}</p></Link>
                </div>
              )
              })}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
