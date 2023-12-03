
import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { getContractBalance, getEvents, contractInstance } from '../utils'
import EventCard from '@/components/EventCard'
import { ModalContext } from '@/contexts/ModalContext'
import { useMagicContext } from "@/components/magic/MagicProvider";

const Home = () => {

  const [events, setEvents] = useState([])
  const { eventCreated } = useContext(ModalContext)
  // const { provider } = useMagicContext()

const getEventHandler = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const eventList = await getEvents(provider)
  setEvents(eventList);
}

useEffect(() => {
    getEventHandler()
  }, [eventCreated])

//   useEffect(() => {
//     interface ItemType {
//       title: string
//       phone: string
//       attendance: string
//       capacity: string
// }
//   // const provider = new ethers.providers.Web3Provider(window.ethereum)
//   const contract =  contractInstance(provider)

//   const sendSMS = async (data: any) => {

//     await Promise.all(data.map(async (item: string) => {
//       const str: string[] = item.split('-')

//       const itemStr: ItemType = {
//         title: str[0],
//         phone: str[1],
//         attendance: str[2],
//         capacity: str[3]
//       }

//       const body = `Your event ${itemStr.title} just ended. You had ${itemStr.attendance}/${itemStr.capacity} in attendance`

//       try {
//         const response = await fetch('/api/twilio', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             body,
//             to: itemStr.phone
//           })
//         })

//         const res = await response.json()

//       } catch (error) {
//         console.error('Error sending SMS:', error)
//       }
//     })
//   )}

//     contract.on('Phones', sendSMS)

//     // Remove the listener when the component is unmounted
//     return () => {
//       contract.off('Phones', sendSMS)
//     }
//   }, [])

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