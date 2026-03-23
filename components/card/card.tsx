import Image from 'next/image'



export default function Card({event, index}) {

  const styles = event.users.user_style.map((style) => style.styles.name)
  const debut = event.start_date
  const fin = event.end_date ?? event.start_date
  return(
    <div key={index} className="flex flex-col gap-2">
      <div>{event.users.pseudo}</div>
      <div className="relative aspect-square w-full ">
        <Image src="https://kuqyxgjizzysthhyfoep.supabase.co/storage/v1/object/public/images/552488704_18074237399130072_8672640192344154212_n.jpg"
        alt={`illustration ${event.users.pseudo}`} fill className="object-fill"/>
      </div>
      <div className='flex gap-2'>
        {styles.map((style, index)=> (
          <div key={index} className="rounded-full px-2 py-1 border">
              <p className='text-[0.7em]'>{style}</p>
          </div>
        ))}
      </div>
      <div>
        <p>{event.shop_name}, {" "}{event.city_name}</p>
      </div>
      <div>
        <p className="text-[0.8em]">du{" "}{debut}{" "}au{" "}{fin}</p>
      </div>
    </div>
  )
}
