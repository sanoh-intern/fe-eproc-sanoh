import AllOffers from "./component/AllOffers"
import CompanyDetails from "./component/CompanyDetails"
import CreateOffers from "./component/CreateOffers"
import Dashboard from "./component/Dashboard"
import OffersRegistered from "./component/OffersRegistered"
import VerificationStatus from "./component/Verification"


export const AdminPurchasing = () => {
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
                    
                    {/* <!-- Menu Item Offers Available --> */}
                    <AllOffers />
                    {/* <!-- Menu Item Offers Available --> */}
                    
                    {/* <!-- Menu Item Offers Followed --> */}
                    <CreateOffers />
                    {/* <!-- Menu Item Offers Followed --> */}
                    
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