import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowLeft,
  Edit,
  Calendar,
  Shield,
  FileText,
  TestTube,
  Pill,
  Activity,
  AlertTriangle,
  User,
  Clock,
  Dna,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPatientById } from "@/services/patient";
import EmptyState from "@/components/dashboard/EmptyState";
import PatientDetailsSkeleton from "@/components/dashboard/PatientDetailsSkeleton";

export default function PatientRecords() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { patientId } = useParams();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["fetchPatientById", patientId],
    queryFn: () => fetchPatientById(patientId),
    enabled: !!patientId,
  });

  const patient = data || {};

  useEffect(() => {
    console.log("Current patientId:", patientId);
    console.log("Current patient data:", data);
  }, [patientId, data]);

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-success/10 text-success";
      case "High":
        return "bg-destructive/10 text-destructive";
      case "Low":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading || isFetching) return <PatientDetailsSkeleton />;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard/patients")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Patient Records</h1>
                <p className="text-muted-foreground">
                  Complete medical record for {patient.user.fullName}
                </p>
              </div>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Patient
              </Button>
            </div>

            {/* Patient Summary Card */}
            <Card className="shadow-medium">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {patient.user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {patient.user.fullName}
                      </h2>
                      <p className="text-muted-foreground">
                        Patient ID: {patient.medicalRecordNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={
                            patient.user.status === "Active"
                              ? "bg-success/10 text-success"
                              : "bg-muted"
                          }
                        >
                          {patient.status || "Active"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Last visit:{" "}
                          {patient.lastVisit ? patient.lastVisit : "No visits"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator
                    orientation="vertical"
                    className="hidden md:block"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Age & Gender
                      </p>
                      <p className="font-medium">
                        {patient.age} years {""}
                        {patient.gender} {""}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Primary Doctor
                      </p>
                      <p className="font-medium">
                        {patient.primaryDoctor
                          ? patient.primaryDoctor
                          : "Not Available"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{patient.user.phoneNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Emergency Contact
                      </p>
                      <p className="font-medium">
                        {patient.emergencyContacts[0].fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.emergencyContacts[0].relationship}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm">Schedule Appointment</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm">New Consultation</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <TestTube className="h-5 w-5 text-primary" />
                <span className="text-sm">Order Lab Test</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Pill className="h-5 w-5 text-primary" />
                <span className="text-sm">Prescribe Medication</span>
              </Button>
            </div>

            {/* Detailed Records Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="consultations">Consultations</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Date of Birth:
                          </span>
                          <p className="font-medium">{patient.dob}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gender:</span>
                          <p className="font-medium">{patient.gender}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{patient.user.email}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            Address:
                          </span>
                          <p className="font-medium">
                            {patient.address.street}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insurance Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Insurance Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Provider:
                          </span>
                          <p className="font-medium">
                            {patient.insurances.provider
                              ? patient.insurances.provider
                              : "Not Available"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Policy Number:
                          </span>
                          <p className="font-medium">
                            {patient.insurances.policyNumber
                              ? patient.insurances.policyNumber
                              : "Not Available"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Group Number:
                          </span>
                          <p className="font-medium">
                            {patient.insurances.groupNumber
                              ? patient.insurances.groupNumber
                              : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Allergies & Warnings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Allergies & Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {patient?.allergies?.length ? (
                          patient.allergies.map((allergy, index) => (
                            <Badge
                              key={index}
                              variant="destructive"
                              className="mr-2"
                            >
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <EmptyState
                            icon={Dna}
                            message="No allergies found."
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Medications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Current Medications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {patient?.currentMedications?.length ? (
                          patient?.currentMedications?.map((med, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-primary pl-3"
                            >
                              <p className="font-medium">
                                {med.name} - {med.dosage}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {med.frequency}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                For: {med.for}
                              </p>
                            </div>
                          ))
                        ) : (
                          <EmptyState
                            icon={Pill}
                            message="No active medications found."
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="consultations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patient?.consultations?.length ? (
                        patient?.consultations?.map((consultation, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {consultation.type}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    consultation.date
                                  ).toLocaleDateString()}{" "}
                                  - {consultation.doctor}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {consultation.type}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm">
                                <strong>Diagnosis:</strong>{" "}
                                {consultation.diagnosis}
                              </p>
                              <p className="text-sm">
                                <strong>Notes:</strong> {consultation.notes}
                              </p>
                              {consultation.nextAppointment && (
                                <p className="text-sm text-primary">
                                  <strong>Next Appointment:</strong>{" "}
                                  {new Date(
                                    consultation.nextAppointment
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          icon={FileText}
                          message="No consultations have been recorded for this patient yet."
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lab-results" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Laboratory Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patient?.labResults?.length ? (
                        patient?.labResults?.map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{result.test}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(result.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{result.result}</p>
                              <p className="text-xs text-muted-foreground">
                                Ref: {result.reference}
                              </p>
                            </div>
                            <Badge
                              className={getResultStatusColor(result.status)}
                            >
                              {result.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          icon={TestTube}
                          message="No lab results found."
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Vital Signs History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patient?.vitals?.length ? (
                        patient?.vitals?.map((vital, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-5 gap-4 p-3 border rounded-lg text-sm"
                          >
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">
                                {new Date(vital.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Blood Pressure
                              </p>
                              <p className="font-medium">{vital.bp}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Pulse</p>
                              <p className="font-medium">{vital.pulse} bpm</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Temperature
                              </p>
                              <p className="font-medium">{vital.temp}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Weight</p>
                              <p className="font-medium">{vital.weight}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          icon={Activity}
                          message="No vital records available yet."
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medication History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-success mb-2">
                          Current Medications
                        </h4>
                        <div className="space-y-2">
                          {patient?.currentMedications?.length ? (
                            patient?.currentMedications?.map((med, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-success/5 rounded"
                              >
                                <div>
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {med.dosage} - {med.frequency}
                                  </p>
                                </div>
                                <Badge className="bg-success/10 text-success">
                                  Active
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <EmptyState
                              icon={Pill}
                              message="No active medications found."
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Family History</h4>
                        <p className="text-sm text-muted-foreground">
                          Father: Hypertension, Type 2 Diabetes
                          <br />
                          Mother: Breast Cancer (survivor)
                          <br />
                          Siblings: None reported
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Previous Surgeries</h4>
                        <p className="text-sm text-muted-foreground">
                          2018: Appendectomy
                          <br />
                          2015: Hernia Repair
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Social History</h4>
                        <p className="text-sm text-muted-foreground">
                          Non-smoker
                          <br />
                          Occasional alcohol use (1-2 drinks per week)
                          <br />
                          Regular exercise (3x per week)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient?.medicalHistories?.length ? (
                      <div className="space-y-4">
                        {patient.medicalHistories.map((history, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <p className="font-medium">{history.condition}</p>
                            <p className="text-sm text-muted-foreground">
                              Diagnosed:{" "}
                              {history.diagnosedAt
                                ? new Date(
                                    history.diagnosedAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                            {history.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Notes: {history.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Clock}
                        message="No medical history has been recorded for this patient."
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
