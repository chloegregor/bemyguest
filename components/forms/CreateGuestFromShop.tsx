'use client'
import {useState} from 'react'
import { DatePickerDemo } from '../date/datapicker'
import { handleForm } from '@/app/actions/guests'

interface CreateGuestProps{
  shop_id: string
  city_id: number
  onClose: (open:boolean) => void
  onSuccess: ()=> void
}

export default function CreateGuestFromShop({ shop_id, city_id, onClose, onSuccess}: CreateGuestProps){
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
     e.preventDefault()
    const form = new FormData(e.currentTarget)

    setLoading(true)

    const start_date = startDate?.toISOString().split("T")[0]
    const end_date = endDate?.toISOString().split("T")[0]
    const pseudo = form.get('pseudo') as string
    const artist_email = form.get('artist_email') as string

    if (!startDate || !endDate || !shop_id || !artist_email ){
      setLoading(false)
      setError('champs obligatoires manquants coté front')
      return
    }

    const guest_data = {
      start_date: start_date as string,
      end_date: end_date as string,
      shop_id: shop_id,
      city_id: city_id,
      email: artist_email,
      pseudo: pseudo

    }
    try{
      const result = await handleForm(guest_data)
      if(!result){
        setLoading(false)
        setError("une erreur est survenue, reessayez")
        return
      }
      if (result.error){
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

  return(
    <div className='relative'>
      {loading &&
        <div className="inset-0 absolute bg-gray-50 z-50 flex items-center justify-center">
          <p>loading...</p>
        </div>
      }
        <div className="flex flex-col ">
          <p className="border self-end" onClick={() => onClose(false)}>
            x
          </p>
          <p>Créer un guest</p>
          {error  &&
            <p className="text-red">{error}</p>

          }
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="start_date">Date de début</label>
                <DatePickerDemo value ={startDate ?? undefined } retreiveDate={(date:Date | null) => {setStartDate(date)}}/>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="start_date">Date de fin</label>
                <DatePickerDemo value ={endDate ?? undefined } retreiveDate={(date:Date | null) => {setEndDate(date)}}/>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="artist_name">Pseudo / nom de l&apos;artiste</label>
                <input name='pseudo' type="text" required className="border"/>
              </div>
              <div className="flex flex-col gap-2">
                <p>Inviter l&apos;artiste à confirmer le guest :</p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email"></label>
                  <input name="artist_email" type="email" className='border' required placeholder="Renseigner de mail de l'artiste"  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type='submit'>Creer</button>
            </div>
          </form>
        </div>
    </div>
  )
}
