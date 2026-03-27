
import GuestCard from "../card/guestCard"

export default function GuestsList({data}) {
  console.log("guestdata", data)
  return(
    <>
     {data.map((event, index) => (
      <div key={index}>
          <GuestCard event={event}/>
      </div>
    ))}
    </>

)
}
