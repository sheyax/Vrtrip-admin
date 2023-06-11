import { useState } from 'react';
import Layout from '../components/Layout';
import { TextInput, Card, Button } from "@tremor/react";
import axios from 'axios';
import { useRouter } from 'next/router';

export default function newUser() {
    const [name, setName]= useState("")
    const [engineerId, setEngineerId] = useState("")
    const [password, setPassword]= useState("")
    const router = useRouter()

    const onCreate=async (e)=>{
        e.preventDefault()
        try{
            const response = await axios.post(
                `${process.env.BACKEND_URL}/auth/engineer/register`,
                {
                  name,
                  password: password,
                  engineerId
                },
                {
                  withCredentials: true,
                }
              );
              if(response){
                console.log(response)
                router.push('/users')
              }
        }catch (err){
            console.log(err)
        }
    }
    return(
        <Layout>
            <div className='items-center p-5 flex flex-col justify-center'>
                <h1 className='text-lg font-light mx-auto my-5'>Create New User</h1>
                <Card className="w-3/5 m-auto space-y-4">
                    <TextInput placeholder="Username" value={name} onChange={(e)=>setName(e.target.value)}/>
                    <TextInput placeholder="User ID"
                    value={engineerId} onChange={(e)=>setEngineerId(e.target.value)}/>
                    <TextInput placeholder="Password" type="password"
                    value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <Button size="md" onClick={onCreate}>
      Create User
    </Button>

                </Card>
            </div>
            </Layout>
    )
}
