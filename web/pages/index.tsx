
import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getContractBalance, getEvents, contractInstance } from '../utils'
import EventCard from '@/components/EventCard'
import { ModalContext } from '@/contexts/ModalContext'
import { useMagicContext } from "@/components/magic/MagicProvider";

const Home = () => {

  const [events, setEvents] = useState([])
  const { eventCreated } = useContext(ModalContext)
  const { provider } = useMagicContext()

  useEffect(() => {
    const getEventHandler = async () => {
      const eventList = await getEvents(provider);
      setEvents(eventList);
    };

    getEventHandler();
  }, [eventCreated, provider]);

  return (
  <div className="px-4 py-12 md:py-20 md:px-10 lg:px-16 xl:px-24">
    <div className='container flex flex-col px-4 py-5 mx-auto md:px-10 lg:px-16 xl:px-24 my-[100px]'>
      <p className="text-4xl md:text-9xl xl:text-[14rem] py-2 text-white font-bold leading-tight font-ClashDisplay">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-red-1 to-gold-1">Event</span>
        <span className='bg-clip-text text-transparent bg-gradient-to-b from-blue-1 to-green-1'>Hub</span>
      </p>
      <p className="md:text-3xl xl:text-[2rem] my-4 md:px-[48px] lg:px-40 font-light leading-normal text-white">
        Events Redefined: Seamlessly Host, Effortlessly Attend
      </p>
    </div>
    
  <div className="w-[70%] mx-auto">
    <div className="flex flex-wrap">
      {events && events.map(event => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          confirmedRSVPs={event.confirmedRSVPs}
          deposit={event.deposit.toString()}
          owner={event.owner}
          imagePath={event.imagePath}
          maxCapacity={event.maxCapacity}
          startTime={event.eventTimestamp.toString()}
        />
      ))}
    
    </div>
  </div>
</div>


  )
}

export default Home