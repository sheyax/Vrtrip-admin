import React, {useState, useEffect} from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Table,TableBody,TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';
import Select from 'react-select'
import { useRouter } from "next/router";
import { AiFillDelete, AiOutlineDelete } from 'react-icons/ai';

export default function UsersDash() {
    const [users, setUsers]= useState()
    const [selectUser, setSelectUser]= useState("")
    const router= useRouter()

    const getEngineers =async () =>{
        try {
            const res = await axios.get(
              `${process.env.BACKEND_URL}/feed/engineers`,
              {
                withCredentials: true,
              }
            );
            const info = await res.data
    
            setUsers(info);
            console.log(users)
          } catch (err) {
            console.log("cannot engineers data", err);
          }
    
    }


    useEffect(() => {
  
        getEngineers()
    
    }, [])

    const deleteUser= async (id) =>{
        try{
            const res= await axios.delete(`${process.env.BACKEND_URL}/feed/users/${id}`)
        }catch (err){
            console.log(err)
        }
    }
    
  return (
    <Layout>
        <div className='p-2 '>

            <div className='my-2'>
                <h1 className='text-lg '>User Management</h1>
            </div>
            {/* Data display */}

            <div className="my-5 bg-white rounded-lg h-[200px] flex">
                <div className="p-2 border-r border-slate-400">
                    <h1 className="text-sky-600 text-lg ">Total Users</h1>
                    <p className="text-6xl text-gray-600">{users?.length}</p>
                </div>

                <div className="p-2 mx-5">
                    <h1 className="text-sky-500 text-lg">Actions</h1>

                    <h1 
                    className=" p-2 border border-slate-400 hover:text-white hover:bg-slate-400 hover:scale-95 cursor-pointer transition duration-200 ease-out"
                    onClick={()=>{router.push('/newuser')}}
                    >
                        Create a new user 
                    </h1>
                </div>
            </div>
            <div>
            <input type='text'
       placeholder='Search UserId'
       value={selectUser}
       onChange={(e)=>setSelectUser(e.target.value)}
       className="p-2  rounded-lg bg-transparent border border-slate-400"/>
            </div>
            <Table className="mt-2 border-collapse table-fixed">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell className='border border-slate-300'>
                            Username
                        </TableHeaderCell >
                        <TableHeaderCell className='border border-slate-300 text-right'>
                            user ID
                        </TableHeaderCell >

                        <TableHeaderCell className='border border-slate-300 text-right'> Pending tasks </TableHeaderCell>
                        <TableHeaderCell className='border border-slate-300 text-right'> Actions </TableHeaderCell>
                    </TableRow>

                </TableHead>

                <tbody>
                    {
                        users?.filter(item =>{
                            return selectUser.toLowerCase() === ''? item: item.engineerId.toLowerCase().includes(selectUser)
                        }).map((user)=>(
                            <TableRow key={user._id}>
                                <TableCell className='border border-slate-300'> {user.name}</TableCell>
                                <TableCell className='border border-slate-300 text-right'>{user.engineerId}</TableCell>
                                <TableCell className='border border-slate-300 text-right'>{user.toApprove.length}</TableCell>
                                <TableBody className='items-center text-right'>
                                    <AiFillDelete size={20} color="red" onClick={()=>deleteUser(user._id)}/>
                                </TableBody>
                            </TableRow>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    
    </Layout>
  );
}
