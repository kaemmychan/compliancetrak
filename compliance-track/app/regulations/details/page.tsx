"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, ExternalLink, Calculator, AlertCircle, Clock } from "lucide-react"

// Mock data for demonstration
const mockRegulationDetails = {
  1: {
    id: 1,
    name: "Regulation (EU) 10/2011",
    description: "Plastic materials and articles intended to come into contact with food",
    country: "European Union",
    lastUpdated: "2023-12-15",
    previousUpdates: [
      { date: "2020-09-23", changes: "Updated migration limits for certain substances." },
      { date: "2019-05-08", changes: "Added new substances to the positive list." },
    ],
    currentUpdateDetails: "Updated migration limits for several substances including Bisphenol A.",
    officialLink: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011R0010-20200923",
    details:
      "This Regulation establishes specific requirements for the manufacture and marketing of plastic materials and articles which are intended to come into contact with food or which are already in contact with food or which can reasonably be expected to come into contact with food.",
    chemicals: [
      {
        id: 1,
        name: "Bisphenol A",
        casNumber: "80-05-7",
        sml: 0.05,
        unit: "mg/kg",
        notes: "Not to be used for infant feeding bottles",
        updated: true,
      },
      { id: 2, name: "Titanium Dioxide", casNumber: "13463-67-7", sml: 60, unit: "mg/kg", notes: "" },
      {
        id: 3,
        name: "Diethylhexyl Phthalate",
        casNumber: "117-81-7",
        sml: 1.5,
        unit: "mg/kg",
        notes: "Only to be used as plasticizer in repeated use materials and articles",
      },
    ],
  },
  4: {
    id: 4,
    name: "FDA 21 CFR 175-178",
    description: "Indirect Food Additives",
    country: "United States",
    lastUpdated: "2023-08-22",
    previousUpdates: [
      { date: "2023-04-01", changes: "Added new testing methods for PFAS compounds." },
      { date: "2022-11-15", changes: "Updated requirements for paper and paperboard components." },
    ],
    currentUpdateDetails: "Revised restrictions on PFAS compounds in food packaging.",
    officialLink: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-175",
    details:
      "These regulations establish the conditions under which indirect food additives may be safely used. Parts 175, 176, 177, and 178 cover adhesives and components of coatings, paper and paperboard components, polymers, and adjuvants and production aids, respectively.",
    chemicals: [
      {
        id: 1,
        name: "Bisphenol A",
        casNumber: "80-05-7",
        sml: 0.05,
        unit: "mg/kg",
        notes: "Used in certain epoxy resins",
      },
      {
        id: 5,
        name: "Formaldehyde",
        casNumber: "50-00-0",
        sml: 15,
        unit: "mg/kg",
        notes: "Used in adhesives and coatings",
      },
      {
        id: 6,
        name: "PFOA",
        casNumber: "335-67-1",
        sml: 0.0001,
        unit: "mg/kg",
        notes: "Restricted in food contact materials",
        updated: true,
      },
    ],
  },
  7: {
    id: 7,
    name: "GB 9685-2016",
    description: "Standard for the use of additives in food contact materials and products",
    country: "China",
    lastUpdated: "2023-11-30",
    previousUpdates: [
      { date: "2020-03-12", changes: "Updated testing methods for migration analysis." },
      { date: "2018-07-25", changes: "Added new substances to the positive list." },
    ],
    currentUpdateDetails:
      "Added 15 new substances to the positive list and revised restrictions for 8 existing substances.",
    officialLink: "https://www.chinesestandard.net/PDF/English.aspx/GB9685-2016",
    details:
      "This standard specifies the principles for the use of additives in food contact materials and products, the permitted additives, their use scope and maximum use quantity or maximum residue quantity.",
    chemicals: [
      { id: 2, name: "Titanium Dioxide", casNumber: "13463-67-7", sml: 50, unit: "mg/kg", notes: "" },
      { id: 5, name: "Formaldehyde", casNumber: "50-00-0", sml: 15, unit: "mg/kg", notes: "" },
      {
        id: 7,
        name: "Zinc Oxide",
        casNumber: "1314-13-2",
        sml: 25,
        unit: "mg/kg",
        notes: "New addition to positive list",
        updated: true,
      },
    ],
  },
}

// Mock chemical details for when a chemical ID is provided
const mockChemicalDetails = {
  1: {
    id: 1,
    name: "Bisphenol A",
    casNumber: "80-05-7",
    regulations: [
      {
        id: 1,
        name: "Regulation (EU) 10/2011",
        sml: 0.05,
        unit: "mg/kg",
        notes: "Not to be used for infant feeding bottles",
        updated: true,
      },
      { id: 4, name: "FDA 21 CFR 175-178", sml: 0.05, unit: "mg/kg", notes: "Used in certain epoxy resins" },
    ],
  },
}

export default function RegulationDetailsPage() {
  const searchParams = useSearchParams()
  const regulationId = searchParams.get("id")
  const chemicalId = searchParams.get("chemical")

  // If a chemical ID is provided, show regulations for that chemical
  if (chemicalId && mockChemicalDetails[Number(chemicalId)]) {
    const chemical = mockChemicalDetails[Number(chemicalId)]

    return (
      <div className="container py-12">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/search">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>

          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">{chemical.name}</h1>
            <p className="text-muted-foreground">CAS Number: {chemical.casNumber}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Related Regulations</CardTitle>
            <CardDescription>List of regulations related to {chemical.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Regulation</TableHead>
                  <TableHead>SML Value</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chemical.regulations.map((regulation) => (
                  <TableRow key={regulation.id} className={regulation.updated ? "bg-yellow-50" : ""}>
                    <TableCell className="font-medium">
                      {regulation.name}
                      {regulation.updated && <Badge className="ml-2 bg-yellow-500">Updated</Badge>}
                    </TableCell>
                    <TableCell>
                      {regulation.sml} {regulation.unit}
                    </TableCell>
                    <TableCell>{regulation.notes}</TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/regulations/details?id=${regulation.id}`}>
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If a regulation ID is provided, show details for that regulation
  if (regulationId && mockRegulationDetails[Number(regulationId)]) {
    const regulation = mockRegulationDetails[Number(regulationId)]

    return (
      <div className="container py-12">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/regulations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Regulations
            </Link>
          </Button>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mr-2">{regulation.name}</h1>
              <Badge>{regulation.country}</Badge>
              {regulation.currentUpdateDetails && <Badge className="ml-2 bg-yellow-500">Recently Updated</Badge>}
            </div>
            <p className="text-muted-foreground">{regulation.description}</p>
            <p className="text-sm text-muted-foreground">Last updated: {regulation.lastUpdated}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chemicals">Regulated Chemicals</TabsTrigger>
            <TabsTrigger value="updates">Update History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Regulation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {regulation.currentUpdateDetails && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                    <div className="flex items-center text-sm font-medium mb-2">
                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Recent Update ({regulation.lastUpdated})</span>
                    </div>
                    <p>{regulation.currentUpdateDetails}</p>
                  </div>
                )}
                <p>{regulation.details}</p>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Reference Source</p>
                  <Button asChild variant="outline" className="gap-2">
                    <a href={regulation.officialLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Official Document
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chemicals">
            <Card>
              <CardHeader>
                <CardTitle>Chemicals Regulated Under This Regulation</CardTitle>
                <CardDescription>List of chemicals and their SML (Specific Migration Limit) values</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chemical Name</TableHead>
                      <TableHead>CAS Number</TableHead>
                      <TableHead>SML Value</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regulation.chemicals.map((chemical) => (
                      <TableRow key={chemical.id} className={chemical.updated ? "bg-yellow-50" : ""}>
                        <TableCell className="font-medium">
                          {chemical.name}
                          {chemical.updated && <Badge className="ml-2 bg-yellow-500">Updated</Badge>}
                        </TableCell>
                        <TableCell>{chemical.casNumber}</TableCell>
                        <TableCell>
                          {chemical.sml} {chemical.unit}
                        </TableCell>
                        <TableCell>{chemical.notes}</TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/calculation">
                              <Calculator className="h-4 w-4 mr-1" />
                              Calculate
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle>Update History</CardTitle>
                <CardDescription>History of changes to this regulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulation.currentUpdateDetails && (
                    <div className="relative pl-6 pb-4 border-l-2 border-yellow-500">
                      <div className="absolute w-3 h-3 bg-yellow-500 rounded-full -left-[7px]"></div>
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        <span className="font-medium">{regulation.lastUpdated} (Current)</span>
                      </div>
                      <p className="text-sm">{regulation.currentUpdateDetails}</p>
                    </div>
                  )}

                  {regulation.previousUpdates &&
                    regulation.previousUpdates.map((update, index) => (
                      <div key={index} className="relative pl-6 pb-4 border-l-2 border-muted">
                        <div className="absolute w-3 h-3 bg-muted rounded-full -left-[7px]"></div>
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{update.date}</span>
                        </div>
                        <p className="text-sm">{update.changes}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // If no valid ID is provided, show an error message
  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>Data Not Found</CardTitle>
          <CardDescription>The specified regulation or chemical information was not found</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/regulations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Regulations
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

