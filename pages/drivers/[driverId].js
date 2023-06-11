import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import { ExportToCsv } from "export-to-csv";
import Layout from "../../components/Layout";
import { Card, Flex, Text, ProgressBar, MarkerBar } from "@tremor/react";

export default function DriverDetail() {
  const router = useRouter();
  const data = router.query.driverId;
  
  //console.log(data);

  const [trips, setTrips] = useState([]);
  const [detail, setDetail] = useState({});
  const [car, setCar]=useState()
  const [sup, setSup]= useState([])
 

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
        getVehicle(info.assignedVehicle)
      } catch (err) {
        console.log("error getting driver data", err);
      }
    };


    const getVehicle=async  (id) =>{
      try{
        const res = await axios.get(
          `${process.env.BACKEND_URL}/feed/vehicles/${id}`,
          {
            withCredentials: true,
          }
        );
        const info = await res.data
        setCar(info._doc)
  
      }catch(err){
        console.log('error geeting vehicle', err)
      }
    }

    const getSup= async () =>{
      try{
        const res= await axios.get(
           `${process.env.BACKEND_URL}/feed/engineers`,
          {
            withCredentials: true,
          }
        )
        const data= await res.data
        setSup(await res.data)
        
      } catch (err){
        console.log('error getting sup', err)
      }
    }

    getSup()
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

    const onApprove= async (driverIdd, tripId, supid, suptrip) => {
      try {
        const res = await axios.put(
          `${process.env.BACKEND_URL}/feed/driver/${driverIdd}/dailytrips/${tripId}`,
          {
            withCredentials: true,
          }
        );
  
        console.log("succesful", await res.data);
        alert("approved");
    approveSup(supid,suptrip,tripId)
      } catch (err) {
        console.log("unsuccessful", err);
      }
    }

    const approveSup= (supid, identifier, tripId)=>{
      sup.forEach(item=>{
        if(item._id===supid){
          item.toApprove.forEach(async trip=>{
            if(trip.identifier){
              if(trip.identifier===identifier){
                try{
                  const res = await axios.put(
                    `${process.env.BACKEND_URL}/feed/supervisor/${supid}/todos/${trip._id}`,
                    {
                      withCredentials: true,
                    }
                  );
                } catch(err){
                  console.log('could not approve supervisor data',err)
                }
              }
            }else {
              if(trip.tripId=== tripId){
                try{
                  const res = await axios.put(
                    `${process.env.BACKEND_URL}/feed/supervisor/${supid}/todos/${trip._id}`,
                    {
                      withCredentials: true,
                    }
                  );
                } catch(err){
                  console.log('could not approve supervisor data',err)
                }
              }
            }
          })
        }
      })
    }

  return (
  
   <Layout>

<div className="my-5 bg-white rounded-lg md:h-[200px] md:flex">
                <div className="p-2 md:border-r border-b border-slate-400 mx-2 md:w-1/5 space-y-2">
                    <h1 className="text-sky-600 text-xl ">{detail.username}</h1>
                    <p className="text-md text-gray-600">{car?.carNumber}</p>
                    <p className="text-md text-gray-600">{car?.model}</p>
                </div>


                <div className="p-2 md:border-r border-b border-slate-400 mx-2 md:w-2/5 space-y-2">
                    <h1 className="text-sky-600 text-xl ">Metrics</h1>
                    
                    <Text>Mileage: {totalTrip} Km</Text>
                    <MarkerBar markerValue={totalTrip} minValue={0} maxValue={100} color="green" className="mt-4" />

                    <Text>Work Hours: {Math.abs(totalWorkHours.toFixed(2))} hrs</Text>
                    <MarkerBar markerValue={Math.abs(totalWorkHours.toFixed(2))} minValue={0} maxValue={100} color="blue" className="mt-4" />
                    
                    <Text> OverTime: {Math.abs(totalOverTime.toFixed(2))} hrs</Text>
                    <MarkerBar markerValue={Math.abs(totalOverTime.toFixed(2))} minValue={0} maxValue={100} color="red" className="mt-4" />
                </div>

                <div className="p-2 mx-5">
                    <h1 className="text-sky-500 text-lg">Actions</h1>

                    <h1 
                    className=" w-3/5 text-center p-2 border border-slate-400 hover:text-white hover:bg-slate-400 hover:scale-95 cursor-pointer transition duration-200 ease-out"
                    onClick={exportCsvData}
                    >
                        Export Data
                    </h1>
                </div>
            </div>

   

   

      <div className=" w-full md:w-4/5  mx-auto">
        <div className="flex justify-between bg-blue-500 text-white p-2 items-center">
          <p className="font-semibold mx-2 text-lg">Trips</p>
        
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
              onApprove={()=>onApprove(data, trip._id, trip.supervisor, trip.identifier)}
            />
          </div>
        )).reverse()}
      </div>
      </Layout>
    
  );
}
