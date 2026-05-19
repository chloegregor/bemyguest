import Image from 'next/image'
import { Event } from '@/types/index'
import Link from 'next/link'
import { MoveRight } from 'lucide-react';
import { formDate } from '@/app/utils/date'

export default function GuestCard({event}: { event: Event }) {
  const styles = event.users?.user_style?.map((style) => style.styles.name)
  const debut = formDate(event.start_date)
  const fin = formDate(event.end_date ?? event.start_date)
  const shop_name = event.shops?.shop_name
  const shop_slug = event.shops?.shop_slug
  const city = event.cities?.city_name
  const city_slug = event.cities?.city_slug
  const country= event.cities?.country_name
  const country_slug =event.cities?.country_slug
  const artist = event.users
  const avatar = artist?.avatar
  return(
    <div className="flex flex-col gap-2  h-full w-[250px] items-center">
      <div><Link href={`/artist/${artist?.pseudo_slug}`}>{artist?.pseudo}</Link></div>
      <div className='flex gap-2 items-center '>
        <p className="text-[0.8em]">{debut}</p>
        <MoveRight/>
        <p className="text-[0.8em]">{fin}</p>
      </div>
      <div className="relative aspect-square w-[200px] rounded-full border border-black overflow-hidden ">
        <Image src={avatar ? avatar : '/img/placeholder.jpg'}
        alt={`illustration ${artist?.pseudo}`} fill className="object-cover"/>
      </div>

      <div className="flex flex-col w-[200px] ">
        <Link href={`/shop/${shop_slug}`}>
        <p className='text-[0.8em] truncate'>{shop_name}</p>
        </Link>
        <Link href={`/${country_slug}/${city_slug}`}><p className='text-[0.8em]'>{city},{" "}{country}</p>
        </Link>
      </div>
    </div>
  )
}
