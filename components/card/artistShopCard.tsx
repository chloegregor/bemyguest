import Image from 'next/image'
import Link from 'next/link'

export default function ArtistShopCard({artist}) {

  const styles = artist.user_style?.map((style) => style.styles.name)
  const city = artist.city_name
  return(
    <div className="flex flex-col gap-2 w-[200px] h-full items-center">
      <Link href={`/artist/${artist.pseudo_slug}`}><div>{artist.pseudo}</div></Link>
      <div className="relative aspect-square w-full ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${artist.pseudo}`} fill className="object-fill"/>
      </div>
      <div className='flex gap-2'>
      </div>
    </div>
  )
}
