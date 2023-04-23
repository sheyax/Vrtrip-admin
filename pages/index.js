import axios from "axios";
//import { link } from "fs";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DriverCard from "../components/DriverCard";
import Header from "../components/Header";
import { ExportToCsv } from "export-to-csv";
import Cookies from 'js-cookie'
import SideBar from "../components/SideBar";
import Layout from "../components/Layout";

export default function Home() {
  const [drivers, setDrivers] = useState([]);
  const router = useRouter();
  const [search, setSearch] = useState('');

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
    //get admin
    const getAdmin = async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URL}/auth/admin/user`,
          {
            withCredentials: true,
          }
        );
        const info = await res.data;
        const{token}= info
        Cookies.set('jwt',token)
        getDrivers();
      } catch (err) {
        console.log(err);
        router.push("/login");
      }
    };

    getAdmin();
  }, []);

  const getDecimal = (float) => {
    const numStr = float.toString();
    const index = numStr.indexOf(".");
    const wholeNum = numStr.slice(0, index);
    const decimalNum = numStr.slice(index);

    return [wholeNum, decimalNum];
  };

  //Exporting data
  const exportCsv = () => {
    const csvData = drivers?.map((driver) => {
      const { username, assignedVehicle, vehicleModel, dailyTrips, driverId } =
        driver;
      let totalTrip = 0;
      let totalWorkHours = 0;
      let totalOvertime = 0;

      dailyTrips.forEach((data) => {
        if (!data.aprroved) return;
        totalTrip += data.endOdometer - data.startOdometer;

        // working hours
        let startingTime = new Date(`${data.date}T${data.startTime}`).getTime();
        let endingTime = new Date(`${data.date}T${data.endTime}`).getTime();
        let workingHours = (endingTime - startingTime) / 60000 / 60;
        totalWorkHours += workingHours;

        //OverTime
        if (data.endTime >= "18:00" && data.endTime < "7:00") {
          totalOvertime += workingHours;
        }

        //add outstation
      });
      return {
        username,
        assignedVehicle,
        vehicleModel,
        totalTrip,
        totalWorkHours,
        totalOvertime,
      };
    });
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: "Drivers Data",
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(csvData);
  };
  return (
 <Layout>
<div className="">
      <div className="p-2 flex space-x-3 ml-5">

<div className="md:w-3/5 w-5/6">
      <input type='text'
       placeholder='Search driver'
       value={search}
       onChange={(e)=>setSearch(e.target.value)}
        className="border w-full border-neutral-500 p-2  rounded-md"/>

        <div className="flex justify-end space-x-2">
          <h1 onClick={()=> router.push('/newdriver')} 
          className="md:hidden text-sm text-blue-500">New driver</h1>
          <h1 onClick={exportCsv} 
          className="md:hidden text-sm text-blue-500"> Export data</h1>
        </div>
    </div> 
        <Link
          href="/newdriver"
          className="hidden md:block border border-blue-500 rounded p-2 text-blue-500 font-semibold hover:bg-blue-500
           hover:text-white tr=ansition 
           transfrom duration-300 ease-out"
        >
          <h1>Add Driver</h1>
        </Link>

        <button
          onClick={exportCsv}
          className="hidden md:block border border-blue-500 rounded p-2 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition transfrom duration-300 ease-out"
        >
          <h1>Export Data</h1>
        </button>
      </div>

     
     
      <h1 className="font-semibold text-lg p-2 ml-5 mt-2">Drivers </h1>
      <div className="space-y-4 mt-2 mb-5">
        {drivers?.filter((item)=>{
          return search.toLowerCase() === ''? item: item.username.toLowerCase().includes(search)
        }).map((driver) => (
          <div key={driver._id} className="">
            <DriverCard
              vehicleNumber={driver.assignedVehicle}
              vehicleType={driver.vehicleModel}
              name={driver.username}
              trips={driver.dailyTrips}
              driverId={driver._id}
            />
          </div>
        ))}
      </div>
      </div>
      </Layout>
  );
}
