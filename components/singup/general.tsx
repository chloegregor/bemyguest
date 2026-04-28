'use client'
import  {useState} from 'react'
import {useRouter} from 'next/navigation'
import FormShopInCreateUser from '../searchForm/form/formShopInCreateUser'
import { SingUpData } from '@/types'
import { SingUp } from '@/app/actions/auth'

interface FormData {
  role: string,
  email: string,
  password:string,
  instagram?: string,
  pseudo?: string,
  pseudo_slug?: string
}

export default function GeneralSignUp() {
  const router = useRouter()
  const [role, setRole] = useState('particulier')
  const [resident, setResident] = useState(false)
  const [shopSlug, setShopSlug] = useState<string|null>(null)
  const [shopName, setShopName] = useState<string|null>(null)

  const [shopPlaceId, setPlaceId] = useState<string|null>(null)
  const [cityPlaceId, setCityPlaceId] = useState<string|null>(null)
  const [error, setError] = useState<string|null>(null)



  function resetAll(){
    setShopName(null)
    setShopSlug(null)
    setPlaceId(null)
    setCityPlaceId(null)
  }


   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault()
    const form = new FormData(e.currentTarget)

    const role = form.get('role') as string
    const email = form.get('email')as string
    const password = form.get('password') as string
    const pseudo = form.get('pseudo') as string
    const pseudo_slug = pseudo?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').trim()
    const instagram = form.get('instagram') as string

    const sing_up_data : SingUpData = {
      role: role,
      resident: resident,
      email: email,
      password: password,
      pseudo: pseudo,
      pseudoSlug: pseudo_slug,
      insta: instagram,
      shopName: shopName,
      shopSlug: shopSlug,
      shopPlaceId: shopPlaceId,
      cityPlaceId: cityPlaceId
    }
    try {
      const results = await SingUp(sing_up_data)
      if (results.error){
        setError(results.error)
        return
      }

      router.push(results.redirect!)

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erreur inconnue")
      }
    }

  }



  return (
    <div className="flex justify-center">
      <div className="lg:w-[60%] border p-10">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <p>Je suis:</p>
            <div className='flex gap-5'>
              <div className="flex gap-2">
                <label htmlFor="particulier">particulier.e</label>
                <input name="role" value="particulier" defaultChecked type="radio" onClick={()=> {setRole("particulier"); resetAll()}} required />
              </div>
              <div className="flex gap-2">
                <label htmlFor="artiste">artiste</label>
                <input name="role" value="artist" type="radio" onClick={()=> {setRole("artist"); resetAll()} }/>
              </div>
              <div className="flex gap-2">
                <label htmlFor="artiste">représentant.e de shop</label>
                <input name="role" value="shop" type="radio" onClick={()=> {setRole("shop"); resetAll()}}/>
              </div>
            </div>
            <div className="flex flex-col gap-5" >
              <label htmlFor="email">email</label>
              <input name="email" type="email" className='border' required />
            </div>
            <div className="flex flex-col gap-5">
              <label htmlFor="password">password</label>
              <input name="password" type="password" minLength={8} className='border' required/>
            </div>

              {role != "particulier" && (
                <div className='flex flex-col gap-5'>
                  <div className="flex flex-col gap-5">
                    <label htmlFor="instagram">Instagram</label>
                    <input className='border' type="url" name="instagram" />
                  </div>

                  {role === "artist" && (
                    <div className='flex flex-col gap-5'>
                      <div className="flex flex-col gap-5">
                        <label htmlFor="pseudo">pseudo</label>
                        <input name="pseudo" type="text" className='border' required/>
                      </div>
                      <div className="flex gap-5 ">
                        <p>je suis résident d'un shop : </p>
                        <div className="flex gap-2">
                          <label htmlFor="no">Non</label>
                          <input name="resident" value='false' defaultChecked type="radio" onClick={() => {setResident(false); resetAll()}}/>
                        </div>
                        <div className="flex gap-2">
                          <label htmlFor="yes">Oui</label>
                          <input name="resident" value='true' type="radio" onClick={() => {setResident(true); resetAll()}}/>
                        </div>
                      </div>
                      {resident === true ? (
                        <div>
                          <p>Selectionnez votre shop: </p>
                          <FormShopInCreateUser type={"shop"}
                          setObject={(slug:string, placeId:string, name:string) =>
                          {setShopSlug(slug)
                          setPlaceId(placeId)
                          setShopName(name)}}/>
                        </div>
                      ):<div>
                        <p>Selectionnez votre ville de résidence:</p>
                          <FormShopInCreateUser type={"city"}
                          setObject={(slug:string, placeId:string, name:string) =>
                          {setCityPlaceId(placeId)}}/>
                        </div>
                      }
                    </div>
                  )}
                  {role === "shop" && (
                    <div>
                      <FormShopInCreateUser type={"shop"}
                      setObject={(slug:string, placeId:string, name:string) =>
                      {setShopSlug(slug)
                      setPlaceId(placeId)
                      setShopName(name)}}/>
                    </div>
                  )}
                </div>

              )}
          </div>
          <button className="border w-fit self-end px-2 py-1 rounded-full" type="submit">valider</button>
        </form>
        <p>{error}</p>
      </div>
    </div>
  )
}
