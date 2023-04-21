import axios from "axios";
//import { link } from "fs";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DriverCard from "../components/DriverCard";
import Header from "../components/Header";
import { ExportToCsv } from "export-to-csv";
import Cookies from 'js-cookie'

export default function Home() {
  const [drivers, setDrivers] = useState([]);
  const router = useRouter();

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
    <div>
      <Header />

      <div className="p-2 flex space-x-3 ml-5">
        <Link
          href="/newdriver"
          className="border border-blue-500 rounded p-2 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition transfrom duration-300 ease-out"
        >
          <h1>Add Driver</h1>
        </Link>

        <button
          onClick={exportCsv}
          className="border border-blue-500 rounded p-2 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition transfrom duration-300 ease-out"
        >
          <h1>Export Data</h1>
        </button>
      </div>

      <h1 className="font-semibold text-lg p-2 ml-5 mt-3">Drivers </h1>
      <div className="space-y-4 mt-5">
        {drivers?.map((driver) => (
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
  );
}
