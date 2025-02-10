"use client"

import React, { useState } from 'react'
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for demonstration
const mockOffers = [
  {
    id: 1,
    projectName: "Project Alpha",
    createdDate: "2023-06-01",
    offerType: "Invited",
    registrationDueDate: "2023-06-15",
    status: "Open",
  },
  {
    id: 2,
    projectName: "Project Beta",
    createdDate: "2023-06-02",
    offerType: "Public",
    registrationDueDate: "2023-06-20",
    status: "Open",
  },
  {
    id: 3,
    projectName: "Project Gamma",
    createdDate: "2023-05-15",
    offerType: "Invited",
    registrationDueDate: "2023-06-10",
    status: "Closed",
  },
]

const SupplierOffersAvailable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invited' | 'public'>('invited')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOffers = mockOffers.filter(offer => 
    (activeTab === 'invited' ? offer.offerType === 'Invited' : offer.offerType === 'Public') &&
    offer.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Offers</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Button 
            variant={activeTab === 'invited' ? 'default' : 'outline'}
            onClick={() => setActiveTab('invited')}
          >
            Invited Offers
          </Button>
          <Button 
            variant={activeTab === 'public' ? 'default' : 'outline'}
            onClick={() => setActiveTab('public')}
          >
            Public Offers
          </Button>
        </div>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button variant="outline">
            <FaSearch className="mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Offer Type</TableHead>
            <TableHead>Registration Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOffers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>
                <Link href={`/project-details/${offer.id}`} className="text-blue-600 hover:underline flex items-center">
                  {offer.projectName}
                  <FaExternalLinkAlt className="ml-1 text-xs" />
                </Link>
              </TableCell>
              <TableCell>{offer.createdDate}</TableCell>
              <TableCell>{offer.offerType}</TableCell>
              <TableCell>{offer.registrationDueDate}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded ${offer.status === 'Open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {offer.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Register for Offer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <p className="mt-4 text-sm text-gray-600">
        Note: MoU details will follow the offer process.
      </p>
    </div>
  )
}

export default SupplierOffersAvailable
