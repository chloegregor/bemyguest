import {createClient} from '@/lib/supabase/server'
import List from '@/components/filter/List'
import Image from 'next/image'
import ArtistCard from '@/components/card/artistShopCard'
import Link from 'next/link'


export default async function Artist({ params }: { params: Promise<{ shop: string }> }) {
  const {shop: shop_slug} = await params
  const supabase = await createClient()
  console.log("shop", shop_slug)
  const {data: shop_data, error} = await supabase.from ('shops').select('*, guest_events(*, user_id(*)),  artists:users!users_shop_id_fkey(*, user_style(*, styles(*)))').eq('shop_slug', shop_slug)
  console.log("shopdata", shop_data)
  console.log(error)
  const shopName = shop_data?.[0].shop_name
  const city = shop_data?.[0].city_name
  const events = shop_data?.[0].guest_events

  const artists = shop_data?.[0].artists
  console.log("artists", artists)

  return (
    <div className="  flex flex-col border border-amber-500 flex-1">
      <div>
        <p>{shopName}</p>
        <p>{city}</p>
      </div>
      <div className=" flex-1 flex gap-10 border border-amber-500 ">
        <div className="flex flex-wrap gap-2 flex-1">
          {artists.map((artist,index)=> {
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
          {events.map((event, index) => {
            return (
              <div key={index} className="flex justify-between bg-white p-2">
                <div className="flex gap-2">
                  <p>{event.start_date}</p>
                  <p>{event.end_date}</p>
                </div>
                <p>{`${event.user_id.pseudo}`}</p>

              </div>

            )
          })}
        </div>
      </div>
    </div>
  )
}
