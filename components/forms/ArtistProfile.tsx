'use client'


import {useState, useEffect} from 'react'
import { createClient } from '@/lib/supabase/client'
import GooglePlace from '../searchForm/google/googlePlace'
import { handleArtistForm } from '@/app/actions/users'
import Image from 'next/image'


interface ResidencyProps{
  id: string
  shop_id: string | null
  shops: {
    shop_name: string,
    shop_slug:string
    shop_place_id: string ,
  } | null
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
    avatar: string | null
  }
  residency: ResidencyProps
  city: CityProps
}

interface handleEditArtistProps {
  id: string,
  pseudo: string
  avatar:string | null
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
  const supabase = createClient()
  const [resident, setResident] = useState(residency?.shops?.shop_place_id ? true :  false)
  const [pseudo, setPseudo] = useState(artist.pseudo)
  const [instagram, setInstagram] = useState<string |null >(artist.insta)
  const [shopSlug, setShopSlug] = useState<string|null>(residency?.shops?.shop_slug ?? null)
  const [shopName, setShopName] = useState<string|null>(residency?.shops?.shop_name?? null)
  const [invitation, setInvitation] = useState<boolean>(false)
  const [shopPlaceId, setPlaceId] = useState<string|null>(residency?.shops?.shop_place_id ?? null)
  const [cityPlaceId, setCityPlaceId] = useState<string|null>(city?.city_id ?? null)
  const [cityName, setCityName] = useState<string|null>(city?.city_name ?? null)
  const [avatar, setAvatar] = useState<File | undefined>(undefined)
  const [disabled, isDisabled] = useState(true)

  const [error, setError] = useState<string|null>(null)
  console.log("shop", shopPlaceId)
  console.log("city", cityPlaceId)
  console.log(disabled)


  function resetAll(){
    setCityName(null)
    setShopName( null)
    setShopSlug(null)
    setPlaceId( null)
    setCityPlaceId( null)
  }

  useEffect(() => {
    const has_location = shopPlaceId || cityPlaceId
    const has_changed = pseudo != artist.pseudo || instagram != artist.insta || avatar || shopPlaceId != residency?.shops?.shop_place_id || cityPlaceId != city?.city_id

    isDisabled(!has_location || !has_changed)

  }, [pseudo, instagram, avatar, shopPlaceId, cityPlaceId])


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

    const avatar_file = avatar
    let url = artist.avatar
    if (avatar_file){
       const filepath = `avatar/${artist.id}`
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
      url = `${publicUrl.publicUrl}?t=${Date.now()}`
    }


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
      cityPlaceId: new_city_place_id,
      avatar: url
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
          <input name="pseudo" defaultValue={artist.pseudo} type="text" className='border' required onChange={(e) => setPseudo(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="instagram">Instagram</label>
          <input className='border' defaultValue={artist.insta ?? ""} type="url" name="instagram" onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <p>Avatar</p>
          {artist.avatar &&
          <div className='border p-2 flex justify-center'>
            <div className='relative w-[100px] aspect-square rounded-full overflow-hidden border-2 border-black'>
              <Image src={artist.avatar} alt='avatar' fill className='object-cover'></Image>
            </div>
          </div>
          }
          <label htmlFor="avatar" className='border p-1 w-fit'>Browse...</label>
          <input id='avatar' name='avatar' type="file" className='hidden' accept="image/png, image/jpeg" onChange={(e) => setAvatar(e.target.files?.[0])} />
          <p>{avatar?.name}</p>
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
        <button disabled={disabled} type="submit" className={` w-fit border self-end ${disabled ? "text-gray-500 cursor-not-allowed" : "cursor-pointer"}`}>Modifier</button>
        {error &&
          <p>{error}</p>
        }
      </div>

    </form>
  )
}
