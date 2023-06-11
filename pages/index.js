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
import { Table,TableBody,TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

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
<div className="p-2">

<div className='my-2'>
                <h1 className='text-lg '>Driver Management</h1>
            </div>
            {/* Data display */}

            <div className="my-5 bg-white rounded-lg h-[200px] flex">
                <div className="p-2 border-r border-slate-400">
                    <h1 className="text-sky-600 text-lg ">Total Drivers</h1>
                    <p className="text-6xl text-gray-600">{drivers?.length}</p>
                </div>

                <div className="p-2 mx-5 space-y-2">
                    <h1 className="text-sky-500 text-lg">Actions</h1>

                    <h1 
                    className=" p-2 border border-slate-400 hover:text-white hover:bg-slate-400 hover:scale-95 cursor-pointer transition duration-200 ease-out"
                    onClick={()=>{router.push('/newdriver')}}
                    >
                        Add Driver
                    </h1>


                    <h1 
                    className=" p-2 border border-slate-400 hover:text-white hover:bg-slate-400 hover:scale-95 cursor-pointer transition duration-200 ease-out"
                    onClick={exportCsv}
                    >
                        Export Data
                    </h1>
                </div>
            </div>


      <div className="p-2 flex space-x-3 ">

<div className="md:w-3/5 w-5/6">
      <input type='text'
       placeholder='Search driver'
       value={search}
       onChange={(e)=>setSearch(e.target.value)}
        className="border md:w-3/5 border-neutral-500 p-2 md:ml-[10px] rounded-md"/>

      
    </div> 
      </div>


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
              carId={driver.assignedVehicle}
            />
          </div>
        ))}
      </div>
      </div>
      </Layout>
  );
}
