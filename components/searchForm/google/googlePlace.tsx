import { useState, useRef } from 'react'

export default function GooglePlace({setCity}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  console.log('query', query)
  async function fetchSuggestions(input: string) {
    if (input.length < 3) return setSuggestions([])

    const { AutocompleteSuggestion } = await (window as any).google.maps.importLibrary('places')

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      includedRegionCodes: ['fr', 'be', 'ch'],
      includedPrimaryTypes: ['locality']
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
        <ul className="border absolute bg-white p-2 w-full top-6 z-100">
          {suggestions.map((s) => {
              const label = s.placePrediction.text.text
              const label_slug = s.placePrediction.mainText.text
              console.log('label main', s.placePrediction.mainText.text)
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
                  setCity(city_slug)
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
