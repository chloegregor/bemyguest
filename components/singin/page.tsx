'use client'
import { LogIn } from "@/app/actions/auth"
import {useState} from 'react'
import Link from 'next/link'

export default function SingIn(){

  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(form: FormData){
    const email = form.get('email') as string
    const password = form.get('password') as string

    if(!email || !password){
      setError("Champ obligatoire manquant")
      return
    }
    try{
      const results = await LogIn(email, password)
      if (results.error){
        setError(results.error)
      }

    }catch (err){
      setError("erreur inconnue")
    }

  }

  return(
    <div className="flex justify-center">
      <div className="lg:w-[60%] border p-10">
        <form className="flex flex-col gap-5" action={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div>

              <label htmlFor="email">Email</label>
              <input name="email" type="email" className='border' required />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input name="password" type="password" minLength={8} className='border' required/>
            </div>
          </div>
          <div>
            <button type="submit">se connecter</button>
          </div>
        </form>
        <Link href="/sign_up">S'inscrire</Link>
      </div>
    </div>
  )
}
