import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Layout(){
    return (
        <div>
<Header/>
<Outlet/>
</div>
    )
}