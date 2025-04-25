"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, AlertTriangle, CheckCircle } from "lucide-react"

// Mock data for chemical details
const mockChemicalDetails = {
  1: {
    id: 1,
    name: "Bisphenol A",
    casNumber: "80-05-7",
    status: "restricted",
    riskLevel: "high",
    riskDescription:
      "Known endocrine disruptor with potential health effects at low doses. Restricted in many applications, especially those related to infant products.",
    regulations: [
      {
        id: 1,
        name: "Regulation (EU) 10/2011",
        sml: 0.05,
        unit: "mg/kg",
        notes: "Not to be used for infant feeding bottles",
      },
      { id: 4, name: "FDA 21 CFR 175-178", sml: 0.05, unit: "mg/kg", notes: "Used in certain epoxy resins" },
    ],
  },
  2: {
    id: 2,
    name: "Titanium Dioxide",
    casNumber: "13463-67-7",
    status: "allowed",
    riskLevel: "low",
    riskDescription:
      "Generally recognized as safe for food contact applications. Recent studies suggest potential concerns when used in nanoparticle form.",
    regulations: [
      { id: 1, name: "Regulation (EU) 10/2011", sml: 60, unit: "mg/kg", notes: "" },
      { id: 7, name: "GB 9685-2016", sml: 50, unit: "mg/kg", notes: "" },
    ],
  },
}

// Mock search results to maintain context
const mockSearchResults = [
  {
    id: 1,
    name: "Bisphenol A",
    casNumber: "80-05-7",
    status: "restricted",
    regulations: ["EU 10/2011", "FDA CFR 177.1580"],
  },
  {
    id: 2,
    name: "Titanium Dioxide",
    casNumber: "13463-67-7",
    status: "allowed",
    regulations: ["EU 10/2011", "GB 9685"],
  },
]

export default function ChemicalDetailsPage() {
  const searchParams = useSearchParams()
  const chemicalId = searchParams.get("id")

  if (!chemicalId || !mockChemicalDetails[Number(chemicalId)]) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Chemical Not Found</CardTitle>
            <CardDescription>The specified chemical information was not found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/search">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const chemical = mockChemicalDetails[Number(chemicalId)]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Low Risk
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Medium Risk
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> High Risk
          </Badge>
        )
      default:
        return <Badge>Unknown Risk</Badge>
    }
  }

  return (
    <div className="container py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Your recent search results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockSearchResults.map((result) => (
                  <Link key={result.id} href={`/search/details?id=${result.id}`} className="block">
                    <div
                      className={`p-3 rounded-md border hover:bg-muted transition-colors ${result.id === Number(chemicalId) ? "bg-muted border-primary" : ""}`}
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">CAS: {result.casNumber}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/search">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Search
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{chemical.name}</h1>
                  {getRiskBadge(chemical.riskLevel)}
                </div>
                <p className="text-muted-foreground">CAS Number: {chemical.casNumber}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Risk Assessment</h3>
                <p>{chemical.riskDescription}</p>
              </div>
            </CardContent>
          </Card>

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
                    <TableRow key={regulation.id}>
                      <TableCell className="font-medium">{regulation.name}</TableCell>
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
      </div>
    </div>
  )
}

