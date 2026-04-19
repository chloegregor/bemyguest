// app/actions/getArtists.ts
'use server'
import { createClient } from '@/lib/supabase/server'

interface CityType {
  id: number
  city_name: string
  lat: number
  lng: number
}

const LIMIT = 20

export async function getMoreGuests(city_id: number, page: number) {
  const supabase = await createClient()
  const from = (page - 1) * LIMIT
  const to = from + LIMIT - 1

  const { data, count } = await supabase
    .from('users')
    .select('*, user_style(*, styles(*)), shop_id(*, cities(*))', { count: 'exact' })
    .eq('role', 'artist')
    .eq('city_id', city_id)
    .range(from, to)

  return { data, count }
}

export async function getMoreNearByGuests(city: CityType, radius: string, page: number) {
  const supabase = await createClient()
  const from = (page - 1) * LIMIT
  const to = from + LIMIT - 1

  const latDelta = parseInt(radius) / 111
  const lngDelta = parseInt(radius) / (111 * Math.cos(city.lat * Math.PI / 180))

  const { data: nearbyCities } = await supabase
    .from('cities')
    .select('id')
    .gte('lat', city.lat - latDelta)
    .lte('lat', city.lat + latDelta)
    .gte('lng', city.lng - lngDelta)
    .lte('lng', city.lng + lngDelta)

  const cityIds = nearbyCities?.map(c => c.id) || []

  const { data, count } = await supabase
    .from('users')
    .select('*, cities(*), user_style(*, styles(*)), shop:shop_id(*)', { count: 'exact' })
    .eq('role', 'artist')
    .in('city_id', cityIds)
    .range(from, to)

  return { data, count }
}
