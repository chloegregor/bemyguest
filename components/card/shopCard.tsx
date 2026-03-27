import Image from 'next/image'

export default function ShopCard({shop}) {
  return(
    <div className="flex flex-col gap-2">
      <div>{shop.shop_name}</div>
      <div className="relative aspect-square w-full ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${shop.shop_name}`} fill className="object-fill"/>
      </div>
      <div>
        <p>{shop.city_name}</p>
      </div>
      <div>
      </div>
    </div>
  )
}
