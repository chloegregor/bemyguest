'use client'
import Link from 'next/link'
import { useSearchParams, usePathname} from 'next/navigation'
import {useState} from 'react'

interface NavProps {
  city?: string
  country?: string
}

export default function NavBar({country, city}: NavProps){
  const pathname = usePathname()
  const searchparams = useSearchParams()
  const section = pathname.includes("shops") ? "shops" : pathname.includes("guests") ? "guests" : pathname.includes("artists") ? "artists" : "tout"
  const radius = searchparams.get('radius')
  const radius_url = radius ? `?radius=${radius}` : ""
  const location_url = city ? `/${country}/${city}`: ""

   return (
    <ul>
      <div className="flex gap-5 items-center">
        <li><Link href={city ? `${location_url}${radius_url}` : "/"}><p className={`font text-[1.5em] ${section === "tout" ? "polygon" : ""}`}>tout</p>
        </Link></li>
        <li><Link href={`${location_url}/guests${radius_url}`}><div className={`font text-[1.5em] ${section === "guests" ? "polygon" : ""}`}>guests</div></Link></li>
        <li><Link  href={`${location_url}/artists${radius_url}`}><div className={`font text-[1.5em] ${section === "artists" ? "polygon" : ""}`} >artistes</div></Link></li>
        <li><Link href={`${location_url}/shops${radius_url}`}><div className={`font text-[1.5em] ${section === "shops" ? "polygon" : ""}`}>shops</div></Link></li>
      </div>
    </ul>
  )
}
