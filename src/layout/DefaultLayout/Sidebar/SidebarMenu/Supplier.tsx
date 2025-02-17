import CompanyDetails from "./component/CompanyData"
import Dashboard from "./component/Dashboard"
import OffersAvailable from "./component/OffersAvailable"
import OffersFollowed from "./component/OffersFollowed"
import VerificationStatus from "./component/Verification"


export const Supplier = () => {
    return (
        <div>
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-black-2  dark:text-bodydark2">
                SUPPLIER MENU 
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
                    <OffersAvailable />
                    {/* <!-- Menu Item Offers Available --> */}
                    
                    {/* <!-- Menu Item Offers Followed --> */}
                    <OffersFollowed />
                    {/* <!-- Menu Item Offers Followed --> */}
                    
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