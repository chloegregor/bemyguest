import Image from 'next/image'
import Link from 'next/link'

export default function ShopCard({shop}) {
  const city_name = shop.cities?.city_name
  const city_slug = shop.cities?.city_slug
  return(
    <div className="flex flex-col gap-2 h-full">
      <Link href={`/shop/${shop.shop_slug}`}>
      <div>{shop.shop_name}</div>
      </Link>
      <div className="relative aspect-square w-[200px] ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${shop.shop_name}`} fill className="object-fill"/>
      </div>
      <div>
        <Link href={`/${city_slug}`}><p>{city_name}</p></Link>
      </div>
      <div>
      </div>
    </div>
  )
}
