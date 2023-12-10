"use client";

import Card from "@/components/molecules/cards/card";
import React, { useEffect, useState } from "react";
import { useMagicContext } from "@/components/magic/MagicProvider";
import { getEvents, } from "@/lib/utils";
import { ethers } from "ethers";
import { useModalContext } from "@/components/ui/ModalProvider";

export default function Dashboard() {
 

  const { magic } = useMagicContext()
  const { eventCreated } = useModalContext()

  const [account, setAccount] = useState<string>('')
  const [events, setEvents] = useState([])

  const getEventsHandler = async () => {
   const provider = await magic?.wallet.getProvider();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const res = await getEvents(web3Provider)
    setEvents(res)
  }


  useEffect(() => {
    const user = localStorage.getItem("user");
    setAccount(user);
  }, [account]);

  useEffect(() => {
    getEventsHandler()
  }, [magic, eventCreated])



  return (
    <div className=" bg-auth-bg">
      <div className="py-14 px-16">
        <h2 className="text-white font-bold text-3xl">Trending Now</h2>
        <div className="my-10 grid grid-flow-row grid-cols-3 gap-6">
          {events &&
            events.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                confirmedRSVPs={item.confirmedRSVPs}
                deposit={item.deposit.toString()}
                owner={item.owner}
                imagePath={item.imagePath}
                maxCapacity={item.maxCapacity}
                category={"Renewable"}
                description={"Great Project that has the pontentail to disrupt"}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
