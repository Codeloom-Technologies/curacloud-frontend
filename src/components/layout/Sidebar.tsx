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
      { title: "Patient Directory", href: "/patients" },
      { title: "Register Patient", href: "/patients/register" },
      { title: "Patient Records", href: "/patients/records" },
    ],
  },
  {
    title: "Appointments",
    icon: Calendar,
    href: "/appointments",
    children: [
      { title: "Schedule", href: "/appointments" },
      { title: "Calendar View", href: "/appointments/calendar" },
      { title: "Check-in Queue", href: "/appointments/checkin" },
    ],
  },
  {
    title: "Medical Records",
    icon: FileText,
    href: "/medical-records",
    children: [
      { title: "Consultations", href: "/consultations" },
      { title: "Prescriptions", href: "/prescriptions" },
      { title: "Medical History", href: "/medical-history" },
    ],
  },
  {
    title: "Laboratory",
    icon: TestTube,
    href: "/laboratory",
    children: [
      { title: "Lab Orders", href: "/lab/orders" },
      { title: "Results Entry", href: "/lab/results" },
      { title: "Lab Reports", href: "/lab/reports" },
    ],
  },
  {
    title: "Radiology",
    icon: Scan,
    href: "/radiology",
    children: [
      { title: "Imaging Orders", href: "/radiology/orders" },
      { title: "Image Upload", href: "/radiology/upload" },
      { title: "Reports", href: "/radiology/reports" },
    ],
  },
  {
    title: "Pharmacy",
    icon: Pill,
    href: "/pharmacy",
    children: [
      { title: "Prescriptions", href: "/pharmacy/prescriptions" },
      { title: "Inventory", href: "/pharmacy/inventory" },
      { title: "Dispensing", href: "/pharmacy/dispense" },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/inventory",
  },
  {
    title: "Billing",
    icon: CreditCard,
    href: "/billing",
    children: [
      { title: "Invoices", href: "/billing/invoices" },
      { title: "Payments", href: "/billing/payments" },
      { title: "Insurance", href: "/billing/insurance" },
    ],
  },
  {
    title: "HR & Staff",
    icon: UserCheck,
    href: "/hr",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
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
              <h2 className="text-lg font-semibold">CuraCloud</h2>
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
