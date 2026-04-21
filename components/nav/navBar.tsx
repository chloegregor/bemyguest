'use client'
import Link from 'next/link'
import { useSearchParams, usePathname} from 'next/navigation'
import {useState} from 'react'

interface NavProps {
  city?: string
}

export default function NavBar({city}: NavProps){
  const pathname = usePathname()
  const searchparams = useSearchParams()
  const section = pathname.includes("shops") ? "shops" : pathname.includes("guests") ? "guests" : pathname.includes("artists") ? "artists" : "tout"
  const radius = searchparams.get('radius')
  const radius_url = radius ? `?radius=${radius}` : ""
  const city_url = city ? `/${city}`: ""

   return (
    <ul>
      <div className="flex gap-5">
        <li><Link className={section === "tout" ? "underline" : ""} href={city ? `${city_url}${radius_url}` : "/"}>Tout</Link></li>
        <li><Link className={section === "guests" ? "underline" : ""} href={`${city_url}/guests${radius_url}`}>Guests</Link></li>
        <li><Link className={section === "artists" ? "underline" : ""} href={`${city_url}/artists${radius_url}`}>Artistes</Link></li>
        <li><Link className={section === "shops" ? "underline" : ""} href={`${city_url}/shops${radius_url}`}>Shops</Link></li>
      </div>
    </ul>
  )
}
