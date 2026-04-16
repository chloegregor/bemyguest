'use client'
import Link from 'next/link'
import { useSearchParams, usePathname} from 'next/navigation'
import {useState} from 'react'

interface NavProps {
  city: string
  isnearby: boolean
}

export default function NavBar({city, isnearby}: NavProps){
  const nearby = isnearby ? "/nearby" : ""
  const pathname = usePathname()
  const searchparams = useSearchParams()
  const section = pathname.includes("shops") ? "shops" : pathname.includes("guests") ? "guests" : pathname.includes("artists") ? "artists" : "tout"
  const radius = searchparams.get('radius')
  const radius_url = radius ? `?radius=${radius}` : ""
  const [ActiveTab, setActiveTab] = useState(section)
  console.log("activeTab", ActiveTab)
   return (
    <ul>
      <div className="flex gap-5">
        <li><Link className={ActiveTab === "tout" ? "underline" : ""} href={`/${city}${nearby}${radius_url}`}>Tout</Link></li>
        <li><Link className={ActiveTab === "guests" ? "underline" : ""} href={`/${city}${nearby}/guests${radius_url}`}>Guests</Link></li>
        <li><Link className={ActiveTab === "artists" ? "underline" : ""} href={`/${city}${nearby}/artists${radius_url}`}>Artistes</Link></li>
        <li><Link className={ActiveTab === "shops" ? "underline" : ""} href={`/${city}${nearby}/shops${radius_url}`}>Shops</Link></li>
      </div>
    </ul>
  )
}
