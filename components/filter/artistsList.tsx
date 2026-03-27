import ArtistCard from "../card/artistCard"

export default function ArtistsList({data}) {
  console.log("artistdata", data)
  return(
        <>
         {data.map((artist, index) => (
          <div key={index}>
              <ArtistCard artist={artist}/>
          </div>
        ))}
        </>
  )
}
