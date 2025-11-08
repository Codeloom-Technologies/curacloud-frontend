import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, FileText, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "Register Patient",
    description: "Add new patient to system",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    href: "/dashboard/patients/register",
  },
  {
    title: "Schedule Appointment",
    description: "Book new appointment",
    icon: Calendar,
    color: "bg-green-50 text-green-600 hover:bg-green-100",
    href: "/dashboard/appointments",
  },
  {
    title: "Create Consultation",
    description: "Start new patient consultation",
    icon: FileText,
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    href: "/dashboard/consultations",
  },
  {
    title: "Generate Bill",
    description: "Create patient invoice",
    icon: CreditCard,
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    href: "/dashboard/billing",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              onClick={() => navigate(`${action.href}`)}
              key={action.title}
              variant="ghost"
              className="h-auto flex-col gap-2 p-4 hover:shadow-soft transition-all"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
