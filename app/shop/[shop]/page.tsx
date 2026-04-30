import {createClient} from '@/lib/supabase/server'
import List from '@/components/lists/List'
import Image from 'next/image'
import ArtistCard from '@/components/card/artistShopCard'
import Link from 'next/link'







export default async function Artist({ params }: { params: Promise<{ shop: string }> }) {
  const {shop: shop_slug} = await params
  const supabase = await createClient()
  const { data} = await supabase.auth.getClaims()
  const user = data?.claims
  const connected_user_id = user?.sub ? user.sub : null
  console.log(data)
  const {data: shop_data, error} = await supabase.from ('shops').select('*, owner:users!shops_owner_id_fkey (auth_id), guest_events(*, user_id(*)),  artists:users!users_shop_id_fkey(*, user_style(*, styles(*))), cities(*)').eq('shop_slug', shop_slug)
  const shop_owner_id = shop_data?.[0]?.owner?.auth_id
  console.log(shop_data)
  const shopName = shop_data?.[0]?.shop_name
  const city = shop_data?.[0]?.cities.city_name
  const events = shop_data?.[0]?.guest_events
  const artists = shop_data?.[0]?.artists
  const is_the_owner = connected_user_id === shop_owner_id

  return (
    <div className="  flex flex-col border border-amber-500 flex-1">
      <div>
        <p>{shopName}</p>
        <p>{city}</p>

      </div>
      <div className=" flex-1 flex gap-10 border border-amber-500 ">
        <h2>Artistes résident.es</h2>
        <div className="flex flex-wrap gap-2 flex-1">
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

        <div className="flex-1 bg-gray-50 h-fit p-2 flex flex-col gap-2">
          <h2>Guests en cours et à venir</h2>
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
