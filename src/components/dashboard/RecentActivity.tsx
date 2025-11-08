import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const recentActivities = [
  {
    id: 1,
    patient: "John Smith",
    action: "Lab Results Available",
    status: "completed",
    time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    doctor: "Dr. Wilson",
  },
  {
    id: 2,
    patient: "Emma Johnson",
    action: "Appointment Scheduled",
    status: "scheduled",
    time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    doctor: "Dr. Brown",
  },
  {
    id: 3,
    patient: "Michael Davis",
    action: "Prescription Updated",
    status: "updated",
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    doctor: "Dr. Johnson",
  },
  {
    id: 4,
    patient: "Sarah Wilson",
    action: "Check-in Completed",
    status: "completed",
    time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    doctor: "Dr. Lee",
  },
  {
    id: 5,
    patient: "Robert Anderson",
    action: "Billing Generated",
    status: "pending",
    time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    doctor: "Finance Dept",
  },
];

const statusColors = {
  completed: "bg-success/10 text-success",
  scheduled: "bg-blue-50 text-blue-600",
  updated: "bg-warning/10 text-warning",
  pending: "bg-orange-50 text-orange-600",
};

export function RecentActivity() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      {/* <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {activity.patient.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.patient}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              
              <div className="text-right">
                <Badge 
                  variant="secondary" 
                  className={statusColors[activity.status as keyof typeof statusColors]}
                >
                  {activity.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.time, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent> */}
    </Card>
  );
}
