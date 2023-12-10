"use client";
import { priceToEther, timestampToDate } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";


interface EventCardProps {
  id: number
  title: string
  description: string
  category: string
  owner: string
  startTime: number
  deposit: number
  imagePath: string
  maxCapacity: number
  confirmedRSVPs: string[]
}

const Card: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  category,
  startTime,
  deposit,
  imagePath,
  maxCapacity,
  confirmedRSVPs
}) => {
 

  return (
    <div
      className={`w-full bg-gradient-to-b from-[#17191F] to-[#0F1115] rounded-3xl`}
    >
      <div className="w-full h-44">
        <Image
          src={imagePath}
          width={200}
          height={200}
          alt="Solar Panel"
          loading="lazy"
          className="w-full h-full rounded-t-3xl"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center w-full mb-4">
          <p className="bg-gray-700 text-xs whitespace-nowrap text-customGold rounded-full py-2 px-3">
            {'category'}
          </p>
          <p className="text-base whitespace-nowrap text-white">
            {3} days Left
          </p>
        </div>
        <h4 className="text-base text-white font-medium mb-4">{title}</h4>
        <p className=" text-gray-400 text-sm mb-4 pb-2">
          {/* {descripring(0, 168)}... */}
        </p>
  

        <div className="flex justify-between items-center">
          <h3 className=" text-gray-400 text-xs">
            Ticket <span className=" text-white">{priceToEther(deposit)} Matic</span>
          </h3>
          <h3 className=" text-gray-400 text-xs">
            RSVPs <span className=" text-white">{confirmedRSVPs.length} / {maxCapacity.toString()}</span>
          
          </h3>
          <h3 className=" text-gray-400 text-xs">
            Start Date <span className=" text-white">{timestampToDate(startTime)}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Card;
