import Image from 'next/image'
import Link from 'next/link'

export default function ArtistCard({artist}) {
  const styles = artist.user_style?.map((style) => style.styles?.name)
  const city = artist.cities?.city_name
  const city_slug = artist.cities?.city_slug
  const shop_name = artist.shop?.shop_name
  const shop_slug = artist.shop?.shop_slug
  return(
    <div className="flex flex-col gap-2 w-[200px] h-full ">
      <div><Link href={`/artist/${artist.pseudo_slug}`}>{artist.pseudo}</Link></div>
      <div className='flex gap-2'>
      </div>
      <div className="relative aspect-square w-full ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${artist.pseudo}`} fill className="object-fill"/>
      </div>
      <div>
        <Link href={`/${city_slug}`}><p className="text-[0.8em]">{city}</p></Link>
        <Link href={`/shop/${shop_slug}`}><p className="text-[0.8em]">{shop_name}</p></Link>
      </div>
      <div>
      </div>
    </div>
  )
}
