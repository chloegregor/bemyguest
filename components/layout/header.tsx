import Link from 'next/link'
import { LogComponent } from '../log/page'
export default function Header() {
  return (
    <div>
      <div className="border flex justify-between">
        <Link href="/"><p className="text-[2em]">
          be my guest
        </p></Link>
        <LogComponent/>
      </div>
    </div>
  )
}
