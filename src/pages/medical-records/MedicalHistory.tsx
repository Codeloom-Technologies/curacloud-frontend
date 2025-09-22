import { useState } from "react";
import { Search, Plus, Calendar, User, FileText, Heart, AlertTriangle, Eye, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sidebar } from "@/components/layout/Sidebar";

// Sample medical history data
const medicalHistories = [
  {
    id: "MH001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    dateOfBirth: "1985-03-15",
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    chronicConditions: [
      {
        condition: "Hypertension",
        diagnosedDate: "2020-05-12",
        severity: "Mild",
        status: "Controlled",
        treatment: "Lisinopril 10mg daily"
      },
      {
        condition: "Type 2 Diabetes",
        diagnosedDate: "2022-01-08",
        severity: "Moderate", 
        status: "Managed",
        treatment: "Metformin 500mg twice daily"
      }
    ],
    surgicalHistory: [
      {
        procedure: "Appendectomy",
        date: "2018-09-15",
        hospital: "City General Hospital",
        surgeon: "Dr. Robert Smith",
        complications: "None"
      }
    ],
    familyHistory: [
      {
        relation: "Mother",
        conditions: ["Diabetes", "Heart Disease"],
        ageAtDeath: null
      },
      {
        relation: "Father", 
        conditions: ["Hypertension"],
        ageAtDeath: 72
      }
    ],
    socialHistory: {
      smoking: "Never",
      alcohol: "Occasional",
      exercise: "Regular",
      occupation: "Teacher"
    },
    immunizations: [
      {
        vaccine: "COVID-19 (Pfizer)",
        dateGiven: "2023-10-15",
        dueDate: "2024-10-15"
      },
      {
        vaccine: "Influenza",
        dateGiven: "2023-09-20",
        dueDate: "2024-09-20"
      }
    ]
  },
  {
    id: "MH002",
    patientName: "Robert Wilson",
    patientId: "P002", 
    dateOfBirth: "1978-11-22",
    bloodType: "A-",
    allergies: ["Latex", "Iodine"],
    chronicConditions: [
      {
        condition: "Migraine Headaches",
        diagnosedDate: "2019-03-10",
        severity: "Moderate",
        status: "Active",
        treatment: "Sumatriptan as needed"
      }
    ],
    surgicalHistory: [],
    familyHistory: [
      {
        relation: "Mother",
        conditions: ["Alzheimer's Disease"],
        ageAtDeath: 78
      }
    ],
    socialHistory: {
      smoking: "Former (quit 2015)",
      alcohol: "Social",
      exercise: "Moderate",
      occupation: "Engineer"
    },
    immunizations: [
      {
        vaccine: "Tetanus", 
        dateGiven: "2022-06-10",
        dueDate: "2032-06-10"
      }
    ]
  }
];

export default function MedicalHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [selectedHistory, setSelectedHistory] = useState<typeof medicalHistories[0] | null>(null);

  const filteredHistories = medicalHistories.filter(history => {
    const matchesSearch = history.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         history.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         history.chronicConditions.some(c => c.condition.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCondition = conditionFilter === "all" || 
                           history.chronicConditions.some(c => c.status.toLowerCase() === conditionFilter);
    
    return matchesSearch && matchesCondition;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "moderate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "severe": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "controlled": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "managed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "active": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "resolved": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </Button>
            <div className="ml-4">
              <h1 className="text-xl font-semibold">Medical History</h1>
              <p className="text-sm text-muted-foreground">Comprehensive patient medical records and history</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">With complete history</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chronic Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">892</div>
                <p className="text-xs text-muted-foreground">Active cases</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  12 <AlertTriangle className="h-4 w-4 ml-2 text-red-600" />
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Immunizations Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients or conditions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="controlled">Controlled</SelectItem>
                <SelectItem value="managed">Managed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Medical History
            </Button>
          </div>

          {/* Medical History List */}
          <div className="grid gap-4">
            {filteredHistories.map((history) => (
              <Card key={history.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{history.patientName}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          ID: {history.patientId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          DOB: {history.dateOfBirth}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          Blood Type: {history.bloodType}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {history.allergies.length > 0 && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Allergies
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Chronic Conditions Preview */}
                    <div>
                      <span className="font-medium text-sm">Active Conditions:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {history.chronicConditions.slice(0, 3).map((condition, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge className={getSeverityColor(condition.severity)}>
                              {condition.condition}
                            </Badge>
                            <Badge className={getStatusColor(condition.status)} variant="outline">
                              {condition.status}
                            </Badge>
                          </div>
                        ))}
                        {history.chronicConditions.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{history.chronicConditions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Allergies */}
                    {history.allergies.length > 0 && (
                      <div>
                        <span className="font-medium text-sm">Allergies: </span>
                        <span className="text-sm text-muted-foreground">
                          {history.allergies.join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        {history.chronicConditions.length} condition{history.chronicConditions.length !== 1 ? 's' : ''} • 
                        {history.surgicalHistory.length} procedure{history.surgicalHistory.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedHistory(history)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Full History
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Complete Medical History - {selectedHistory?.patientName}</DialogTitle>
                              <DialogDescription>
                                Patient ID: {selectedHistory?.patientId} • DOB: {selectedHistory?.dateOfBirth}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedHistory && (
                              <Tabs defaultValue="conditions" className="w-full">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                                  <TabsTrigger value="surgical">Surgical</TabsTrigger>
                                  <TabsTrigger value="family">Family</TabsTrigger>
                                  <TabsTrigger value="social">Social</TabsTrigger>
                                  <TabsTrigger value="immunizations">Vaccines</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="conditions">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Chronic Conditions</h4>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Condition</TableHead>
                                            <TableHead>Diagnosed</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Treatment</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedHistory.chronicConditions.map((condition, index) => (
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">{condition.condition}</TableCell>
                                              <TableCell>{condition.diagnosedDate}</TableCell>
                                              <TableCell>
                                                <Badge className={getSeverityColor(condition.severity)}>
                                                  {condition.severity}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                <Badge className={getStatusColor(condition.status)}>
                                                  {condition.status}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>{condition.treatment}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium mb-2">Allergies</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedHistory.allergies.map((allergy, index) => (
                                          <Badge key={index} className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                            {allergy}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="surgical">
                                  <div>
                                    <h4 className="font-medium mb-4">Surgical History</h4>
                                    {selectedHistory.surgicalHistory.length > 0 ? (
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Procedure</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Hospital</TableHead>
                                            <TableHead>Surgeon</TableHead>
                                            <TableHead>Complications</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedHistory.surgicalHistory.map((surgery, index) => (
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">{surgery.procedure}</TableCell>
                                              <TableCell>{surgery.date}</TableCell>
                                              <TableCell>{surgery.hospital}</TableCell>
                                              <TableCell>{surgery.surgeon}</TableCell>
                                              <TableCell>{surgery.complications}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <p className="text-muted-foreground">No surgical procedures on record.</p>
                                    )}
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="family">
                                  <div>
                                    <h4 className="font-medium mb-4">Family History</h4>
                                    <div className="space-y-3">
                                      {selectedHistory.familyHistory.map((family, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                          <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium">{family.relation}</span>
                                            {family.ageAtDeath && (
                                              <span className="text-sm text-muted-foreground">
                                                Deceased at {family.ageAtDeath}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                            {family.conditions.map((condition, condIndex) => (
                                              <Badge key={condIndex} variant="outline">
                                                {condition}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="social">
                                  <div>
                                    <h4 className="font-medium mb-4">Social History</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Smoking Status</Label>
                                        <p className="text-sm text-muted-foreground">{selectedHistory.socialHistory.smoking}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Alcohol Use</Label>
                                        <p className="text-sm text-muted-foreground">{selectedHistory.socialHistory.alcohol}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Exercise</Label>
                                        <p className="text-sm text-muted-foreground">{selectedHistory.socialHistory.exercise}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Occupation</Label>
                                        <p className="text-sm text-muted-foreground">{selectedHistory.socialHistory.occupation}</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="immunizations">
                                  <div>
                                    <h4 className="font-medium mb-4">Immunization History</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Vaccine</TableHead>
                                          <TableHead>Date Given</TableHead>
                                          <TableHead>Next Due</TableHead>
                                          <TableHead>Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedHistory.immunizations.map((vaccine, index) => {
                                          const isDue = new Date(vaccine.dueDate) < new Date();
                                          return (
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">{vaccine.vaccine}</TableCell>
                                              <TableCell>{vaccine.dateGiven}</TableCell>
                                              <TableCell>{vaccine.dueDate}</TableCell>
                                              <TableCell>
                                                <Badge className={isDue ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"}>
                                                  {isDue ? "Due" : "Current"}
                                                </Badge>
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}