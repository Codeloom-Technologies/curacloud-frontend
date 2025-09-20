import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Calendar, 
  FileText, 
  TestTube,
  CreditCard,
  AlertCircle
} from "lucide-react";

const quickActions = [
  {
    title: "Register Patient",
    description: "Add new patient to system",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    title: "Schedule Appointment",
    description: "Book new appointment",
    icon: Calendar,
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    title: "Create Consultation",
    description: "Start new patient consultation",
    icon: FileText,
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  {
    title: "Lab Order",
    description: "Request laboratory tests",
    icon: TestTube,
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    title: "Generate Bill",
    description: "Create patient invoice",
    icon: CreditCard,
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  },
  {
    title: "Emergency Alert",
    description: "Report critical situation",
    icon: AlertCircle,
    color: "bg-red-50 text-red-600 hover:bg-red-100",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className="h-auto flex-col gap-2 p-4 hover:shadow-soft transition-all"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}