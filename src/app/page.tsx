'use client'

import Button from '@/components/atoms/button'
import { useModalContext } from '@/components/ui/ModalProvider'


export default function Home() {

  const { toggleModal } = useModalContext()

  return (
    <main>
      <div className='container flex flex-col px-4 py-5 mx-auto md:px-10 lg:px-16 xl:px-24 my-[100px]'>
      <p className="text-4xl md:text-9xl xl:text-[14rem] py-2 text-white font-bold leading-tight font-ClashDisplay">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-red-1 to-gold-1">Event</span>
        <span className='bg-clip-text text-transparent bg-gradient-to-b from-blue-1 to-green-1'>Hub</span>
      </p>
      <p className="md:text-3xl xl:text-[2rem] my-4 md:px-[48px] lg:px-40 font-light leading-normal text-white text-center">
        Events Redefined: Seamlessly Host, Effortlessly Attend
      </p>
      <div className="flex justify-center my-12">
        <Button
            onClick={toggleModal}
            className="w-[200px] text-black flex text-base whitespace-nowrap"
          >
            Create Event
          </Button>
      </div>
    </div>
    </main>
  )
}
