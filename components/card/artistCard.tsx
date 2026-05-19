import Image from 'next/image'
import Link from 'next/link'

export default function ArtistCard({artist}) {
  const styles = artist.user_style?.map((style) => style.styles?.name)
  const avatar = artist.avatar
  const city = artist.residencies?.[0]?.cities
  const shop = artist.residencies?.[0]?.shops
  const cityname = city?.city_name
  const city_slug = city?.city_slug
  const country = city?.country_name
  const country_slug = city?.country_slug
  const shop_name = shop?.shop_name
  const shop_slug = shop?.shop_slug
  return(
    <div className="flex flex-col gap-2 w-[250px] h-full  ">
      <div className="text-center"><Link href={`/artist/${artist.pseudo_slug}`}>{artist.pseudo}</Link></div>
      <div className="relative aspect-square w-[200px] self-center border border-black rounded-full overflow-hidden ">
        <Image src={avatar ? avatar : "/img/placeholder.jpg"}
        alt={`illustration ${artist.pseudo}`} fill className="object-cover"/>
      </div>
      <div className="  w-[200px] self-center ">
        <Link href={`/${country_slug}/${city_slug}`}><p className="text-[0.8em]">{cityname},{" "}{country}</p></Link>
        <Link href={`/shop/${shop_slug}`} className=""><p className="text-[0.8em] truncate">{shop_name}</p></Link>
      </div>
      <div>
      </div>
    </div>
  )
}
