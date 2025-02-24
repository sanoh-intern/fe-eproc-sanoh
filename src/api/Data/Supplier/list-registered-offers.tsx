export type TypeOfferFollowed = {
  id: string
  project_name: string
  project_type: string
  project_status: string
  project_winner?: string | null
  register_date: string
  proposal_last_amount: string | number | null
  proposal_revision_no: string
  proposal_last_update: string
  porposal_status: string
  isFinal: boolean
}
interface OfferFollowed {
  id: string
  project_name: string
  project_type: string
  project_status: string
  project_winner?: string | null
  register_date: string
  proposal_last_amount: string | number | null
  proposal_revision_no: string
  proposal_last_update: string
  porposal_status: string
  isFinal: boolean
}

// Simulated API function
const fetchFollowedOffers = async (): Promise<OfferFollowed[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    project_name: `Project ${i + 1}`,
    project_type: Math.random() > 0.5 ? "Public" : "Invited",
    register_date: new Date(Date.now() - Math.floor(Math.random() * 5000000000))
      .toISOString()
      .split("T")[0],
    proposal_last_amount: `${Math.floor(Math.random() * 1000000)}`,
    proposal_revision_no: `${Math.floor(Math.random() * 5)}`,
    proposal_last_update: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
      .toISOString()
      .split("T")[0],
    porposal_status: ["Not submitted", "On Review", "Accepted", "Declined"][Math.floor(Math.random() * 4)],
    project_status: Math.random() > 0.5 ? "Open" : "Supplier Selected",
    project_winner: Math.random() > 0.8 ? `Company ${Math.floor(Math.random() * 100)}` : null,
    isFinal: Math.random() > 0.5,
  }))
}

export default fetchFollowedOffers;