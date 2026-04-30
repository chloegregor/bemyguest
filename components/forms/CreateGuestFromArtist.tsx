'use client'
import {useState} from 'react'
import { DatePickerDemo } from '../date/datapicker'
import GooglePlace from '../searchForm/google/googlePlace'
import { handleForm } from '@/app/actions/guests'
import { useRouter } from 'next/navigation'

interface CreateGuestProps{
  setLoading : (isloading: boolean) => void
  user_id?: string
  shop_id?: string
}

export default function CreateGuest({ setLoading, user_id, shop_id}: CreateGuestProps){
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [shopName, setShopname] = useState<string | null>(null)
  const [shopSlug, setShopSlug] = useState<string | null>(null)
  const [shopPlaceId, setShopPlaceId] = useState<string | null>(null)
  const [cityPlaceId, setCityPlaceId] = useState<string | null>(null)
  const [isShop, setIsShop] = useState<boolean>(true)
  const [userId, setUserId] =useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    const start_date = startDate?.toISOString().split("T")[0]
    const end_date = endDate?.toISOString().split("T")[0]
    if (!startDate || !endDate ){
      setLoading(false)
      setError('champs obligatoires manquants')
      return
    }
    if (user_id && (!shopName || !shopSlug || !shopPlaceId) && !cityPlaceId){
      setLoading(false)
      setError('champs obligatoire manquants')
      return
    }

    if (shop_id && !userId){
      setLoading(false)
      setError('champs obligatoire manquants')
      return
    }


    const guest_data = {
      start_date: start_date as string,
      end_date: end_date as string,
      shop_id: shop_id ?? null,
      user_id : user_id ?? null,
      shop_name: shopName,
      shop_place_id: shopPlaceId,
      shop_slug: shopSlug,
      city_place_id: cityPlaceId,
      email:null
    }
    try{
      const result = await handleForm(guest_data)
      if (!result){
        setLoading(false)
        setError("erreur à la création du guest")
      }
      if (result.error){
        setLoading(false)
        setError(result.error)
      }
      setLoading(false)
      router.back()
    } catch (err){
      setLoading(false)
      console.error(err instanceof Error ? err.message : 'erreur inconnue')
      setError(err instanceof Error ? err.message : 'erreur inconnue')
    }



  }

  return (
    <div className=''>
      <p>Créer un guest</p>
      {error  &&
        <p className="text-red">{error}</p>

      }
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex flex-col gap-2">
            <label htmlFor="start_date">Date de début</label>
            <DatePickerDemo retreiveDate={(date:Date | null) => {setStartDate(date)}}/>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="start_date">Date de fin</label>
            <DatePickerDemo retreiveDate={(date:Date | null) => {setEndDate(date)}}/>
          </div>
            {user_id &&
              <div className="flex flex-col gap-2">
                <p>Le guest aura lieu dans un shop ?</p>
                <div className='flex gap-2'>
                  <div className='flex gap-2'>
                    <label htmlFor="yes">Oui</label>
                    <input name="isShop" type="radio" defaultChecked required onClick={() => setIsShop(true)}/>
                  </div>
                  <div className='flex gap-2'>
                    <label htmlFor="no">Non</label>
                    <input name="isShop" type="radio" onClick={() => setIsShop(false)}/>
                  </div>
                </div>
                {isShop === true ?
                  <GooglePlace type={"shop"} setObject={(nameSlug: string, placeId:string, nameShop: string) => {
                    setShopname(nameShop)
                    setShopSlug(nameSlug)
                    setShopPlaceId(placeId)
                  }}/>
                  :
                  <GooglePlace type={"city"} setObject={(nameSlug: string, placeId:string, nameShop: string) => {
                    setCityPlaceId(placeId)
                  }}/>
                }
              </div>
            }
            {shop_id &&
            <div className="flex flex-col gap-2">
              <label htmlFor="start_date">Artiste</label>

            </div>
            }
        </div>
        <button type='submit'>Créer</button>
      </form>
    </div>
  )
}
