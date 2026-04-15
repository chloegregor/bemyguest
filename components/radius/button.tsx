'use client'
import {useRouter, usePathname } from 'next/navigation'


export default function RadiusButton(){
  const router = useRouter()
  const pathname = usePathname()
  console.log("pathname", pathname)
  return(
    <button onClick={() => router.push(`${pathname}/nearby?radius=50`)}  className='p-2 rounded-full border border-blue'>étendre la rechercher</button>
  )
}
