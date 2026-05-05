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
      <div className="flex gap-5">
        <li><Link className={`font text-[1.5em] ${section === "tout" ? "text-[#f3cc09]" : ""}`} href={city ? `${location_url}${radius_url}` : "/"}>tout</Link></li>
        <li><Link className={`font text-[1.5em] ${section === "guests" ? "text-[#f3cc09]" : ""}`} href={`${location_url}/guests${radius_url}`}>guests</Link></li>
        <li><Link className={`font text-[1.5em] ${section === "artists" ? "text-[#f3cc09]" : ""}`} href={`${location_url}/artists${radius_url}`}>artistes</Link></li>
        <li><Link className={`font text-[1.5em] ${section === "shops" ? "text-[#f3cc09]" : ""}`} href={`${location_url}/shops${radius_url}`}>shops</Link></li>
      </div>
    </ul>
  )
}
