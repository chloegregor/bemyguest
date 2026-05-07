import Link from 'next/link'
import { LogComponent } from '../log/page'
export default function Header() {
  return (
    <div>
      <div className=" flex justify-between ">
        <Link className=' flex gap-1 items-center' href="/"><p className="font text-[4em] red">be</p><h1 className="text-[4em]">
          MYG
        </h1><p className="font text-[4em] red">uest</p></Link>
        <div className='mt-[10px]'>
          <LogComponent/>
        </div>
      </div>
    </div>
  )
}
