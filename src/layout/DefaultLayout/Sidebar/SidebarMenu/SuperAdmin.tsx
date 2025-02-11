import ManageOffers from "./component/ManageOffers"
import CompanyDetails from "./component/CompanyDetails"
import Dashboard from "./component/Dashboard"
import OffersRegistered from "./component/OffersRegistered"
import VerificationStatus from "./component/Verification"


export const SuperAdmin = () => {
    return (
        <div>
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2  dark:text-bodydark2">
                ADMIN PURCHASING MENU 
                </h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                    {/* <!-- Menu Item Dashboard --> */}            
                    <Dashboard />
                    {/* <!-- Menu Item Dashboard --> */}
                </ul>
            </div>

            {/* <!-- Offers Group --> */}
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2 dark:text-bodydark2">
                OFFERS
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                    
                    {/* <!-- Menu Item Manage Offers --> */}
                    <ManageOffers />
                    {/* <!-- Menu Item Manage Offers --> */}
                    
                    {/* <!-- Menu Item Offers Registered --> */}
                    <OffersRegistered />
                    {/* <!-- Menu Item Offers Registered --> */}

                </ul>
            </div>

            {/* <!-- Company Details --> */}
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2 dark:text-bodydark2">
                COMPANY
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                    {/* <!-- Menu Item Company Details --> */}
                    <CompanyDetails />
                    {/* <!-- Menu Item Company Details --> */}

                    {/* <!-- Menu Item Verification Status --> */}
                    <VerificationStatus />
                    {/* <!-- Menu Item Verification Status --> */}
                </ul>
            </div>
        </div>
    )
}