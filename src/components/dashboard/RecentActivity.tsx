import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getActivities } from "@/services/activity";
import {
  RefreshCw,
  Activity,
  User,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const statusColors = {
  completed: "bg-green-100 text-green-800 border-green-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  updated: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending: "bg-orange-100 text-orange-800 border-orange-200",
  created: "bg-purple-100 text-purple-800 border-purple-200",
  deleted: "bg-red-100 text-red-800 border-red-200",
};

const typeIcons = {
  patient: User,
  appointment: Calendar,
  invoice: FileText,
  billing: TrendingUp,
  system: Activity,
  default: Activity,
};

const getStatusIcon = (status: string) => {
  const icons = {
    completed: <CheckCircle2 className="h-3 w-3" />,
    scheduled: <Calendar className="h-3 w-3" />,
    updated: <RefreshCw className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    created: <CheckCircle2 className="h-3 w-3" />,
    deleted: <AlertCircle className="h-3 w-3" />,
  };
  return (
    icons[status as keyof typeof icons] || <Activity className="h-3 w-3" />
  );
};

export function RecentActivity() {
  const {
    data: recentActivities,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["activities", "recent"],
    queryFn: () => getActivities(1, 3), // Get first page with 8 items
  });

  // Loading state
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-6 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive/50 mx-auto mb-3" />
            <p className="text-destructive font-medium mb-2">
              Failed to load activities
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to fetch recent activities
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!recentActivities?.activities?.length) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium mb-2">
              No recent activity
            </p>
            <p className="text-sm text-muted-foreground">
              Activity will appear here as users perform actions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Recent Activity
          {isFetching && (
            <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-8 w-8 p-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivities?.activities?.map((activity) => {
            const IconComponent =
              typeIcons[activity.type as keyof typeof typeIcons] ||
              typeIcons.default;
            const status = activity.action || activity.status || "completed";

            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all duration-200 group hover:shadow-sm"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-background group-hover:scale-105 transition-transform">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {activity?.user?.fullName
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")
                        ?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-background rounded-full border">
                    <IconComponent className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium truncate">
                    {activity.user?.fullName || "System"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">
                      {activity.title}
                    </p>
                  </div>
                  {activity.content && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {activity.content}
                    </p>
                  )}
                </div>

                <div className="text-right space-y-1 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 text-xs font-medium ${
                      statusColors[status as keyof typeof statusColors] ||
                      statusColors.completed
                    }`}
                  >
                    {getStatusIcon(status)}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href="/dashboard/activities">
              View All Activities
              <TrendingUp className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* Activity Summary */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {recentActivities.length} activity
            {recentActivities.length !== 1 ? "ies" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last updated {formatDistanceToNow(new Date(), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
