import Dashboard from "./component/Dashboard"
import ManageUser from "./component/ManageUser"
import AddUser from "./component/AddUser"


export const SuperAdmin = () => {
    return (
        <div>
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2  dark:text-bodydark2">
                SUPER ADMIN MENU 
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                    {/* <!-- Menu Item Dashboard --> */}            
                    <Dashboard />
                    {/* <!-- Menu Item Dashboard --> */}

                    {/* <!-- Menu Item Manage User --> */}
                    <ManageUser />
                    {/* <!-- Menu Item Manage User --> */}

                    {/* <!-- Menu Item Add User--> */}
                    <AddUser />
                    {/* <!-- Menu Item Add User--> */}

                </ul>
            </div>
        </div>
    )
}