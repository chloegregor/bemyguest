import { useState, useRef } from 'react'

interface GooglePlaceProps {
  setObject: (nameSlug: string, placeId:string, name:string) => void
  type: string
}

interface PlaceSuggestion {
  placePrediction: {
    placeId: string
    text: { text: string }
    mainText: { text: string }
    secondaryText:{text:string}
  }
}

export default function GooglePlace({setObject, type}: GooglePlaceProps) {
  const placeholder = type ==="city" ? 'Chercher une ville' : "Chercher un shop"
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  async function fetchSuggestions(input: string) {
    if (input.length < 3) return setSuggestions([])

    const { AutocompleteSuggestion } = await (window as any).google.maps.importLibrary('places')

    const primaryType = type === "shop" ? ["establishment"] : type === "city" ? ["locality"] : ""

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      includedRegionCodes: ['fr', 'be', 'ch'],
      includedPrimaryTypes: primaryType
    })

    setSuggestions(suggestions)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    // debounce 300ms
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }


  return (
    <div className='relative w-[200px] '>
      <input className="border w-full"
        value={query}
        onChange={handleInput}
        placeholder={placeholder}
      />
      {suggestions.length > 0 && (
        <ul className="border absolute bg-white p-2 w-full top-full z-100">
          {suggestions.map((s) => {
            const label = s.placePrediction.text.text
            const name = s.placePrediction.mainText.text
            const placeId = s.placePrediction.placeId
            return (
              <li
              key={s.placePrediction.placeId}
              onClick={() => {
                  console.log(s.placePrediction)
                  const name_slug = name.toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')     // supprime les accents
                  .replace(/[^a-z0-9\s-]/g, '')        // supprime tout sauf lettres, chiffres, espaces, tirets
                  .trim()
                  .replace(/\s+/g, '-')                // espaces → tirets
                  .replace(/-+/g, '-')                 // fusionne les tirets consécutifs
                  .replace(/^-|-$/g, '') 
                  setQuery(label)
                  setObject(name_slug, placeId, name)
                  setSuggestions([])
                }}
              >
                {label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
