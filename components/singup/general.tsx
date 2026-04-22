'use client'
import  {useState} from 'react'

export default function GeneralSignUp() {
  const [role, setRole] = useState('particulier')
  console.log(role)
  return (
    <div className="flex justify-center">
      <div className="lg:w-[60%] border p-10">
        <form action="">
          <div className="flex flex-col gap-5">
            <p>Je suis:</p>
            <div className='flex gap-5'>
              <div className="flex gap-2">
                <label htmlFor="particulier">particulier.e</label>
                <input name="role" value="particulier" defaultChecked type="radio" onClick={()=> setRole("particulier")} required />
              </div>
              <div className="flex gap-2">
                <label htmlFor="artiste">artiste</label>
                <input name="role" value="artist" type="radio" onClick={()=> setRole("artist")}/>
              </div>
              <div className="flex gap-2">
                <label htmlFor="artiste">représentant.e de shop</label>
                <input name="role" value="shop" type="radio" onClick={()=> setRole("shop")}/>
              </div>
            </div>
            <div className="flex flex-col gap-5" >
              <label htmlFor="email">Email</label>
              <input name="email" type="text" className='border' required />
            </div>
            <div className="flex flex-col gap-5">
              <label htmlFor="password">Password</label>
              <input name="password" type="text" className='border' required/>
            </div>
            <div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
