import Image from 'next/image'
import { Event } from '@/types/index'
import Link from 'next/link'

export default function GuestCard({event}: { event: Event }) {
  const styles = event.users.user_style.map((style) => style.styles.name)
  const debut = event.start_date
  const fin = event.end_date ?? event.start_date
  const shop_name = event.shops.shop_name
  const shop_slug = event.shops.shop_slug
  const city = event.cities?.city_name
  const city_slug = event.cities?.city_slug
  const country= event.cities?.country_name
  const country_slug =event.cities?.country_slug
  const artist = event.users
  return(
    <div className="flex flex-col gap-2  h-full w-[200px]">
      <div><Link href={`/artist/${event.users.pseudo_slug}`}>{event.users.pseudo}</Link></div>
      <div className="relative aspect-square w-full ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${event.users.pseudo}`} fill className="object-fill"/>
      </div>

      <div className="flex flex-col">
        <Link href={`/shop/${shop_slug}`}>
        <p className='text-[0.8em]'>{shop_name}</p>
        </Link>
        <Link href={`/${country_slug}/${city_slug}`}><p className='text-[0.8em]'>{city},{" "}{country}</p>
        </Link>
      </div>
      <div>
        <p className="text-[0.8em]">du{" "}{debut}{" "}au{" "}{fin}</p>
      </div>
    </div>
  )
}
