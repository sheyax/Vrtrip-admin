import Layout from "../components/Layout"
import {useEffect, useState} from "react"
import axios from 'axios'

const Vehicles= ()=>{
    const [vehicles, setVehicles]= useState()
    const [drivers,setDrivers]= useState()

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

    useEffect(()=>{
        getVehicles()
    },[])

    return (
        <Layout>
            <div>
                <h1>Vehicles</h1>

                {vehicles?.map((vehicle)=>(
                    <div key={vehicle._id}>
                        <h1>{vehicle.carNumber}</h1>
                        <h1>{vehicle.model}</h1>
                        </div>
                ))}
            </div>
        </Layout>
    )
}

export default Vehicles