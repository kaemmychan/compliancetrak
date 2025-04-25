"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Plus,
  Trash2,
  Search,
  Download,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for demonstration
const mockChemicalsDatabase = [
  { id: 1, name: "Bisphenol A", casNumber: "80-05-7", sml: 0.05, regulation1: 0.05, regulation2: 0.06 },
  { id: 2, name: "Titanium Dioxide", casNumber: "13463-67-7", sml: 60, regulation1: 60, regulation2: 50 },
  { id: 3, name: "Diethylhexyl Phthalate", casNumber: "117-81-7", sml: 1.5, regulation1: 1.5, regulation2: 1.2 },
  { id: 4, name: "Polyethylene Terephthalate", casNumber: "25038-59-9", sml: 3.0, regulation1: 3.0, regulation2: 3.0 },
  { id: 5, name: "Formaldehyde", casNumber: "50-00-0", sml: 15, regulation1: 15, regulation2: 15 },
]

interface Substance {
  id: string
  name: string
  casNumber: string
  q: number // Contamination in mg/kg
  fromDatabase: boolean
  sml?: number
  regulation1?: number
  regulation2?: number
}

interface CalculationResult {
  substance: Substance
  mValue: number
  passedRegulation1: boolean | null
  passedRegulation2: boolean | null
}

export default function CalculationPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [calculationCase, setCalculationCase] = useState<1 | 2>(1)
  const [packagingParams, setPackagingParams] = useState({
    a: 600, // Surface area in cm²
    lp: 0.1, // Thickness in cm
    d: 1, // Density in g/cm³
    f: 1000, // Food weight in g
  })
  const [substances, setSubstances] = useState<Substance[]>([
    { id: crypto.randomUUID(), name: "", casNumber: "", q: 1, fromDatabase: false },
  ])
  const [results, setResults] = useState<CalculationResult[]>([])
  const [hasCalculated, setHasCalculated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockChemicalsDatabase>([])
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [currentSubstanceIndex, setCurrentSubstanceIndex] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPackagingParams((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const handleSubstanceInputChange = (index: number, field: keyof Substance, value: string | number) => {
    const newSubstances = [...substances]
    newSubstances[index] = {
      ...newSubstances[index],
      [field]: field === "q" ? Number(value) || 0 : value,
    }
    setSubstances(newSubstances)
  }

  const handleCaseChange = (value: string) => {
    const caseNumber = Number.parseInt(value) as 1 | 2
    setCalculationCase(caseNumber)

    // Set default values based on case
    if (caseNumber === 2) {
      setPackagingParams((prev) => ({
        ...prev,
        a: 600,
        f: 1000,
      }))
    }
  }

  const addNewSubstance = () => {
    setSubstances([...substances, { id: crypto.randomUUID(), name: "", casNumber: "", q: 1, fromDatabase: false }])
  }

  const removeSubstance = (index: number) => {
    if (substances.length === 1) {
      // Don't remove the last substance, just clear it
      setSubstances([{ id: crypto.randomUUID(), name: "", casNumber: "", q: 1, fromDatabase: false }])
    } else {
      const newSubstances = [...substances]
      newSubstances.splice(index, 1)
      setSubstances(newSubstances)
    }
  }

  const handleSearchChemical = () => {
    if (!searchTerm.trim()) {
      setSearchResults(mockChemicalsDatabase)
      return
    }

    const results = mockChemicalsDatabase.filter(
      (chemical) =>
        chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) || chemical.casNumber.includes(searchTerm),
    )
    setSearchResults(results)
  }

  const selectChemicalFromDatabase = (chemical: (typeof mockChemicalsDatabase)[0]) => {
    const newSubstances = [...substances]
    newSubstances[currentSubstanceIndex] = {
      id: crypto.randomUUID(),
      name: chemical.name,
      casNumber: chemical.casNumber,
      q: substances[currentSubstanceIndex].q,
      fromDatabase: true,
      sml: chemical.sml,
      regulation1: chemical.regulation1,
      regulation2: chemical.regulation2,
    }
    setSubstances(newSubstances)
    setIsSearchDialogOpen(false)
  }

  const openSearchDialog = (index: number) => {
    setCurrentSubstanceIndex(index)
    setSearchTerm("")
    setSearchResults(mockChemicalsDatabase)
    setIsSearchDialogOpen(true)
  }

  const calculateM = () => {
    // Calculate M value for each substance using formula: M = (Q × A × Lp × D) / F
    const { a, lp, d, f } = packagingParams

    const calculatedResults = substances.map((substance) => {
      const mValue = (substance.q * a * lp * d) / f

      // Check if substance has SML values (from database)
      const passedRegulation1 = substance.regulation1 ? mValue < substance.regulation1 : null
      const passedRegulation2 = substance.regulation2 ? mValue < substance.regulation2 : null

      return {
        substance,
        mValue,
        passedRegulation1,
        passedRegulation2,
      }
    })

    setResults(calculatedResults)
    setHasCalculated(true)
    setActiveStep(3)
  }

  const getStatusBadge = (passed: boolean | null) => {
    if (passed === null) {
      return (
        <Badge className="bg-gray-500">
          <HelpCircle className="h-3 w-3 mr-1" /> Unknown
        </Badge>
      )
    } else if (passed) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" /> Pass
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-500">
          <AlertTriangle className="h-3 w-3 mr-1" /> Fail
        </Badge>
      )
    }
  }

  const isCalculationReady = () => {
    // Check if all required packaging parameters are valid
    const validPackaging =
      packagingParams.a > 0 && packagingParams.lp > 0 && packagingParams.d > 0 && packagingParams.f > 0

    // Check if at least one substance is properly defined
    const validSubstances = substances.some((s) => s.name.trim() !== "" && s.q > 0)

    return validPackaging && validSubstances
  }

  const handleDownloadResults = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert("Results would be downloaded as Excel or CSV file")
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold">Calculate Worst Case Scenario</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Calculate M value according to the formula and compare with SML (Specific Migration Limit)
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${activeStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            2
          </div>
          <div className={`h-1 w-16 ${activeStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            3
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {activeStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Step 1: Select Calculation Case
              </CardTitle>
              <CardDescription>Choose the appropriate case for your calculation</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={calculationCase.toString()} onValueChange={handleCaseChange} className="space-y-4">
                <div className="flex items-start space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="1" id="case1" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="case1" className="font-medium">
                      Case 1: Known packaging contact area and food weight
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use this when you know the specific surface area of the packaging that contacts food and the
                      weight of the food.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="2" id="case2" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="case2" className="font-medium">
                      Case 2: Unknown packaging contact area and food weight
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use this when you don't know the specific surface area or food weight. Default values will be used
                      (A = 600 cm², F = 1000 g).
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setActiveStep(2)}>
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Step 2: Enter Parameters for Calculation
              </CardTitle>
              <CardDescription>Enter packaging parameters and add substances to calculate M value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Packaging Parameters Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Packaging Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="a">A (Contact Surface Area, cm²)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>พื้นที่ผิวของบรรจุภัณฑ์ที่สัมผัสกับอาหาร (unit: cm²)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="a"
                        name="a"
                        type="number"
                        value={packagingParams.a}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        disabled={calculationCase === 2}
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lp">Lp (Thickness, cm)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ความหนาของวัสดุบรรจุภัณฑ์ (unit: cm)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="lp"
                        name="lp"
                        type="number"
                        value={packagingParams.lp}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="d">D (Density, g/cm³)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ความหนาแน่นของวัสดุบรรจุภัณฑ์ (unit: g/cm³)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="d"
                        name="d"
                        type="number"
                        value={packagingParams.d}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="f">F (Food Weight, g)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>น้ำหนักของอาหารที่สัมผัสกับบรรจุภัณฑ์ (unit: g)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="f"
                        name="f"
                        type="number"
                        value={packagingParams.f}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                        disabled={calculationCase === 2}
                      />
                    </div>
                  </div>
                </div>

                {/* Substances Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Substances</h3>
                    <Button onClick={addNewSubstance} size="sm" className="gap-1">
                      <Plus className="h-4 w-4" /> Add Substance
                    </Button>
                  </div>

                  {substances.map((substance, index) => (
                    <div key={substance.id} className="border rounded-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Substance {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubstance(index)}
                          aria-label="Remove substance"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center justify-between h-6 mb-2">
                            <Label htmlFor={`substance-${index}-name`}>Chemical Name</Label>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openSearchDialog(index)}
                              title="Search from database"
                              className="h-6 w-6 p-0"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            id={`substance-${index}-name`}
                            value={substance.name}
                            onChange={(e) => handleSubstanceInputChange(index, "name", e.target.value)}
                            placeholder="e.g., Bisphenol A"
                          />
                        </div>

                        <div>
                          <div className="h-6 mb-2">
                            <Label htmlFor={`substance-${index}-cas`}>CAS Number</Label>
                          </div>
                          <Input
                            id={`substance-${index}-cas`}
                            value={substance.casNumber}
                            onChange={(e) => handleSubstanceInputChange(index, "casNumber", e.target.value)}
                            placeholder="e.g., 80-05-7"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between h-6 mb-2">
                            <Label htmlFor={`substance-${index}-q`}>Q (Contamination, mg/kg)</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>ปริมาณการปนเปื้อนในวัสดุ (unit: mg/kg)</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Input
                            id={`substance-${index}-q`}
                            type="number"
                            value={substance.q}
                            onChange={(e) => handleSubstanceInputChange(index, "q", e.target.value)}
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>

                      {substance.fromDatabase && (
                        <div className="mt-2 bg-secondary p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">From database: SML = {substance.sml} mg/kg</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep(1)}>
                Back
              </Button>
              <Button onClick={calculateM} disabled={!isCalculationReady()}>
                Calculate
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeStep === 3 && hasCalculated && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Compare M Value with Regulations</CardTitle>
              <CardDescription>
                Comparing calculated M values with SML for each substance across regulations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Chemical</TableHead>
                        <TableHead>CAS Number</TableHead>
                        <TableHead>M Value (mg/kg)</TableHead>
                        <TableHead>Regulation 1 (mg/kg)</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Regulation 2 (mg/kg)</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.substance.id}>
                          <TableCell className="font-medium">{result.substance.name || "Unnamed"}</TableCell>
                          <TableCell>{result.substance.casNumber || "—"}</TableCell>
                          <TableCell>{result.mValue.toFixed(4)}</TableCell>
                          <TableCell>
                            {result.substance.regulation1 !== undefined ? result.substance.regulation1 : "—"}
                          </TableCell>
                          <TableCell>{getStatusBadge(result.passedRegulation1)}</TableCell>
                          <TableCell>
                            {result.substance.regulation2 !== undefined ? result.substance.regulation2 : "—"}
                          </TableCell>
                          <TableCell>{getStatusBadge(result.passedRegulation2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="summary" className="mt-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="text-lg font-medium mb-2">Calculation Parameters</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Case Type:</p>
                          <p className="text-sm text-muted-foreground">Case {calculationCase}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">A (Surface Area):</p>
                          <p className="text-sm text-muted-foreground">{packagingParams.a} cm²</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Lp (Thickness):</p>
                          <p className="text-sm text-muted-foreground">{packagingParams.lp} cm</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">D (Density):</p>
                          <p className="text-sm text-muted-foreground">{packagingParams.d} g/cm³</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">F (Food Weight):</p>
                          <p className="text-sm text-muted-foreground">{packagingParams.f} g</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="text-lg font-medium mb-2">Results Summary</h3>
                      <div className="space-y-2">
                        {results.map((result) => (
                          <div
                            key={result.substance.id}
                            className="p-3 border rounded flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{result.substance.name || "Unnamed"}</p>
                              <p className="text-sm text-muted-foreground">M Value: {result.mValue.toFixed(4)} mg/kg</p>
                            </div>
                            <div className="flex gap-2">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Regulation 1</p>
                                {getStatusBadge(result.passedRegulation1)}
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">Regulation 2</p>
                                {getStatusBadge(result.passedRegulation2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border rounded-md bg-muted/50">
                      <h3 className="text-lg font-medium mb-2">Calculation Process</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Select calculation case (Case {calculationCase})</li>
                        <li>Enter packaging parameters</li>
                        <li>Add substances with Q values</li>
                        <li>Calculate M = (Q × A × Lp × D) / F for each substance</li>
                        <li>Compare M with SML values from regulations</li>
                        <li>
                          Determine compliance:
                          <ul className="list-disc list-inside ml-4 mt-1">
                            <li className="text-green-600">If M &lt;= SML → Pass</li>
                            <li className="text-red-600">If M &gt; SML → Fail (requires further consideration)</li>
                            <li className="text-gray-600">If SML unknown → Further investigation needed</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <Button variant="outline" onClick={() => setActiveStep(2)} className="mr-2">
                  Back to Parameters
                </Button>
                <Button variant="outline" onClick={handleDownloadResults} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Results
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveStep(1)
                  setHasCalculated(false)
                }}
              >
                Start New Calculation
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Chemical Search Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Search Chemical Database</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by chemical name or CAS number"
              className="flex-1"
            />
            <Button onClick={handleSearchChemical}>Search</Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chemical Name</TableHead>
                  <TableHead>CAS Number</TableHead>
                  <TableHead>SML (mg/kg)</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length > 0 ? (
                  searchResults.map((chemical) => (
                    <TableRow key={chemical.id}>
                      <TableCell>{chemical.name}</TableCell>
                      <TableCell>{chemical.casNumber}</TableCell>
                      <TableCell>{chemical.sml}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => selectChemicalFromDatabase(chemical)}>
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No chemicals found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

