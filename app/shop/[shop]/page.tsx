import {createClient} from '@/lib/supabase/server'
import { getShopBySlug } from '@/app/actions/shops'
import ArtistCard from '@/components/card/artistShopCard'
import AddModale from '@/components/modale/AddModale'
import DropDown from '@/components/dropdown/dataDropDown'
import Link from 'next/link'
import { formDate } from '@/app/utils/date'
import { MoveRight } from 'lucide-react';
import { notFound } from 'next/navigation'







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
  const events_validated = shop?.guest_events.filter((guest) => guest.status === 'validated') ?? []
  const not_confirmed = shop?.guest_events.filter((guest) => guest.status === 'pending' && guest.created_by === 'shop') ?? []
  const events = [...events_validated, ...not_confirmed].sort((a,b) => new Date(a.start_date) - new Date(b.start_date))
  const residents = shop?.artists
  const  validated_residents = shop?.artists.filter((artist) => artist.status === "validated")
  console.log("resident", validated_residents)

  const is_connected = connected_user_id === shop_owner_id

  if (!shop){
    notFound()
  }

  return (
    <div className=" flex flex-col flex-1 gap-10" >
      <div>
        <h1 >{shopName}</h1>
        <Link href={`/${country_slug}/${city_slug}`}><h2>{city}</h2></Link>
      </div>
      <div className=" flex-1 flex flex-row gap-10 ">

        <div className=" flex-1 flex flex-col gap-5 relative ">
          {is_connected &&
            <>
            <DropDown shop_id={shop_id} data_props={validated_residents} type={"residency"} slug={shop_slug}/>
            <AddModale shop_id={shop_id} type={"residency"}/>
            </>
          }
          {!is_connected &&
          <>
            <h3 className='text-[1.2em] font'>Artistes résident..es</h3>
            <div className=" p-5 flex flex-wrap gap-2 border border-[] flex-1 ">
              {validated_residents?.map((artist,index)=> {
                return (
                  <div key={index}>
                    <Link href={`/artist/${artist.users.pseudo_slug}`}>
                      <ArtistCard artist={artist.users}/>
                    </Link>
                  </div>
                )
              })}
            </div>
          </>

          }
        </div>

        <div className=" w-[40%] h-fit  flex flex-col">
          <div className="flex relative ">
            {is_connected &&
              <div className=" w-full relative">
                <DropDown shop_id={shop_id} data_props={events} slug={shop_slug} type={'guest'}/>
                <AddModale shop_id={shop_id} city_id={city_id} type={"guest"}></AddModale>
              </div>
            }
          </div>
          { !is_connected &&
            <div className="flex flex-col gap-5 ">
              <h2>Guests en cours et à venir</h2>
              <div className="border">
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
                { events_validated.length === 0 &&
                  <p>Pas de guest prévu.</p>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
