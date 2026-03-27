import ShopCard from "../card/shopCard"

export default function ShopsList({data}) {
  console.log("shopdata", data)
  return(
      <>
         {data.map((shop, index) => (
          <div key={index}>
              <ShopCard shop={shop}/>
          </div>
        ))}
        </>
  )
}
