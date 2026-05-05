import Image from 'next/image'
import Link from 'next/link'

interface cityProp{
  city_name: string,
  city_slug: string,
  country_slug: string,
  country_name:string
}

interface shopCardProp {
  shop:{
    shop_slug:string,
    shop_name: string,
    cities: cityProp
    }

}

export default function ShopCard({shop}: shopCardProp) {
  const city_name = shop.cities?.city_name
  const city_slug = shop.cities?.city_slug
  const country_slug = shop.cities?.country_slug
  const country = shop.cities?.country_name
  return(
    <div className="flex flex-col gap-2 h-full items-center   ">
      <Link href={`/shop/${shop.shop_slug}`} className=" px-5 w-[250px]  ">
      <div><p className="truncate text-center">{shop.shop_name}</p></div>
      </Link>
      <div className="relative aspect-square w-[200px] rounded-full overflow-hidden">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${shop.shop_name}`} fill className="object-fill"/>
      </div>
      <div>
        <Link href={`/${country_slug}/${city_slug}`}><p className="text-[0.8em]">{city_name},{" "}{country}</p></Link>
      </div>
      <div>
      </div>
    </div>
  )
}
