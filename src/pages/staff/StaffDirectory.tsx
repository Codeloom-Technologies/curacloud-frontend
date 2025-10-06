import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchDepartments, fetchRoles, fetchStaffs } from "@/services/staff";
import { Role } from "@/types/auth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "Active" | "on-leave" | "inactive";
  joinDate: string;
}

const StaffDirectory = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [roleFilter, setRoleFilter] = useState("all");
  // const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [filters, setFilters] = useState({
    departmentId: "",
    gender: "",
    roleId: "",
    specialization: "",
    bloodGroup: "",
    maritalStatus: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    minAge: "",
    maxAge: "",
    joinDateFrom: "",
    joinDateTo: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const perPage = 10;

  // Debounce search term (wait 400ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // React Query handles pagination + search refetch
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["staffs", currentPage, debouncedSearch, filters],
    queryFn: () => fetchStaffs(currentPage, perPage, debouncedSearch, filters),
  });

  const staffs = data?.patients ?? [];
  const meta = data?.meta ?? {};
  const totalPages = meta.lastPage ?? 1;

  console.log(staffs);

  const {
    data: departmentsData = [],
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData);
    }
  }, [departmentsData]); // only runs when departmentsData changes

  const {
    data: rolesData = [],
    isLoading: isLoadingRoles,
    isFetching: isFetchingRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Update local state when query data changes
  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]); // only runs when rolesData changes

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
      joinDateFrom: "",
      joinDateTo: "",
      roleId: "",
      departmentId: "",
      specialization: "",
    });
    setCurrentPage(1);
    refetch(); // refresh patients
    setIsFilterOpen(false);
  };

  // Patient stats query
  // const {
  //   data: statsData,
  //   isLoading: isStatsLoading,
  //   isFetching: isStatsFetching,
  // } = useQuery({
  //   queryKey: ["patientStatsTotalPerProvider"],
  //   queryFn: () => patientStatsTotalPerProvider(),
  // });

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // const filteredStaff = mockStaffData.filter((staff) => {
  //   const matchesSearch =
  //     staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     staff.email.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesRole = roleFilter === "all" || staff.role === roleFilter;
  //   const matchesDepartment =
  //     departmentFilter === "all" || staff.department === departmentFilter;
  //   return matchesSearch && matchesRole && matchesDepartment;
  // });

  const getStatusColor = (status: Staff["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "on-leave":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Staff Directory</h1>
              <p className="text-muted-foreground">
                Manage hospital staff members
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard/staff/register")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filters.roleId}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, roleId: value }));
                  setCurrentPage(1);
                  refetch();
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingRoles || isFetchingRoles
                        ? "Loading..."
                        : "Select Role"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.departmentId}
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, departmentId: value }));
                  setCurrentPage(1);
                  refetch();
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingDepartments || isFetchingDepartments
                        ? "Loading..."
                        : "Select Department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={department.id.toString()}
                    >
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffs.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      {staff.user.fullName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{staff.user.email}</div>
                        <div className="text-muted-foreground">
                          {staff.user.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.user.roles[0].name}</TableCell>
                    <TableCell>{staff.user.department.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(staff.user.status)}
                      >
                        {staff.user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{staff.joinDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/dashboard/staff/records/${staff.user.reference}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(
                            `/dashboard/staffs/records/${staff.user.reference}/edit`
                          )
                        }
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
};

export default StaffDirectory;
