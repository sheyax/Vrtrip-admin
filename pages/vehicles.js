import Layout from "../components/Layout"
import {useEffect, useState} from "react"
import axios from 'axios'
import { Table,TableBody,TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';
import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';


const Vehicles= ()=>{
    const [vehicles, setVehicles]= useState()
    const [drivers,setDrivers]= useState()
    const [selectUser, setSelectUser]= useState("")

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
             <div className='p-2 '>

<div className='my-2'>
    <h1 className='text-lg '>Vehicle Management</h1>
</div>

<div className="my-5 bg-white rounded-lg h-[200px] flex">
                <div className="p-2 border-r border-slate-400">
                    <h1 className="text-sky-600 text-lg ">Total Vehicles</h1>
                    <p className="text-6xl text-gray-600">{vehicles?.length}</p>
                </div>

                <div className="p-2 mx-5 space-y-2">
                    <h1 className="text-sky-500 text-lg">Actions</h1>

                    <h1 
                    className=" p-2 border border-slate-400 hover:text-white hover:bg-slate-400 hover:scale-95 cursor-pointer transition duration-200 ease-out"
                    onClick={()=>{router.push('/vehicles')}}
                    >
                        New Vehicle
                    </h1>


   
                </div>
            </div>

            <input type='text'
       placeholder='Search Vehicle No'
       value={selectUser}
       onChange={(e)=>setSelectUser(e.target.value)}
       className="p-2  rounded-lg bg-transparent border border-slate-400"/>

            <Table className="mt-2 border-collapse table-fixed">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell className='border border-slate-300'>
                            Vehicle Number
                        </TableHeaderCell >
                        <TableHeaderCell className='border border-slate-300 text-right'>
                            Model
                        </TableHeaderCell >

                        <TableHeaderCell className='border border-slate-300 text-right'> Actions </TableHeaderCell>
                    </TableRow>

                </TableHead>

                <tbody>
                    {
                        vehicles?.filter(item =>{
                            return selectUser.toLowerCase() === ''? item: item.carNumber.toLowerCase().includes(selectUser)
                        }).map((user)=>(
                            <TableRow key={user._id}>
                                <TableCell className='border border-slate-300'> {user.carNumber}</TableCell>
                                <TableCell className='border border-slate-300 text-right'>{user.model}</TableCell>
                                {/* <TableCell className='border border-slate-300 text-right'>{user.toApprove.length}</TableCell> */}
                                <TableBody className='items-center text-right'>
                                    <AiFillDelete size={20} color="red" />
                                </TableBody>
                            </TableRow>
                        ))
                    }
                </tbody>
            </Table>

             
            </div>
        </Layout>
    )
}

export default Vehicles