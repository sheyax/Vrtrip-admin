import Header from "./Header";
import SideBar from "./SideBar";

const Layout = ({children}) => {
    return (<div>
        <Header/>
        <div className="grid grid-cols-5 h-full">
            <SideBar/>
            <div className="md:col-span-3 col-span-4">
                {children}
            </div>
        </div>
    </div>);
}

export default Layout;