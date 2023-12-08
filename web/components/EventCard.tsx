import { ModalContext } from '@/contexts/ModalContext'
import { confirmAllAttendees, createNewRSVP, priceToEther, timestampToDate } from '@/utils'
import { ethers } from 'ethers'
import Image from 'next/image'
import { useContext } from 'react'
import { useMagicContext } from '@/components/magic/MagicProvider'

interface EventCardProps {
  id: number
  title: string
  owner: string
  startTime: string
  deposit: number
  imagePath: string
  maxCapacity: number
  confirmedRSVPs: string[]
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  startTime,
  deposit,
  imagePath,
  maxCapacity,
  confirmedRSVPs
  }) => {

    const { setEventCreated } = useContext(ModalContext)
    const { provider } = useMagicContext()

    const rsvp = async (eventId: number, deposit: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const res = await createNewRSVP(provider?.getSigner(), eventId, deposit)
        if (res) {
          setEventCreated(true)
        }
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='sm:w-1/2 md:w-[30%] bg-gradient-to-b from-blue-1 to-green-1 rounded-2xl p-[1px] mb-12 mx-2'>
      <div className='bg-dark-grey-1 space-y-2 rounded-2xl p-4 h-full text-white'>

        <p className='text-xl font-bold leading-6 text-start text-white'>
          { title }
          <span className="block font-normal text-sm">
            <span className="text-bright-grey-1">Ticket Price: </span>{priceToEther(deposit)} Matic</span>
        </p>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col items-start justify-center'>
            <p className='text-sm font-medium text-bright-grey-1'>
              RSVPs
              <span className='text-sm font-normal text-white ml-2'>{confirmedRSVPs.length} / {maxCapacity.toString()}</span>
            </p>
            
          </div>
          <div className='flex flex-col items-start justify-center'>
            <p className='text-sm font-medium text-bright-grey-1'>
              Start Date
              <span className='text-sm font-normal text-white ml-2'>{timestampToDate(startTime)}</span>
            </p>
            
          </div>
        </div>

         <Image
          className='' 
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: '100%', height: '140px' }}
          src={imagePath} 
          alt="app pix" />

        <div className="absolute top-0 right-2 shadow-[0_4px_9px_-4px_#e4a11b]">
          <style jsx>{`
          .status {
            color: #fefefe;
            border-radius: 8px;
            padding: 3px;
          }
        .Cancelled { background: #ffcbcb; }
        .InProgress { background: LightSteelBlue; }
        .Reviewing { background: grey; }
        .Completed { background: green; }
      `}</style>
          {/* <span className={`status ${STATUS(status)}`}>{STATUS(status)}</span> */}
          {/* <span className="InProgress">In Progress</span> */}
      </div>
      
        <button onClick={() => rsvp(id, deposit)} className="flex flex-row space-x-2 ml-1 items-center justify-center w-full py-3 bg-gradient-to-tr from-blue-1 to-green-1 rounded-lg">
          <span className='text-sm font-bold text-white'>RSVP</span>
        </button>
        
      </div>
    </div>

  )
}

export default EventCard