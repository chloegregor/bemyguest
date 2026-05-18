import {useState, useEffect} from 'react'
import { editShop } from '@/app/actions/shops'

import GooglePlace from '../searchForm/google/googlePlace'

interface ShopProps {
  onSuccess: (slug:string) => void
  shop:{
    shop_name: string,
    shop_id: string
    instagram: string | null
  }
}
export default function ShopProfil({onSuccess, shop}: ShopProps){
  const [error, setError] = useState<string | null >(null)
  const [shopName, setShopName] = useState(shop.shop_name)
  const [instagram, setInstagram] = useState<string|null>(shop.instagram)
  const [disabled, isDisabled] = useState(true)


  useEffect(() => {
    if (shopName != shop.shop_name || instagram != shop.instagram){
      isDisabled(false)
    }else{
      isDisabled(true)
    }

  }, [shopName, instagram])


  async function handleSumbit(e: React.SubmitEvent<HTMLFormElement>){
     e.preventDefault()
         const form = new FormData(e.currentTarget)

    const shopName = form.get('shop_name') as string


    const editShopform = {
      shop_name : shopName,
      shop_slug: shopName.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
      shop_id : shop.shop_id,
      instagram: instagram
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
