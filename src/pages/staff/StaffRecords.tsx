import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  PlaneIcon,
  AwardIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStaffById } from "@/services/staff";
import PatientDetailsSkeleton from "@/components/dashboard/PatientDetailsSkeleton";
import EmptyState from "@/components/dashboard/EmptyState";

const StaffRecords = () => {
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetchStaffById", staffId],
    queryFn: () => fetchStaffById(staffId),
    enabled: !!staffId,
  });

  const staffData = data || {};

  console.log({ staffData });
  useEffect(() => {}, [staffId, data]);

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
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/staff")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff Directory
          </Button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {staffData?.user?.fullName}
              </h1>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  {staffData?.user?.status}
                </Badge>
                <span className="text-muted-foreground">
                  {staffData?.user?.roles[0]?.name} -{" "}
                  {staffData.user.department?.name}
                </span>
              </div>
            </div>
            <Button
              onClick={() =>
                navigate(
                  `/dashboard/staff/records/${staffData.user.reference}/edit`
                )
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leave">Leave History</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{staffData.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">
                          {staffData.user.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {staffData?.address["street"]}
                        </p>
                        <p className="text-sm">
                          {staffData?.city}, {staffData?.state}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
                      <p className="font-medium">
                        {staffData.user.department.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Specialization
                      </p>
                      <p className="font-medium">{staffData.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        License Number
                      </p>
                      <p className="font-medium">{staffData.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Employment Type
                      </p>
                      <p className="font-medium">{staffData.employmentType}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Join Date
                        </p>
                        <p className="font-medium">{staffData.joinDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-medium">{staffData.user.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{staffData.user.gender}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Name
                      </p>
                      <p className="font-medium">
                        {staffData.emergencyContactName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Phone
                      </p>
                      <p className="font-medium">
                        {staffData.emergencyPhoneNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData?.attendanceRecords?.length ? (
                        staffData.attendanceRecords.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{record.checkIn}</TableCell>
                            <TableCell>{record.checkOut}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 border-green-500/20"
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            {" "}
                            <EmptyState
                              icon={Calendar}
                              message="No attendance records have been recorded for this staff yet."
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {/* 
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData?.attendanceRecords?.length ? (
                        attendanceRecords.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{record.checkIn}</TableCell>
                            <TableCell>{record.checkOut}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 border-green-500/20"
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <EmptyState
                          icon={TimerIcon}
                          message="No attendance have been recorded for this staff yet."
                        />
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent> */}

            {/* <TabsContent value="leave">
              <Card>
                <CardHeader>
                  <CardTitle>Leave History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveHistory.map((leave, index) => (
                        <TableRow key={index}>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell>
                            {new Date(leave.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(leave.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              {leave.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent> */}
            <TabsContent value="leave">
              <Card>
                <CardHeader>
                  <CardTitle>Leave History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData?.leaveHistory?.length ? (
                        staffData?.leaveHistory.map((leave, index) => (
                          <TableRow key={index}>
                            <TableCell>{leave.type}</TableCell>
                            <TableCell>
                              {new Date(leave.startDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(leave.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 border-green-500/20"
                              >
                                {leave.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            {" "}
                            <EmptyState
                              icon={Calendar}
                              message="No leave records have been added for this staff yet."
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={AwardIcon}
                    message="No performance reviews yet. for this staff yet."
                  />
                  <p className="text-muted-foreground"></p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
};

export default StaffRecords;
