import EventCard from "@/components/EventCard";
import { useMagicContext } from "@/components/magic/MagicProvider";
import { getMyEvents } from "@/utils";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const MyEvents = () => {


  const { provider } = useMagicContext()
  const [events, setEvents] = useState([])
  const [account, setAccount] = useState<string | null>(null)




  useEffect(() => {
    const user = localStorage.getItem('user');
    setAccount(user);
  }, [])

  useEffect(() => {
    const getMyEventHandler = async () => {
  // const provider = new ethers.providers.Web3Provider(window.ethereum)

  if (provider) {
    const eventList = await getMyEvents(provider, account)
    
    setEvents(eventList)
    console.log(eventList);
  }
}
    getMyEventHandler()
  }, [provider])

	return (
		<>
			<span>MyEvents</span>
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
		</>
	)
}

export default MyEvents