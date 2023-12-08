import EventCard from "@/components/EventCard";
import { useMagicContext } from "@/components/magic/MagicProvider";
import { getMyEvents, getMyRSVPs } from "@/utils";
import { useEffect, useState } from "react";

interface Event {
  id: number
  title: string
  confirmedRSVPs: boolean
  deposit: number
  owner: string
  imagePath: string
  maxCapacity: number
  startTime: string
}

const MyEvents = () => {


  const { provider } = useMagicContext()
  const [events, setEvents] = useState<Event[]>([])
  const [RSVPS, setRSVPs] = useState([])
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user');
    setAccount(user);
  }, [])

  useEffect(() => {
    const getMyEventHandler = async () => {

  if (account) {
    const eventList = await getMyEvents(provider, account)

    setEvents(eventList)
    console.log(eventList);
  }
}
    getMyEventHandler()
  }, [provider])

  useEffect(() => {
    const getMyRSVPHandler = async () => {

  if (account) {
    const eventList = await getMyRSVPs(provider, account)

    setRSVPs(eventList)
    console.log(eventList);
  }
}
    getMyRSVPHandler()
  }, [provider])

	return (
		<>
			<div>
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
          {!events.length && (<span>Host your first event</span>)}
        </div>
      </div>

    <div>
      <span>My RSVPs</span>
      <div className="flex flex-wrap">
        {RSVPS && RSVPS.map(event => (
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
        {!RSVPS.length && (<span>RSVP</span>)}
      </div>
    </div>
		</>
	)
}

export default MyEvents