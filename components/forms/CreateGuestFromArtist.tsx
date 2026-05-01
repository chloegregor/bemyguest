'use client'
import {useState} from 'react'
import { DatePickerDemo } from '../date/datapicker'
import GooglePlace from '../searchForm/google/googlePlace'
import { handleForm } from '@/app/actions/guests'
import { useRouter } from 'next/navigation'

interface CreateGuestProps{
  user_id?: string
  shop_id?: string
  onClose: (open:boolean) => void
  onSuccess: ()=> void
}

export default function CreateGuest({ user_id, shop_id, onClose, onSuccess}: CreateGuestProps){
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [shopName, setShopname] = useState<string | null>(null)
  const [shopSlug, setShopSlug] = useState<string | null>(null)
  const [shopPlaceId, setShopPlaceId] = useState<string | null>(null)
  const [cityPlaceId, setCityPlaceId] = useState<string | null>(null)
  const [isShop, setIsShop] = useState<boolean>(true)
  const [invitation, setInvitation] = useState(false)
  const [userId, setUserId] =useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  console.log( " date de début", startDate)
  console.log('invitation', invitation)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
     e.preventDefault()
    const form = new FormData(e.currentTarget)

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
      email: form.get('email') as string
    }
    try{
      const result = await handleForm(guest_data)
      console.log('result', result)
      if (!result){
        setLoading(false)
        setError("erreur à la création du guest")
      }
      if (result.error){
        if(result.error === "email"){
          setLoading(false)
          setInvitation(true)
          return
        }
        setLoading(false)
        setError(result.error)
        return
      }
      setLoading(false)
      onSuccess()
    } catch (err){
      setLoading(false)
      console.error(err instanceof Error ? err.message : 'erreur inconnue')
      setError(err instanceof Error ? err.message : 'erreur inconnue')
    }



  }

  return (
    <div className='relative'>
      {loading &&
        <div className="inset-0 absolute bg-gray-50 z-50 flex items-center justify-center">
          <p>loading...</p>
        </div>
      }
        <div className="flex flex-col border">
          <p className="border self-end" onClick={() => onClose(false)}>
            x
          </p>
          <p>Créer un guest</p>
          {error  &&
            <p className="text-red">{error}</p>

          }
          <form onSubmit={handleSubmit}>
            <div>
              <div className="flex flex-col gap-2">
                <label htmlFor="start_date">Date de début</label>
                <DatePickerDemo value ={startDate ?? undefined } retreiveDate={(date:Date | null) => {setStartDate(date)}}/>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="start_date">Date de fin</label>
                <DatePickerDemo value ={endDate ?? undefined } retreiveDate={(date:Date | null) => {setEndDate(date)}}/>
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
                      <div>
                        <GooglePlace type={"shop"} setObject={(nameSlug: string, placeId:string, nameShop: string) => {
                          setShopname(nameShop)
                          setShopSlug(nameSlug)
                          setShopPlaceId(placeId)
                        }}/>
                      {invitation &&
                        <div>
                          <p>invitez par mail.</p>
                          <div>
                            <input name="email" type="email" required className='border' />
                          </div>
                        </div>
                      }
                      </div>

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

    </div>
  )
}
