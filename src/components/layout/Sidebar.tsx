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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    active: true,
  },
  {
    title: "Patient Management",
    icon: Users,
    href: "/patients",
    children: [
      { title: "Patient Directory", href: "/dashboard/patients" },
      { title: "Register Patient", href: "/dashboard/patients/register" },
      // { title: "Patient Records", href: "/dashboard/patients/records" },
    ],
  },
  {
    title: "Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
    children: [
      { title: "Schedule", href: "/dashboard/appointments" },
      { title: "Calendar View", href: "/dashboard/appointments/calendar" },
      { title: "Check-in Queue", href: "/dashboard/appointments/checkin" },
    ],
  },
  {
    title: "Medical Records",
    icon: FileText,
    href: "/dashboard/medical-records",
    children: [
      { title: "Consultations", href: "/dashboard/consultations" },
      { title: "Prescriptions", href: "/dashboard/prescriptions" },
      { title: "Medical History", href: "/dashboard/medical-history" },
    ],
  },
  {
    title: "Laboratory",
    icon: TestTube,
    href: "/dashboard/laboratory",
    children: [
      { title: "Lab Orders", href: "/dashboard/lab/orders" },
      { title: "Results Entry", href: "/dashboard/lab/results" },
      { title: "Lab Reports", href: "/dashboard/lab/reports" },
    ],
  },
  {
    title: "Radiology",
    icon: Scan,
    href: "/dashboard/radiology",
    children: [
      { title: "Imaging Orders", href: "/dashboard/radiology/orders" },
      { title: "Image Upload", href: "/dashboard/radiology/upload" },
      { title: "Reports", href: "/dashboard/radiology/reports" },
    ],
  },
  {
    title: "Pharmacy",
    icon: Pill,
    href: "/dashboard/pharmacy",
    children: [
      { title: "Prescriptions", href: "/dashboard/pharmacy/prescriptions" },
      { title: "Inventory", href: "/dashboard/pharmacy/inventory" },
      { title: "Dispensing", href: "/dashboard/pharmacy/dispense" },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
  },
  {
    title: "Billing",
    icon: CreditCard,
    href: "/dashboard/billing",
    children: [
      { title: "Overview", href: "/dashboard/billing" },
      { title: "Invoices", href: "/dashboard/billing/invoices" },
      { title: "Payment Processing", href: "/dashboard/billing/payments" },
      { title: "Reports", href: "/dashboard/billing/reports" },
    ],
  },
  {
    title: "HR & Staff",
    icon: UserCheck,
    href: "/dashboard/staff",
    children: [
      { title: "Staff Directory", href: "/dashboard/staff" },
      { title: "Register Staff", href: "/dashboard/staff/register" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();

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
            {navigationItems.map((item) => (
              <div key={item.title}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    item.active &&
                      "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  onClick={() => handleNavigation(item)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItems.includes(item.title) && "rotate-180"
                      )}
                    />
                  )}
                </Button>

                {item.children && expandedItems.includes(item.title) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.title}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(child.href)}
                      >
                        {child.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
