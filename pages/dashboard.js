import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import ChartArea from "../components/ChartArea";
import ListBar from "../components/ListBar";
import ChartDough from "../components/ChartDough";
import ChartBar from "../components/BarChart";



const Dashboard = () => {

    const [drivers, setDrivers] = useState([]);
    
    useEffect(() => {
        //get all drivers
        const getDrivers = async () => {
          try {
            const res = await axios.get(
              `${process.env.BACKEND_URL}/feed/drivers`,
              {
                withCredentials: true,
              }
            );
            const info = await res.data
    
            setDrivers(info);
          } catch (err) {
            console.log("cannot get drivers data", err);
          }
        };

        getDrivers()
    },[])

    
  //get all trips and sort by date
  let sortedTrips = [];

  drivers.forEach((driver) => {
    let trips = driver.dailyTrips;
    trips.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    sortedTrips.push(
      ...trips.map((trip) => ({
        date: trip.date,
        mileage: trip.endOdometer - trip.startOdometer,
      }))
    );
  });


  // check trips in progress and completed trips 
  let completedTrips = [];
  drivers.map((driver) => {
    let completed = 0;
    let incomplete = 0;

    driver.dailyTrips.map((trip) => {
      if (trip.completed == true) {
        completed++;
      } else {
        incomplete++;
      }
    });

    const exportData = {
      completed: completed,
      inprogress: incomplete,
    };

    completedTrips.push(exportData);
  });

  let totalComp = 0;
  let totalIncom = 0;

  completedTrips.map((trip) => {
    var comp = 0;
    totalComp += trip.completed;
    totalIncom += trip.inprogress;
  });

  const completionData = [
    {
      name: "Trips Completed",
      value: totalComp,
    },
    { name: "Trips in Progress", value: totalIncom },
  ];


   //get total trips per company

   let companyTrips = [];
   drivers.forEach((driver) => {
     const companyName = driver.company;
     const index = companyTrips.findIndex(
       (company) => company.name === companyName
     );
     if (index === -1) {
       companyTrips.push({
         name: companyName,
         totalTrips: driver.dailyTrips.length,
       });
     } else {
       companyTrips[index].totalTrips += driver.dailyTrips.length;
     }
   });


    //get each driver and trips
    const driverTrips = [];
  drivers.map((item, i) => {
    var km = 0;
    item.dailyTrips.map((trip) => {
      const mileage = trip.endOdometer - trip.startOdometer;
      km += mileage;
    });

    const extractedData = {
      name: item.username,
      trips: item.dailyTrips.length,
      mileage: km,
    };
    driverTrips.push(extractedData);
  });

    console.log(driverTrips)

    return (
        <Layout>
            <div className="md:flex  md:space-x-2 md:space-y-0 space-y-2 p-2">
            <ListBar title="Trip Progress" data={completionData} />
            <ChartDough data={driverTrips} title="Drivers Performance"/>
            </div>

            <div className="mt-2  space-y-2 p-2">
            <ChartArea
              title={"Total daily trips (Km)"}
              dataChart={sortedTrips}
            />

<ChartBar
              title={"Individual driver performance"}
              subtitle={"Representing driver trips and total mileage"}
              data={driverTrips}
            />
            </div>
        </Layout>
      );
}
 
export default Dashboard;