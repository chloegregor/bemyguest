import Image from 'next/image'
import Link from 'next/link'

export default function ArtistCard({artist}) {
  const styles = artist.user_style?.map((style) => style.styles?.name)
  const city = artist.cities?.city_name
  const city_slug = artist.cities?.city_slug
  const country = artist.cities?.country_name
  const country_slug = artist.cities?.country_slug
  const shop_name = artist.shop?.shop_name
  const shop_slug = artist.shop?.shop_slug
  return(
    <div className="flex flex-col gap-2 w-[250px] h-full  ">
      <div className="text-center"><Link href={`/artist/${artist.pseudo_slug}`}>{artist.pseudo}</Link></div>
      <div className='flex gap-2'>
      </div>
      <div className="relative aspect-square w-[200px] self-center  ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${artist.pseudo}`} fill className="object-fill"/>
      </div>
      <div className="  w-[200px] self-center ">
        <Link href={`/${country_slug}/${city_slug}`}><p className="text-[0.8em]">{city},{" "}{country}</p></Link>
        <Link href={`/shop/${shop_slug}`} className=""><p className="text-[0.8em] truncate">{shop_name}</p></Link>
      </div>
      <div>
      </div>
    </div>
  )
}
