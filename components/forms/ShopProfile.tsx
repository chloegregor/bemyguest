'use client'
import {useState, useEffect} from 'react'
import { editShop } from '@/app/actions/shops'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface ShopProps {
  onSuccess: (slug:string) => void
  shop:{
    shop_name: string,
    shop_id: string
    instagram: string | null
    avatar: string | null
  }
}
export default function ShopProfil({onSuccess, shop}: ShopProps){
  const supabase = createClient()

  const [error, setError] = useState<string | null >(null)
  const [shopName, setShopName] = useState(shop.shop_name)
  const [instagram, setInstagram] = useState<string|null>(shop.instagram)
  const [avatar, setAvatar] = useState<File | undefined>(undefined)
  const [disabled, isDisabled] = useState(true)


  console.log('avatar', avatar)
  console.log(disabled)
  useEffect(() => {
    if (shopName != shop.shop_name || instagram != shop.instagram || avatar ){
      isDisabled(false)
    }else{
      isDisabled(true)
    }

  }, [shopName, instagram, avatar])


  async function handleSumbit(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const shopName = form.get('shop_name') as string
    const avatar = form.get('avatar') as File
    const filepath = `avatar/${shop.shop_id}`
    console.log(avatar)
    const {data, error} = await supabase.storage.from('images').upload(filepath, avatar, {upsert: true})
    if (error){
      setError("Erreur pendant le telechargement de l'image")
    }
    if (!data){
      setError("Erreur pendant le telechargement de l'image")
      return
    }
    const {data: publicUrl} =  supabase.storage.from('images').getPublicUrl(filepath)
    if (!publicUrl){
      setError("Une erreur s'est produite pendant le telechargment de l'image")
      return
    }

    const editShopform = {
      shop_name : shopName,
      shop_slug: shopName.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
      shop_id : shop.shop_id,
      instagram: instagram,
      avatar:`${publicUrl.publicUrl}?t=${Date.now()}`
    }

    try{
      await editShop(editShopform)
      onSuccess(editShopform.shop_slug)

    }catch (err){
      setError(err instanceof Error ? err.message : "erreur inconnue")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSumbit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <p>Nom du shop</p>
          <input name="shop_name" type="text" defaultValue={shop.shop_name} required className="border" onChange={(e) => setShopName(e.target.value)}/>
        </div>
        <div className="flex flex-col gap-2">
          <p>Instagram</p>
          <input name='insta' type="url" defaultValue={shop.instagram ?? ""} className="border" onChange={(e) => setInstagram(e.target.value)} />
          <p>{avatar?.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p>Avatar</p>
          {shop.avatar &&
          <div className='border p-2 flex justify-center'>
            <div className='relative w-[100px] aspect-square rounded-full overflow-hidden border-2 border-black'>
              <Image src={shop.avatar} alt='avatar' fill className='object-cover'></Image>
            </div>
          </div>
          }
          <label htmlFor="avatar" className='border p-1 w-fit'>Browse...</label>
          <input id='avatar' name='avatar' type="file" className='hidden' accept="image/png, image/jpeg" onChange={(e) => setAvatar(e.target.files?.[0])} />
          <p>{avatar?.name}</p>
        </div>
        <div className='flex justify-end'>
          <button disabled={disabled} type="submit" className={`border ${disabled ? "text-gray-500"  : ""}`}>Modifier</button>
        </div>
      </form>
      {error &&
        <p>{error}</p>
      }
    </div>
  )


}
