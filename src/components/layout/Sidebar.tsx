import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  TestTube,
  Scan,
  Pill,
  Package,
  CreditCard,
  UserCheck,
  BarChart3,
  Settings,
  ChevronDown,
  Heart,
  BookText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/config/acl";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    permission: "dashboard" as Permission,
  },
  {
    title: "Patient Management",
    icon: Users,
    href: "/patients",
    permission: "patients" as Permission,
    children: [
      { 
        title: "Patient Directory", 
        href: "/dashboard/patients",
        permission: "patients" as Permission,
      },
      { 
        title: "Register Patient", 
        href: "/dashboard/patients/register",
        permission: "patients.register" as Permission,
      },
    ],
  },
  {
    title: "Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
    permission: "appointments" as Permission,
    children: [
      { 
        title: "Schedule", 
        href: "/dashboard/appointments",
        permission: "appointments" as Permission,
      },
      { 
        title: "Calendar View", 
        href: "/dashboard/appointments/calendar",
        permission: "appointments.calendar" as Permission,
      },
      { 
        title: "Check-in Queue", 
        href: "/dashboard/appointments/checkin",
        permission: "appointments.checkin" as Permission,
      },
    ],
  },
  {
    title: "Patient Vitals",
    icon: BookText,
    href: "/dashboard/patient-vitals",
    permission: "patient-vitals" as Permission,
    children: [
      {
        title: "Appointments",
        href: "/dashboard/appointment-check-ins",
        permission: "patient-vitals.appointments" as Permission,
      },
      { 
        title: "Vitals Entries", 
        href: "/dashboard/patient-vitals",
        permission: "patient-vitals" as Permission,
      },
    ],
  },
  {
    title: "Medical Records",
    icon: FileText,
    href: "/dashboard/medical-records",
    permission: "medical-records" as Permission,
    children: [
      { 
        title: "Consultations", 
        href: "/dashboard/consultations",
        permission: "consultations" as Permission,
      },
      { 
        title: "Prescriptions", 
        href: "/dashboard/prescriptions",
        permission: "prescriptions" as Permission,
      },
      { 
        title: "Medical History", 
        href: "/dashboard/medical-history",
        permission: "medical-history" as Permission,
      },
    ],
  },
  {
    title: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
    permission: "billing" as Permission,
    children: [
      { 
        title: "Overview", 
        href: "/dashboard/billing",
        permission: "billing" as Permission,
      },
      { 
        title: "Invoices", 
        href: "/dashboard/billing/invoices",
        permission: "billing.invoices" as Permission,
      },
      { 
        title: "Payment Processing", 
        href: "/dashboard/billing/payments",
        permission: "billing.payments" as Permission,
      },
      { 
        title: "Reports", 
        href: "/dashboard/billing/reports",
        permission: "billing.reports" as Permission,
      },
    ],
  },
  {
    title: "HR & Staff",
    icon: UserCheck,
    href: "/dashboard/staff",
    permission: "staff" as Permission,
    children: [
      { 
        title: "Staff Directory", 
        href: "/dashboard/staff",
        permission: "staff" as Permission,
      },
      { 
        title: "Register Staff", 
        href: "/dashboard/staff/register",
        permission: "staff.register" as Permission,
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    permission: "settings" as Permission,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermissions();

  // Filter navigation items based on user permissions
  const filteredNavigationItems = useMemo(() => {
    return navigationItems
      .filter((item) => hasPermission(item.permission))
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) =>
          hasPermission(child.permission)
        ),
      }))
      .filter((item) => !item.children || item.children.length > 0);
  }, [hasPermission]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleNavigation = (item: any) => {
    if (item.children) {
      toggleExpanded(item.title);
    } else {
      navigate(item.href);
    }
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Curacloud</h2>
              <p className="text-xs text-muted-foreground">
                Healthcare Management
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {filteredNavigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              const hasActiveChild = item.children?.some((child) =>
                isActiveRoute(child.href)
              );

              return (
                <div key={item.title}>
                  <Button
                    variant={isActive || hasActiveChild ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      (isActive || hasActiveChild) &&
                        "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                    onClick={() => handleNavigation(item)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems.includes(item.title) && "rotate-180"
                        )}
                      />
                    )}
                  </Button>

                  {item.children &&
                    item.children.length > 0 &&
                    expandedItems.includes(item.title) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = isActiveRoute(child.href);
                          
                          return (
                            <Button
                              key={child.title}
                              variant={isChildActive ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full justify-start text-sm",
                                isChildActive
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                              onClick={() => navigate(child.href)}
                            >
                              {child.title}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
