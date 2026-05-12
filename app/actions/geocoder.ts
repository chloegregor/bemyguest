'use server'

export async function geocodePlaceId(placeId: string) {
  const [frRes, enRes] = await Promise.all([await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&language=fr&key=${process.env.GEOCODING_API}`),
    await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&language=en&key=${process.env.GEOCODING_API}`)
  ])

  if (!frRes.ok || !enRes.ok){
    const error = await frRes.text()
    throw new Error (`erreur reseau geocoding avec placeId ___ ${error}`)
  }

  const [frData, enData] = await Promise.all([
    frRes.json(), enRes.json()
  ])

  if (frData.status !=="OK" || !frData.results?.length || enData.status !=="OK" || !enData.results?.length ) return null

  return {fr: frData.results[0], en: enData.results[0]}
}

export async function geocodeAddress(address:string){
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GEOCODING_API}`

  )
  if(!res.ok){
    throw new Error ("erreur reseau geocoding avec address")
  }

  const data = await res.json()

  if (data.status !== "OK" || !data.results?.length) return null
  return data.results[0].place_id
}
