import Image from 'next/image'

export default function ArtistCard({artist}) {

  const styles = artist.user_style.map((style) => style.styles.name)
  const city = artist.city_name
  const shop_name = `${artist.shop_id.shop_name},`
  return(
    <div className="flex flex-col gap-2">
      <div>{artist.pseudo}</div>
      <div className="relative aspect-square w-full ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${artist.pseudo}`} fill className="object-fill"/>
      </div>
      <div className='flex gap-2'>
        {styles.map((style, index)=> (
          <div key={index} className="rounded-full px-2 py-1 border">
              <p className='text-[0.7em]'>{style}</p>
          </div>
        ))}
      </div>
      <div>
        <p>{shop_name}{" "}{city}</p>
      </div>
      <div>
      </div>
    </div>
  )
}
