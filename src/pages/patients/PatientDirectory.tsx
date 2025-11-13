import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPatients,
  patientStatsTotalPerProvider,
} from "@/services/patient";
import {
  BLOOD_GROUPS,
  GENDERS,
  MARITAL_STATUSES,
  PATIENT_STATUS,
} from "@/constants";

export default function PatientDirectory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    minAge: "",
    maxAge: "",
    hasInsurance: false,
    hasAllergies: false,
  });

  const perPage = 10;

  const navigate = useNavigate();

  // Debounce search term (wait 400ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // React Query handles pagination + search refetch
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["patients", currentPage, debouncedSearch, filters],
    queryFn: () =>
      fetchPatients(currentPage, perPage, debouncedSearch, filters),
  });

  // Patient stats query
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
  } = useQuery({
    queryKey: ["patientStatsTotalPerProvider"],
    queryFn: () => patientStatsTotalPerProvider(),
  });

  const patients = data?.patients ?? [];
  const meta = data?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      gender: "",
      bloodGroup: "",
      maritalStatus: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      minAge: "",
      maxAge: "",
      hasInsurance: false,
      hasAllergies: false,
    });
    setCurrentPage(1);
    refetch(); // refresh patients
    setIsFilterOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "boolean" && value === true)
      ) {
        count++;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success";
      case "Inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Patient Directory
                </h1>
                <p className="text-muted-foreground">
                  Manage and search through all registered patients
                </p>
              </div>

              <Button
                className="bg-gradient-primary hover:shadow-glow transition-all"
                onClick={() => navigate("/dashboard/patients/register")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Register New Patient
              </Button>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients by name, ID, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2 relative">
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full px-1.5 py-0.5">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Filter Patients</DialogTitle>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label>Gender</Label>
                          <Select
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, gender: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {GENDERS.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Blood Group</Label>
                          <div>
                            <Select
                              onValueChange={(val) =>
                                setFilters((f) => ({ ...f, bloodGroup: val }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {BLOOD_GROUPS.map((bloodGroup) => (
                                  <SelectItem
                                    key={bloodGroup}
                                    value={bloodGroup}
                                  >
                                    {bloodGroup}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Marital Status</Label>
                          <Select
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, maritalStatus: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {MARITAL_STATUSES.map((maritalStatus) => (
                                <SelectItem
                                  key={maritalStatus}
                                  value={maritalStatus}
                                >
                                  {maritalStatus}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Status</Label>
                          <Select
                            onValueChange={(val) =>
                              setFilters((f) => ({ ...f, status: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {PATIENT_STATUS.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Date From</Label>
                          <Input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                dateFrom: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Date To</Label>
                          <Input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                dateTo: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Min Age</Label>
                          <Input
                            type="number"
                            value={filters.minAge}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                minAge: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Max Age</Label>
                          <Input
                            type="number"
                            value={filters.maxAge}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                maxAge: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                          <Checkbox
                            checked={filters.hasInsurance}
                            onCheckedChange={(checked) =>
                              setFilters((f: any) => ({
                                ...f,
                                hasInsurance: checked,
                              }))
                            }
                          />
                          <Label>Has Insurance</Label>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                          <Checkbox
                            checked={filters.hasAllergies}
                            onCheckedChange={(checked) =>
                              setFilters((f: any) => ({
                                ...f,
                                hasAllergies: checked,
                              }))
                            }
                          />
                          <Label>Has Allergies</Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear Filters
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentPage(1);
                            refetch(); // trigger React Query manually
                            setIsFilterOpen(false);
                          }}
                        >
                          Apply Filters
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Patient Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {isStatsLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData.totalPatients || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Patients
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">
                    {isStatsLoading || isStatsFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData.activePatients || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Patients
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">
                    {isStatsLoading || isStatsFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData.pendingAppointments || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pending Appointments
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {isStatsLoading || isStatsFetching ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      statsData.newPatientsThisMonth || 0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    New This Month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patients Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Patients (
                  {isLoading || isFetching ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    data["meta"].total || 0
                  )}
                  )
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Age/Gender</TableHead>
                        <TableHead>Primary Doctor</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Added On</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="transition-all duration-300 ease-in-out">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-3 w-20" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-20" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : patients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No patients found
                            </p>
                            {/* <EmptyState
                              message=" No patients found"
                              icon={Users}
                            /> */}
                          </TableCell>
                        </TableRow>
                      ) : (
                        patients.map((patient: any) => (
                          <TableRow
                            key={patient.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-medium">
                                    {patient.user.firstName[0]}
                                    {patient.user.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {patient.user.firstName}{" "}
                                    {patient.user.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {patient.medicalRecordNumber}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {patient.user.phoneNumber}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {patient.user.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>
                                  {patient.user.age} {""}
                                  years
                                </div>
                                <div className="text-muted-foreground">
                                  {patient.user.gender}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {patient.primaryDoctor || "Not assigned"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {patient.condition || "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3" />
                                {patient.lastVisit
                                  ? patient.lastVisit
                                  : "No visits"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(patient.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(
                                  patient.user.status || "Active"
                                )}
                              >
                                {patient.user.status || "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/patients/records/${patient.user.reference}`
                                    )
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/patients/records/${patient.user.reference}/edit`
                                    )
                                  }
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => handlePageChange(i + 1)}
                              isActive={currentPage === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
                {isFetching && !isLoading && (
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    Loading more patients...
                  </div>
                )}
              </CardContent>
            </Card>
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
