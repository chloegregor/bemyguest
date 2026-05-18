import {useState} from 'react'
import GooglePlace from '../searchForm/google/googlePlace'
import { handleArtistForm } from '@/app/actions/users'


interface ResidencyProps{
  id: string
  shop_id: string
  shops: {
    shop_name: string,
    shop_slug:string
    shop_place_id: string,

  }
}

interface CityProps {
  city_name: string,
  city_id: string
}


interface ArtistProps {
  onSuccess :(slug: string) => void,
  artist: {
    id: string
    pseudo: string,
    insta: string | null,
  }
  residency?: ResidencyProps
  city?: CityProps
}

interface handleEditArtistProps {
  id: string,
  pseudo: string,
  resident: boolean
  residency_id?: string
  instagram: string
  pseudoSlug: string
  shopPlaceId?: string | null
  shopName?: string | null
  shopSlug?: string | null
  cityPlaceId?:string | null
  owner_email?:string
}



export default function ArtistProfile({onSuccess, artist, residency, city}: ArtistProps){
  const [resident, setResident] = useState(residency?.shops?.shop_place_id ? true :  false)
  const [shopSlug, setShopSlug] = useState<string|null>(residency?.shops?.shop_slug ?? null)
  const [shopName, setShopName] = useState<string|null>(residency?.shops?.shop_name?? null)
  const [invitation, setInvitation] = useState<boolean>(false)
  const [shopPlaceId, setPlaceId] = useState<string|null>(residency?.shops?.shop_place_id ?? null)
  const [cityPlaceId, setCityPlaceId] = useState<string|null>(city?.city_id ?? null)
  const [cityName, setCityName] = useState<string|null>(city?.city_name ?? null)
  const [error, setError] = useState<string|null>(null)


  function resetAll(){
    setCityName(null)
    setShopName( null)
    setShopSlug(null)
    setPlaceId( null)
    setCityPlaceId( null)
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
     e.preventDefault()
    const data = new FormData(e.currentTarget)
    const pseudo = data.get('pseudo') as string
    const new_pseudo_slug = pseudo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').trim()
    const instagram = data.get('instagram') as string
    const email = data.get('owner_email') as string
    const new_shop_name = shopName
    const new_shop_slug = shopSlug
    const new_shop_place_id = shopPlaceId
    const new_city_place_id = cityPlaceId
    const is_resident = resident
    const residency_id = residency?.id

    const form: handleEditArtistProps = {
      id: artist.id,
      pseudo: pseudo,
      pseudoSlug: new_pseudo_slug,
      resident: is_resident,
      instagram: instagram,
      owner_email: email,
      residency_id: residency_id,
      shopName: new_shop_name,
      shopSlug: new_shop_slug,
      shopPlaceId: new_shop_place_id,
      cityPlaceId: new_city_place_id
    }

    try {
      const updatedprofil = await handleArtistForm(form)
      console.log("profile update", updatedprofil)
      if(updatedprofil.error){
        if(updatedprofil.error === "email"){
          setInvitation(true)
          return
        }
        setError(updatedprofil.error)
        return
      }
      onSuccess(updatedprofil.slug)

    }catch(err){
      setError(err instanceof Error ? err.message : "une erreur inconnue")
    }








  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-5'>
        <div className="flex flex-col gap-2">
          <label htmlFor="pseudo">pseudo</label>
          <input name="pseudo" defaultValue={artist.pseudo} type="text" className='border' required  />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="instagram">Instagram</label>
          <input className='border' defaultValue={artist.insta ?? ""} type="url" name="instagram" />
        </div>
        <div className="flex gap-5 ">
          <p>je suis résident.e dans un shop : </p>
          <div className="flex gap-2">
            <label htmlFor="no">Non</label>
            <input name="resident" value='false' checked={resident === false} type="radio" onChange={() => {setResident(false); resetAll()}}/>
          </div>
          <div className="flex gap-2">
            <label htmlFor="yes">Oui</label>
            <input name="resident" value='true' type="radio"  checked={resident === true} onChange={() => {setResident(true); resetAll()}}/>
          </div>
        </div>
        {resident === true ? (
          <div className=" flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p>Selectionnez votre shop: </p>
              <GooglePlace type={"shop"}
              setObject={(slug:string, placeId:string, name:string) =>
              {setShopSlug(slug)
              setPlaceId(placeId)
              setShopName(name)}}
              present_data={shopName}
              />
            </div>
            {invitation &&
              <div className="flex flex-col gap-2">
                <p>Invitez la ou le gerant.e du shop à s&apos;inscrire pour rendre votre profil visible sur la page du shop</p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="owner_email">Email</label>
                  <input type="email" name="owner_email" required className='border' />
                </div>
              </div>
            }
          </div>
        ):<div>
          <p>Selectionnez votre ville de résidence:</p>
            <GooglePlace type={"city"}
            setObject={(slug:string, placeId:string, name:string) =>
            {setCityPlaceId(placeId)}}
            present_data={cityName} />
          </div>
        }
        <button type="submit" className=" w-fit border self-end">Modifier</button>
        {error &&
          <p>{error}</p>
        }
      </div>

    </form>
  )
}
