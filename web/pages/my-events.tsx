import { useMagicContext } from "@/components/magic/MagicProvider";
import { getMyEvents } from "@/utils";
import { ethers } from "ethers";
import { useEffect } from "react";

const MyEvents = () => {
  // const { provider } = useMagicContext()
const getMyEventHandler = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  console.log('ppprovider')
  console.log(provider)
  const eventList = await getMyEvents(provider)
  // console.log(eventList);
}

useEffect(() => {
    getMyEventHandler()
  }, [])

	return (
		<>
			<span onClick={getMyEventHandler}>MyEvents</span>
		</>
	)
}

export default MyEvents