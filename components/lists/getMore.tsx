
'use client'

import { useState } from 'react'
import List from './List'
import { useSearchParams } from 'next/navigation'

interface Props {
  key?: string
  category: string,
  initial_data?: any,
  total?: number,
  city_id?: number,
  radius?: string,
  city?: any
  data_function?: any

}


export default function GetMore({key, category, initial_data, total, city_id, radius, city,  data_function}: Props){
  const [displayedData, setDisplayedData] = useState([])
  const [page, setPage] = useState(1)
  console.log("initialdata", initial_data)
  const hasMore = (initial_data.length + displayedData.length) < total



  async function handleClick() {
    const nextPage = (page + 1)
    setPage(nextPage)
    console.log("page", nextPage)
    const {data} = radius && radius != "0" ? await data_function(city, radius, nextPage) : await data_function(city_id, nextPage)
    setDisplayedData(prev => [...prev, ...data])
  }

  return (
    <div>
      {displayedData.length > 0 &&
      <div className="grid grid-cols-5 gap-5">
        <List data={displayedData} type={category}/>
      </div>
      }
      {hasMore &&
        <div className="flex justify-center items-center px-1 rounded-full border w-fit">
          <button onClick={() => handleClick()}>Voir plus</button>
        </div>

      }
    </div>
  )
}
