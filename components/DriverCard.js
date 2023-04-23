import { useRouter } from "next/router";
import React from "react";

export default function DriverCard({
  name,
  vehicleNumber,
  vehicleType,
  trips,
  driverId,
}) {
  const router = useRouter();
  let totalTrip = 0;
  let totalWorkHours = 0;
  let totalOverTime = 0;
  // Total Trip Function
  trips.forEach((data) => {
    if (!data.aprroved) return;
    totalTrip += data.endOdometer - data.startOdometer;

    // working hours
    let startingTime = new Date(`${data?.date}T${data.startTime}`).getTime();
    let endingTime = new Date(`${data?.date}T${data.endTime}`).getTime();
    let workingHours = (endingTime - startingTime) / 60000 / 60;
    totalWorkHours += workingHours;

    //console.log(data.date, workingHours)
    //OverTime
    if (data.endTime >= "18:00" && data.endTime < "7:00") {
      totalOverTime += workingHours;
    }

    //add outstation
  });

  
  return (
    <div className="grid  grid-cols-3 md:grid-cols-5 
    bg-white shadow-lg p-2 items-start mx-5 
    space-x-2
    border border-gray-800 rounded-lg ">
      <h1 className="text-md font-semibold ">{name}</h1>

      <div className="text-gray-600 text-xs hidden md:block">
        <p>Car No. : {vehicleNumber}</p>
        <p>Car Model : {vehicleType}</p>
      </div>

      <div className="text-gray-600 text-xs ">
        <h1>Total Milage: </h1>
        <h1 className="font-semibold">{totalTrip} Km</h1>
      </div>

      <div className="text-gray-600 text-xs hidden md:block">
        <h1>Work Hours: {totalWorkHours.toFixed(2)} hrs</h1>
        <h1 className="">OverTime: {totalOverTime.toFixed(2)} hrs </h1>
      </div>

      <div className="flex ">
        <button
          onClick={() => router.push(`drivers/${driverId}`)}
          className="bg-transparent
           hover:bg-blue-500 text-blue-700 
           font-semibold 
           hover:text-white py-2 px-4 
           border border-blue-500 
           hover:border-transparent rounded
          ml-auto
          scale-90 md:scale-100
           "
        >
          Details
        </button>
      </div>
    </div>
  );
}
