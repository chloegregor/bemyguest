import {useState} from 'react'
import { editShopName } from '@/app/actions/shops'

import GooglePlace from '../searchForm/google/googlePlace'

interface ShopProps {
  onSuccess: (slug:string) => void
  shop:{
    shop_name: string,
    shop_id: string
  }
}
export default function ShopProfil({onSuccess, shop}: ShopProps){
  const [shopName, setNewShopName] = useState<string>(shop.shop_name)
  const [error, setError] = useState<string | null >(null)

  async function handleSumbit(){
    const editShopform = {
      shop_name : shopName,
      shop_slug: shopName.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
      shop_id : shop.shop_id
    }
    try{
      await editShopName(editShopform)
      onSuccess(editShopform.shop_slug)

    }catch (err){
      setError(err instanceof Error ? err.message : "erreur inconnue")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p>Nom du shop</p>
      <input type="text" defaultValue={shop.shop_name} required onChange={(e) => setNewShopName(e.target.value)} className="border"/>
      <div className='flex justify-end'>
        <button onClick={() => handleSumbit()} className="border">Modifier</button>
      </div>
      {error &&
        <p>{error}</p>
      }
    </div>
  )


}
