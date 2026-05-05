import ArtistCard from "../card/artistCard"
import GuestCard from "../card/guestCard"
import ShopCard from "../card/shopCard"
import ArtistShopCard from "../card/artistShopCard"


export default function List({data, type}) {

  return(
        <>
         {data.map((item, index) => (
          <div key={index} className="flex justify-center">
            {type === "artists" &&
              <ArtistCard artist={item}/>
            }
            {type === "shops" &&
              <ShopCard shop={item}/>}
            {type === "guests" &&
              <GuestCard event={item}/>}
          </div>
        ))}
        </>
  )
}
