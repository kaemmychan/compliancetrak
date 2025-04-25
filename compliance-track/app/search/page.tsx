"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle, CheckCircle, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Mock data for demonstration
const mockChemicals = [
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
  {
    id: 3,
    name: "Diethylhexyl Phthalate",
    casNumber: "117-81-7",
    status: "prohibited",
    regulations: ["EU 10/2011", "Japan JHOSPA"],
  },
  {
    id: 4,
    name: "Polyethylene Terephthalate",
    casNumber: "25038-59-9",
    status: "allowed",
    regulations: ["EU 10/2011", "FDA CFR 177.1630"],
  },
  {
    id: 5,
    name: "Formaldehyde",
    casNumber: "50-00-0",
    status: "restricted",
    regulations: ["GB 9685", "FDA CFR 175.105"],
  },
]

// Mock regulation zones/tags for filtering
const regulationTags = ["Food Contact", "Electronic Equipment", "Drinking Water", "Medical Devices", "General"]

// Map chemicals to zones (in real app this would be from database)
const chemicalToZones = {
  1: ["Food Contact", "Medical Devices"],
  2: ["Food Contact", "General"],
  3: ["Electronic Equipment", "Medical Devices"],
  4: ["Food Contact", "Drinking Water"],
  5: ["General", "Electronic Equipment"],
}

// Update the search page to add region filter and improve category filtering
// Add these mock regions
const regions = ["European Union", "United States", "China", "Japan", "South Korea", "Global"]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState(() => {
    // Check sessionStorage for saved search term
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("lastSearchTerm") || ""
    }
    return ""
  })
  const [searchResults, setSearchResults] = useState<typeof mockChemicals>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Add state for selected region
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  // Mock authentication - in a real app, use a proper auth system
  const isAdmin = true

  // Add a new state to track whether filters are expanded
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Update the handleSearch function
  const handleSearch = () => {
    // Save search term to sessionStorage
    if (searchTerm.trim()) {
      sessionStorage.setItem("lastSearchTerm", searchTerm)
    }

    // Filter by search term, region, and tags
    let results = mockChemicals

    // Filter by search term if provided
    if (searchTerm.trim()) {
      results = results.filter(
        (chemical) =>
          chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) || chemical.casNumber.includes(searchTerm),
      )
    }

    // Filter by selected region if any
    if (selectedRegion) {
      // In a real app, this would filter based on the region of regulations
      // For mock data, we'll just filter some items
      if (selectedRegion === "European Union") {
        results = results.filter((chemical) => chemical.regulations.some((reg) => reg.includes("EU")))
      } else if (selectedRegion === "United States") {
        results = results.filter((chemical) => chemical.regulations.some((reg) => reg.includes("FDA")))
      } else if (selectedRegion === "China") {
        results = results.filter((chemical) => chemical.regulations.some((reg) => reg.includes("GB")))
      } else if (selectedRegion === "Japan") {
        results = results.filter((chemical) => chemical.regulations.some((reg) => reg.includes("Japan")))
      }
    }

    // Filter by selected tags if any
    if (selectedTags.length > 0) {
      results = results.filter((chemical) => {
        const chemicalZones = chemicalToZones[chemical.id] || []
        return selectedTags.some((tag) => chemicalZones.includes(tag))
      })
    }

    setSearchResults(results)
    setHasSearched(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "allowed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Allowed
          </Badge>
        )
      case "restricted":
        return (
          <Badge className="bg-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Restricted
          </Badge>
        )
      case "prohibited":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Prohibited
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold">Search & Match Chemicals</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Search for chemicals by name or CAS number to check their status and relevant regulations
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by chemical name or CAS number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                title={filtersExpanded ? "Hide Filters" : "Show Filters"}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filtersExpanded && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedRegion || ""} onValueChange={(value) => setSelectedRegion(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select categories"}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px]" align="start">
                    <div className="p-4 space-y-3">
                      {regulationTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTags([...selectedTags, tag])
                              } else {
                                setSelectedTags(selectedTags.filter((t) => t !== tag))
                              }
                            }}
                          />
                          <Label htmlFor={`tag-${tag}`} className="cursor-pointer">
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedRegion && `Region: ${selectedRegion}`}
              {selectedRegion && selectedTags.length > 0 && " | "}
              {selectedTags.length > 0 && `Categories: ${selectedTags.length} selected`}
            </div>
            <Button variant="outline" size="sm" onClick={() => setFiltersExpanded(false)}>
              Hide Filters
            </Button>
          </div>
        </div>
      )}

      {/* Admin button removed as requested */}

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Found {searchResults.length} items for "{searchTerm}"{selectedRegion && ` in ${selectedRegion}`}
              {selectedTags.length > 0 && ` with categories: ${selectedTags.join(", ")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chemical Name</TableHead>
                    <TableHead>CAS Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Related Regulations</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((chemical) => (
                    <TableRow key={chemical.id}>
                      <TableCell className="font-medium">{chemical.name}</TableCell>
                      <TableCell>{chemical.casNumber}</TableCell>
                      <TableCell>{getStatusBadge(chemical.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {chemical.regulations.map((reg, index) => (
                            <Badge key={index} variant="outline">
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="link" size="sm">
                          <Link href={`/regulations/details?chemical=${chemical.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No chemicals found matching your search</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

