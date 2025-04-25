"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, ExternalLink, Filter, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for demonstration
const mockRegulations = {
  eu: [
    {
      id: 1,
      name: "Regulation (EU) 10/2011",
      description: "Plastic materials and articles intended to come into contact with food",
      categories: ["Food Contact", "General"],
      lastUpdated: "2023-12-15",
      updateDetails: "Updated migration limits for several substances including Bisphenol A.",
    },
    {
      id: 2,
      name: "Regulation (EC) 1935/2004",
      description: "Materials and articles intended to come into contact with food",
      categories: ["Food Contact"],
      lastUpdated: "2022-10-05",
      updateDetails: "Added new requirements for labeling and traceability.",
    },
    {
      id: 3,
      name: "Regulation (EC) 2023/2006",
      description: "Good manufacturing practice for materials and articles intended to come into contact with food",
      categories: ["Food Contact"],
    },
  ],
  us: [
    {
      id: 4,
      name: "FDA 21 CFR 175-178",
      description: "Indirect Food Additives",
      categories: ["Food Contact", "Electronic Equipment"],
      lastUpdated: "2023-08-22",
      updateDetails: "Revised restrictions on PFAS compounds in food packaging.",
    },
    {
      id: 5,
      name: "FDA 21 CFR 177.1520",
      description: "Olefin polymers",
      categories: ["Food Contact"],
    },
    {
      id: 6,
      name: "FDA 21 CFR 176.170",
      description: "Components of paper and paperboard in contact with aqueous and fatty foods",
      categories: ["Food Contact"],
    },
  ],
  china: [
    {
      id: 7,
      name: "GB 9685-2016",
      description: "Standard for the use of additives in food contact materials and products",
      categories: ["Food Contact", "Drinking Water"],
      lastUpdated: "2023-11-30",
      updateDetails: "Added 15 new substances to the positive list and revised restrictions for 8 existing substances.",
    },
    {
      id: 8,
      name: "GB 4806.1-2016",
      description: "General safety requirements for food contact materials and articles",
      categories: ["Food Contact"],
    },
  ],
  japan: [
    {
      id: 9,
      name: "JHOSPA Positive List",
      description: "Japan Hygienic Olefin and Styrene Plastics Association Positive List",
      categories: ["Food Contact"],
      lastUpdated: "2023-10-12",
      updateDetails: "Updated testing methods and added new substances to the positive list.",
    },
    {
      id: 10,
      name: "JHPA Standards",
      description: "Japan Hygienic PVC Association Standards",
      categories: ["Food Contact"],
    },
  ],
}

// Categories for filtering
const regulationCategories = [
  "General",
  "Food Contact",
  "Electronic Equipment",
  "Drinking Water",
  "Medical Devices",
  "Cosmetics",
]

export default function RegulationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [filteredRegulations, setFilteredRegulations] = useState<{
    eu: typeof mockRegulations.eu
    us: typeof mockRegulations.us
    china: typeof mockRegulations.china
    japan: typeof mockRegulations.japan
  }>(mockRegulations)
  const [showUpdatesOnly, setShowUpdatesOnly] = useState(false)

  const handleSearch = () => {
    // Filter regulations based on search term, selected categories, and updates filter
    const filtered = {
      eu: filterRegulationsBySearchAndCategory(mockRegulations.eu),
      us: filterRegulationsBySearchAndCategory(mockRegulations.us),
      china: filterRegulationsBySearchAndCategory(mockRegulations.china),
      japan: filterRegulationsBySearchAndCategory(mockRegulations.japan),
    }

    setFilteredRegulations(filtered)
  }

  const filterRegulationsBySearchAndCategory = (regulations: any[]) => {
    return regulations.filter((reg) => {
      // Filter by search term if provided
      const matchesSearch =
        !searchTerm.trim() ||
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by selected categories if any
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.some((cat) => reg.categories.includes(cat))

      // Filter by updates if the toggle is on
      const matchesUpdates = !showUpdatesOnly || reg.updateDetails

      return matchesSearch && matchesCategory && matchesUpdates
    })
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold">Country Regulations</h1>
        <p className="text-muted-foreground max-w-[700px]">
          View detailed regulations for chemicals in food contact materials by country
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search regulations..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {regulationCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedCategories.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedCategories([])}>
                      Clear All
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showUpdatesOnly ? "default" : "outline"}
            className="gap-2"
            onClick={() => {
              setShowUpdatesOnly(!showUpdatesOnly)
              setTimeout(handleSearch, 0)
            }}
          >
            <Clock className="h-4 w-4" />
            Recent Updates
          </Button>
        </div>
      </div>

      <Tabs defaultValue="eu" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="eu">European Union (EU)</TabsTrigger>
          <TabsTrigger value="us">United States (US)</TabsTrigger>
          <TabsTrigger value="china">China</TabsTrigger>
          <TabsTrigger value="japan">Japan</TabsTrigger>
        </TabsList>

        <TabsContent value="eu" className="space-y-4">
          {filteredRegulations.eu.length > 0 ? (
            filteredRegulations.eu.map((regulation) => (
              <Card key={regulation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {regulation.name}
                    {regulation.updateDetails && <Badge className="ml-2 bg-yellow-500">Updated</Badge>}
                  </CardTitle>
                  <CardDescription>{regulation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {regulation.categories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {regulation.updateDetails && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Updated on {regulation.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{regulation.updateDetails}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    {regulation.lastUpdated && !regulation.updateDetails && (
                      <span className="text-xs text-muted-foreground">Last updated: {regulation.lastUpdated}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/regulations/details?id=${regulation.id}`}>View Details</Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No regulations found matching your criteria</div>
          )}
        </TabsContent>

        <TabsContent value="us" className="space-y-4">
          {filteredRegulations.us.length > 0 ? (
            filteredRegulations.us.map((regulation) => (
              <Card key={regulation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {regulation.name}
                    {regulation.updateDetails && <Badge className="ml-2 bg-yellow-500">Updated</Badge>}
                  </CardTitle>
                  <CardDescription>{regulation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {regulation.categories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {regulation.updateDetails && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Updated on {regulation.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{regulation.updateDetails}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    {regulation.lastUpdated && !regulation.updateDetails && (
                      <span className="text-xs text-muted-foreground">Last updated: {regulation.lastUpdated}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/regulations/details?id=${regulation.id}`}>View Details</Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No regulations found matching your criteria</div>
          )}
        </TabsContent>

        <TabsContent value="china" className="space-y-4">
          {filteredRegulations.china.length > 0 ? (
            filteredRegulations.china.map((regulation) => (
              <Card key={regulation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {regulation.name}
                    {regulation.updateDetails && <Badge className="ml-2 bg-yellow-500">Updated</Badge>}
                  </CardTitle>
                  <CardDescription>{regulation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {regulation.categories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {regulation.updateDetails && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Updated on {regulation.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{regulation.updateDetails}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    {regulation.lastUpdated && !regulation.updateDetails && (
                      <span className="text-xs text-muted-foreground">Last updated: {regulation.lastUpdated}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/regulations/details?id=${regulation.id}`}>View Details</Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No regulations found matching your criteria</div>
          )}
        </TabsContent>

        <TabsContent value="japan" className="space-y-4">
          {filteredRegulations.japan.length > 0 ? (
            filteredRegulations.japan.map((regulation) => (
              <Card key={regulation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {regulation.name}
                    {regulation.updateDetails && <Badge className="ml-2 bg-yellow-500">Updated</Badge>}
                  </CardTitle>
                  <CardDescription>{regulation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {regulation.categories.map((category, index) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  {regulation.updateDetails && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Updated on {regulation.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{regulation.updateDetails}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    {regulation.lastUpdated && !regulation.updateDetails && (
                      <span className="text-xs text-muted-foreground">Last updated: {regulation.lastUpdated}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/regulations/details?id=${regulation.id}`}>View Details</Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No regulations found matching your criteria</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

