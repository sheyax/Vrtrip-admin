import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import { ExportToCsv } from "export-to-csv";

export default function DriverDetail() {
  const router = useRouter();
  const data = router.query.driverId;
  //console.log(data);

  const [trips, setTrips] = useState([]);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URL}/feed/drivers/${data}`,
          {
            withCredentials: true,
          }
        );

        const info = await res.data._doc;
        setTrips(info.dailyTrips);
        setDetail(info);
      } catch (err) {
        console.log("error getting driver data", err);
      }
    };

    getData();
  }, []);

  let totalTrip = 0;
  let totalWorkHours = 0;
  let totalOverTime = 0;
  // Total Trip Function
  trips.forEach((data) => {
    if (!data.aprroved) return;
    totalTrip += data.endOdometer - data.startOdometer;

    // working hours
    let startingTime = new Date(`${data.date}T${data.startTime}`).getTime();
    let endingTime = new Date(`${data.date}T${data.endTime}`).getTime();
    let workingHours = (endingTime - startingTime) / 60000 / 60;
    totalWorkHours += workingHours;

    //OverTime
    if (data.endTime >= "18:00" && data.endTime < "7:00") {
      totalOverTime += workingHours;
    }

    //add outstation
  });

  const exportCsvData = () => {
    const csvData = trips;
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: `${detail.username} Trip Log`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    console.log(csvData);
    csvExporter.generateCsv(csvData);
  };


    //Approve function 

    const onApprove= async (driverIdd, tripId) => {
      try {
        const res = await axios.put(
          `${process.env.BACKEND_URL}/feed/driver/${driverIdd}/dailytrips/${tripId}`,
          {
            withCredentials: true,
          }
        );
  
        console.log("succesful", await res.data);
        alert("approved");
    
      } catch (err) {
        console.log("unsuccessful", err);
      }
    }

  return (
    <div className="bg-gray-100 h-full flex flex-col">
      <Header />
   

      <div className=" mt-2 bg-white w-[300px] p-5 flex md:w-3/5 m-auto justify-between rounded shadow-lg">
        <div>
          <h1 className="font-semibold text-2xl">{detail.username}</h1>
          <p className="text-sm text-gray-400">SE : Micheal Alade</p>
        </div>
        <div className="text-sm text-gray-400">
          <h1 className="font-semibold text-black">Car Details</h1>
          <p>{detail.assignedVehicle}</p>
          <p>{detail.vehicleModel}</p>
        </div>
      </div>

      <div className=" flex md:grid md:grid-cols-3 m-auto space-x-5 my-5">
        <div className="">
          <p className="font-semibold">Total Milage</p>
          <div className=" rounded-full cursor-pointer p-5 w-18 font-bold flex justify-center text-blue-600 hover:bg-blue-500 hover:text-white transition transfrom duration-300 ease-out">
            <h1 className="m-auto"> {totalTrip} Km</h1>
          </div>
        </div>

        <div className="">
          <p className="font-semibold">Work Hours</p>
          <div className=" rounded-full cursor-pointer p-5 w-18 font-bold flex justify-center text-blue-600 hover:bg-blue-500 hover:text-white transition transfrom duration-300 ease-out">
            <h1 className="m-auto"> {totalWorkHours.toFixed(2)} hrs</h1>
          </div>
        </div>

        <div className="">
          <p className="font-semibold">OverTime</p>
          <div className=" rounded-full cursor-pointer p-5 w-18 font-bold flex justify-center text-blue-600 hover:bg-blue-500 hover:text-white transition transfrom duration-300 ease-out">
            <h1 className="m-auto"> {totalOverTime.toFixed(2)} hrs</h1>
          </div>
        </div>
      </div>

      <div className=" w-full md:w-4/5  mx-auto">
        <div className="flex justify-between bg-blue-500 text-white p-2 items-center">
          <p className="font-semibold mx-2 text-lg">Trips</p>
          <button
            onClick={exportCsvData}
            className="border border-white rounded p-2 text-white font-semibold hover:bg-blue-800 hover:text-white transition transfrom duration-300 ease-out"
          >
            Export data
          </button>
        </div>
        {trips?.map((trip) => (
          <div key={trip._id}>
            <TripCard
              key={trip.startTime}
              date={trip.date}
              startOdo={trip.startOdometer}
              endOdo={trip.endOdometer}
              startTime={trip.startTime}
              endTime={trip.endTime}
              startLoc={trip.startLocation}
              endLoc={trip.endLocation}
              approved={trip.aprroved}
              onApprove={()=>onApprove(data, trip._id)}
            />
          </div>
        )).reverse()}
      </div>
    </div>
  );
}
