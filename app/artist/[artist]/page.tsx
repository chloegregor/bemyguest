import {createClient} from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function Artist({ params }: { params: Promise<{ artist: string }> }) {
  const {artist} = await params
  const supabase = await createClient()
  console.log("artist", artist)
  const {data: artist_data} = await supabase.from ('users').select('*, cities(*), user_style(*, styles(*)), shop_id(*), guest_events(*, shop_id(*), cities(*))').eq('role', 'artist').eq('pseudo_slug', artist)
  console.log("artistdata", artist_data)
  const pseudo = artist_data?.[0]?.pseudo
  const city = artist_data?.[0]?.cities.city_name
  const city_slug = artist_data?.[0]?.cities.city_slug
  const shop = artist_data?.[0]?.shop_id?.shop_name
  const shop_slug = artist_data?.[0]?.shop_id?.shop_slug
  const img = artist_data?.[0]?.illustration
  const events = artist_data?.[0]?.guest_events
  console.log("event", events)


  return (
    <div className="  flex flex-col border border-amber-500 flex-1">
      <div>
        <p>{pseudo}</p>
        <Link href={`/shop/${shop_slug}`}><p>{shop}</p></Link>
        <Link href={`/${city_slug}`}><p>{city}</p></Link>
      </div>
      <div className=" flex-1 flex gap-10 border border-amber-500 ">
        <div className="flex-1 flex justify-center ">
          <Image src={"https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"} alt="illustration"  width="400" height="800" className="h-full w-auto"/>
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
                <div className='flex gap-2'>
                  <Link href={`/shops/${shop_slug}`}><p>{`${shop}`}</p></Link>
                  <Link href={`/${city_slug}`}><p>{`${city}`}</p></Link>
                </div>

              </div>

            )
          })}
        </div>
      </div>
    </div>
  )
}
