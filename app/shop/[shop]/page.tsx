import {createClient} from '@/lib/supabase/server'
import ArtistCard from '@/components/card/artistShopCard'
import AddModale from '@/components/modale/AddModale'
import Link from 'next/link'







export default async function Artist({ params }: { params: Promise<{ shop: string }> }) {
  const {shop: shop_slug} = await params
  const supabase = await createClient()
  const { data} = await supabase.auth.getClaims()
  const user = data?.claims
  const connected_user_id = user?.sub ? user.sub : null
  const {data: shop_data, error} = await supabase.from ('shops').select('*, owner:users!shops_owner_id_fkey (auth_id), guest_events(*, user_id(*)),  artists:users!users_shop_id_fkey(*, user_style(*, styles(*))), cities(*)').eq('shop_slug', shop_slug)
  const shop_owner_id = shop_data?.[0]?.owner?.auth_id
  const shop_id = shop_data?.[0]?.id
  const shopName = shop_data?.[0]?.shop_name
  const city = shop_data?.[0]?.cities.city_name
  const city_slug = shop_data?.[0]?.cities.city_slug
  const city_id = shop_data?.[0]?.cities.id
  const country_slug = shop_data?.[0]?.cities.country_slug
  const events = shop_data?.[0]?.guest_events
  const artists = shop_data?.[0]?.artists

  const is_connected = connected_user_id === shop_owner_id

  return (
    <div className=" flex flex-col flex-1 gap-10">
      <div>
        <p className="text-[1.2em]">{shopName}</p>
        <Link href={`/${country_slug}/${city_slug}`}><p>{city}</p></Link>
      </div>
      <div className=" flex-1 flex gap-10">
        <div className=" flex-1 flex flex-col gap-5 ">
          <h2 className='text-[1.5em]'>Artistes résident..es</h2>
          <div className=" p-5 flex flex-wrap gap-2 border border-[f3cc09] flex-1 ">
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

        <div className="flex-1  h-fit p-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className='text-[1.5em]'>Guests en cours et à venir</h2>
            {is_connected &&
              <AddModale shop_id={shop_id} city_id={city_id}></AddModale>
            }
          </div>

          {events?.map((event, index) => {
            return (
              <div key={index} className="flex justify-between bg-white p-2">
                <div className="flex gap-2">
                  <p>{event.start_date}</p>
                  <p>{event.end_date}</p>
                </div>
                <Link href={`/artist/${event.user_id.pseudo_slug}`}><p>{`${event.user_id.pseudo}`}</p></Link>

              </div>

            )
          })}
        </div>
      </div>
    </div>
  )
}
