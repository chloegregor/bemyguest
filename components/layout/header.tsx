import Link from 'next/link'
import { LogComponent } from '../log/page'
export default function Header() {
  return (
    <div>
      <div className=" flex justify-between">
        <Link href="/"><h1 className="text-[4em]">
          be my guest
        </h1></Link>
        <LogComponent/>
      </div>
    </div>
  )
}
