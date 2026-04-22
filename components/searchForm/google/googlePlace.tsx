import { useState, useRef } from 'react'

interface GooglePlaceProps {
  setCity: (city: string, placeId:string) => void
  type: string
}

interface PlaceSuggestion {
  placePrediction: {
    placeId: string
    text: { text: string }
    mainText: { text: string }
  }
}

export default function GooglePlace({setCity, type}: GooglePlaceProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  async function fetchSuggestions(input: string) {
    if (input.length < 3) return setSuggestions([])

    const { AutocompleteSuggestion } = await (window as any).google.maps.importLibrary('places')

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      includedRegionCodes: ['fr', 'be', 'ch'],
      includedPrimaryTypes: ['establishment'],
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
        placeholder="Cherche une ville..."
      />
      {suggestions.length > 0 && (
        <ul className="border absolute bg-white p-2 w-full top-full z-100">
          {suggestions.map((s) => {
              const label = s.placePrediction.text.text
              const label_slug = s.placePrediction.mainText.text
              const placeId = s.placePrediction.placeId
              return (
                <li
                key={s.placePrediction.placeId}
                onClick={() => {
                  const city_slug = label_slug.toLowerCase()
                  .normalize('NFD')                        // décompose les accents
                  .replace(/[\u0300-\u036f]/g, '')         // supprime les accents
                  .replace(/\s+/g, '-')                    // espaces → tirets
                  .trim()
                  setQuery(label)
                  setCity(city_slug, placeId)
                  console.log(s.placePrediction)
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
