import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AlertCircle, Calculator, Globe, Search } from "lucide-react"

// Mock data for featured regulations
const featuredRegulations = [
  {
    id: 1,
    name: "Regulation (EU) 10/2011",
    description: "Plastic materials and articles intended to come into contact with food",
    country: "European Union",
    featured: true,
    color: "yellow-500",
  },
  {
    id: 4,
    name: "FDA 21 CFR 175-178",
    description: "Indirect Food Additives",
    country: "United States",
    featured: true,
    color: "blue-500",
  },
  {
    id: 7,
    name: "GB 9685-2016",
    description: "Standard for the use of additives in food contact materials and products",
    country: "China",
    featured: true,
    color: "green-500",
  },
  {
    id: 9,
    name: "JHOSPA Positive List",
    description: "Japan Hygienic Olefin and Styrene Plastics Association Positive List",
    country: "Japan",
    featured: true,
    color: "purple-500",
  },
]

export default function Home() {
  return (
    <div className="container px-4 py-12 md:py-24 relative">
      <section className="flex flex-col items-center text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Compliance Track</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Track and verify chemical compliance with regulations across different countries
        </p>
      </section>

      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Regulations Updates</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredRegulations.map((regulation) => (
            <Card key={regulation.id} className={`border-l-4 border-l-${regulation.color} flex flex-col h-full`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className={`h-5 w-5 mr-2 text-${regulation.color}`} />
                  Updated Regulation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <CardDescription className="mb-auto">{regulation.description}</CardDescription>
                <div className="mt-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">{regulation.country}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Link
                  href={`/regulations/details?id=${regulation.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Matching
            </CardTitle>
            <CardDescription>
              Search for chemicals in the database and check compliance with regulations
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button asChild className="w-full">
              <Link href="/search">Go to Search</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Worst Case Scenario
            </CardTitle>
            <CardDescription>Calculate M value and compare with SML according to regulations</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button asChild className="w-full">
              <Link href="/calculation">Go to Calculator</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Country Regulations
            </CardTitle>
            <CardDescription>View detailed regulations for each country regarding chemicals</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button asChild className="w-full">
              <Link href="/regulations">View Regulations</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

