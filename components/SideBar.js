import { useRouter } from 'next/router';
import {AiOutlineDashboard, AiOutlineCar} from 'react-icons/ai'
import {HiOutlineUsers} from 'react-icons/hi'

const SideBar = () => {
   const router= useRouter()
    return (
    <div className="col-span-1 border-r
     border-neutral-600 h-full ">

        <div className='flex flex-col space-y-3 p-5'>

        <div className="flex font-semibold
         items-center space-x-2
          text-center p-2 text-neutral-500
           hover:scale-95 duration-200 ease-out
           active:text-gray-700 cursor-pointer"
           onClick={()=> router.push('/dashboard')}>
        <AiOutlineDashboard size={25}/>
        <p className=" md:block text-lg hidden">Dashboard</p>
        </div>

        <div className="flex font-semibold
         items-center space-x-2
       
          text-center p-2 text-neutral-500
           hover:scale-95 duration-200 ease-out
           active:text-gray-700 cursor-pointer"
           onClick={()=> router.push('/vehicles')}>
        <AiOutlineCar size={25}/>
        <p className="hidden  md:block text-lg">Vehicles</p>
        </div>

        
        <div className="flex font-semibold
         items-center space-x-2
          text-center p-2 text-neutral-500
           hover:scale-95 duration-200 ease-out
           active:text-gray-700 cursor-pointer"
           onClick={()=> router.push('/')}>
        <HiOutlineUsers size={25}/>
        <p className="hidden md:block text-lg">Drivers</p>
        </div>

        </div>
       
    </div>  
    );
}
 
export default SideBar;