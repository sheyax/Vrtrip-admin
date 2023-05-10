import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {Dropdown, DropdownItem} from '@tremor/react'

export default function NewDriver() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [driverId, setDriverId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [engineer, setEngineer] = useState("");
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState("");

  const router = useRouter();


  const [vehicles, setVehicles]= useState([])
  const [engineers, setEngineers] = useState([])

  const departments= [
    {
      id:"001",
    label:"Airtel Engineering"
  },
  {
    id:"002",
  label:"Airtel Technical"
},
{
  id:"003",
label:"MTN Engineering"
},

{
  id:"004",
label:"MTN Technical"
},
{
  id:"005",
label:"Admin"
},
{
  id:"006",
label:"Marketing & Sales"
},
  ]

  const companies= [
    {
      name:"Patjeda"
    },
    {
      name:"Global Logistics"
    },
    {
      name:"Spark Motors"
    }
  ]


  const getVehicles =async () =>{
      try {
          const res = await axios.get(
            `${process.env.BACKEND_URL}/feed/vehicles`,
            {
              withCredentials: true,
            }
          );
          const info = await res.data
  
          setVehicles(info);
        } catch (err) {
          console.log("cannot get vehicles data", err);
        }

  }

  const getEngineers =async () =>{
    try {
        const res = await axios.get(
          `${process.env.BACKEND_URL}/feed/engineers`,
          {
            withCredentials: true,
          }
        );
        const info = await res.data

        setEngineers(info);
        console.log(engineers)
      } catch (err) {
        console.log("cannot engineers data", err);
      }

}

  useEffect(()=>{
      getVehicles()
      getEngineers()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/auth/driver/register`,
        {
          username,
          password: password,
          driverId,
          phoneNumber,
          vehicleModel,
          vehicle,
          company,
          department,
          supervisor: engineer
        },
        {
          withCredentials: true,
        }
      );
      alert("succesful");
      console.log(response.data);
      router.push("/");
    } catch (err) {
      setError("unsuccessful");
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 h-screen">
      <Header />

      <div className="flex flex-col items-center mt-2">
        <h1 className="m-auto font-semibold text-lg ">Register New Driver</h1>
      </div>
      {error && <p>{error}</p>}
      <div className="mt-5 w-3/5 mx-auto ">
        <form
          onSubmit={handleSubmit}
          className=" flex items-center flex-col space-y-5"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-3/4 p-2 m-auto rounded-lg shadow-md outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-3/4 p-2 m-auto rounded-lg shadow-md  outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Driver ID"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="w-3/4 p-2 m-auto rounded-lg shadow-md  outline-none text-sm"
          />

          <input
            type="text"
            placeholder="phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-3/4 p-2 m-auto rounded-lg shadow-md  outline-none text-sm"
          />

          <input
            type="text"
            placeholder="vehicle Model"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            className="w-3/4 p-2 m-auto rounded-lg shadow-md  outline-none text-sm"
          />

          <Dropdown className="max-w-full" 
          placeholder="Assign Vehicle"
          onValueChange={(value)=> {
            setVehicle(value)
             }}>
            {vehicles?.map(item=>(
              <DropdownItem value={item._id} text={`${item.model}  (${item.carNumber})`}/>
            ))}
          </Dropdown>

          
          <Dropdown className="max-w-full" 
          placeholder="Assign Supervisor"
          onValueChange={(value)=> setEngineer(value)}>
            {engineers?.map(item=>(
              <DropdownItem value={item._id} text={item.name? item.name: item.engineerId}/>
            ))}
          </Dropdown>

          <Dropdown className="max-w-full" 
          placeholder="Assign Department"
          onValueChange={(value)=> setDepartment(value)}>
            {departments?.map(item=>(
              <DropdownItem value={item.label} text={`${item.label} `}/>
            ))}
          </Dropdown>

          <Dropdown className="max-w-full" 
          placeholder="Car Company"
          onValueChange={(value)=> setCompany(value)}>
            {companies?.map(item=>(
              <DropdownItem value={item.name} text={`${item.name} `}/>
            ))}
          </Dropdown>

          <button
            type="submit"
            className="hover:bg-blue-500 text-blue-500 border border-blue-500 p-2 rounded shadow-sm font-semibold hover:text-white hover:scale-105 hover:font-bold transition transfrom duration-300 ease-out "
          >
            Register Driver
          </button>
        </form>
      </div>
    </div>
  );
}
