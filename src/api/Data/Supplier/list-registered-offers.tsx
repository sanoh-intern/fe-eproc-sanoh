export type TypeOfferFollowed = {
  offerid: string
  projectName: string
  offerType: string
  registrationDate: string
  totalAmount: string | number | null
  revisionNo: string
  updatedDate: string
  status: string
  offerStatus: string
  winningCompany?: string | null
}
interface OfferFollowed {
  offerid: string
  projectName: string
  offerType: string
  registrationDate: string
  totalAmount: string | number | null
  revisionNo: string
  updatedDate: string
  status: string
  offerStatus: "Open" | "Supplier Selected" 
  winningCompany?: string | null
}

// Simulated API function
const fetchFollowedOffers = async (): Promise<OfferFollowed[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Array.from({ length: 50 }, (_, i) => ({
    offerid: `${i + 1}`,
    projectName: `Project ${i + 1}`,
    offerType: Math.random() > 0.5 ? "Public" : "Invited",
    registrationDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split("T")[0],
    totalAmount: `${Math.floor(Math.random() * 1000000)}`,
    revisionNo: `${Math.floor(Math.random() * 5)}`,
    updatedDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split("T")[0],
    status: ["Not submitted", "Need revision", "On Review", "Accepted", "Declined"][Math.floor(Math.random() * 4)] as OfferFollowed["status"],
    winningCompany: Math.random() > 0.8 ? `Company ${Math.floor(Math.random() * 100)}` : null,
    offerStatus: Math.random() > 0.5 ? "Open" : "Supplier Selected",
  }))
}

export default fetchFollowedOffers;