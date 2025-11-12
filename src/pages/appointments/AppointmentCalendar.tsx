import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAppointmentCalender } from "@/services/appointment";
import { useQuery } from "@tanstack/react-query";

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export default function AppointmentCalendar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [calendar, setCalender] = useState<any>([]);

  const navigate = useNavigate();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["appointmentCalender"],
    queryFn: () => fetchAppointmentCalender(),
  });

  useEffect(() => {
    if (data) {
      setCalender(data);
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Checked-in":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const days = viewMode === "day" ? 1 : 7;
    const newDate = new Date(currentDate);
    newDate.setDate(
      currentDate.getDate() + (direction === "next" ? days : -days)
    );
    setCurrentDate(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // const getAppointmentsForDate = (date: Date) => {
  //   const dateKey = formatDate(date);
  //   return calendarData[dateKey as keyof typeof calendarData] || [];
  // };

  // const getAppointmentForTimeSlot = (date: Date, time: string) => {
  //   const appointments = getAppointmentsForDate(date);
  //   return appointments.find((apt) => apt.time === time);
  // };

  const getAppointmentsForDate = (date: Date) => {
    const formattedDate = formatDate(date);
    // console.log("getAppointmentsForDate", formattedDate);

    return calendar.filter((apt: any) => apt.appointmentDate === formattedDate);
  };

  // const getAppointmentForTimeSlot = (date: Date, time: string) => {
  //   const appointments = getAppointmentsForDate(date);
  //   console.log({ appointments });
  //   return appointments.find((apt: any) =>
  //     apt.appointmentTime.startsWith(time)
  //   );
  // };

  const getAppointmentForTimeSlot = (date: Date, time: string) => {
    // console.log({ date }, { time });

    const appointments = getAppointmentsForDate(date);
    // console.log({ appointmentsdate: appointments });
    return appointments.find((apt) => {
      const appointmentTime = apt.appointmentTime.slice(0, 5); // "16:30"
      return appointmentTime === time;
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Calendar View{" "}
                </h1>
                <p className="text-muted-foreground">
                  Visual appointment scheduling calendar
                </p>
              </div>
              <Button
                onClick={() => navigate("/dashboard/appointments")}
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>

            {/* Calendar Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateDate("prev")}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateDate("next")}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">
                        {viewMode === "day"
                          ? formatDisplayDate(currentDate)
                          : "Week View"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "day" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("day")}
                    >
                      Day
                    </Button>
                    <Button
                      variant={viewMode === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("week")}
                    >
                      Week
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Grid */}
            <Card>
              <CardContent className="p-0">
                {viewMode === "day" ? (
                  /* Day View */
                  <div className="divide-y">
                    <div className="p-4 bg-muted/50">
                      <h3 className="font-semibold">
                        {formatDisplayDate(currentDate)}
                      </h3>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] divide-x max-h-[600px] overflow-y-auto">
                      <div className="divide-y">
                        {timeSlots.map((time) => (
                          <div
                            key={time}
                            className="p-3 text-sm text-muted-foreground bg-muted/20"
                          >
                            {formatTime(time)}
                          </div>
                        ))}
                      </div>
                      <div className="divide-y">
                        {timeSlots.map((time) => {
                          const appointment = getAppointmentForTimeSlot(
                            currentDate,
                            time
                          );
                          return (
                            <div key={time} className="p-3 min-h-[60px]">
                              {appointment && (
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">
                                      {appointment.patient}
                                    </span>
                                    <Badge
                                      className={getStatusColor(
                                        appointment.status
                                      )}
                                      style={{ fontSize: "10px" }}
                                    >
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1 mb-1">
                                      <User className="h-3 w-3" />
                                      {appointment.doctor}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {appointment.type}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Week View */
                  <div className="divide-y">
                    <div className="grid grid-cols-8 divide-x bg-muted/50">
                      <div className="p-3"></div>
                      {getWeekDates().map((date) => (
                        <div
                          key={date.toISOString()}
                          className="p-3 text-center"
                        >
                          <div className="text-sm font-medium">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="text-lg">{date.getDate()}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-8 divide-x max-h-[500px] overflow-y-auto">
                      <div className="divide-y">
                        {timeSlots.slice(0, 10).map((time) => (
                          <div
                            key={time}
                            className="p-2 text-xs text-muted-foreground bg-muted/20 min-h-[50px]"
                          >
                            {formatTime(time)}
                          </div>
                        ))}
                      </div>

                      {getWeekDates().map((date) => (
                        <div key={date.toISOString()} className="divide-y">
                          {timeSlots.slice(0, 10).map((time) => {
                            const appointment = getAppointmentForTimeSlot(
                              date,
                              time
                            );
                            return (
                              <div key={time} className="p-1 min-h-[50px]">
                                {appointment && (
                                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm">
                                        {appointment.patient?.fullName ||
                                          appointment.patient
                                            ?.medicalRecordNumber}
                                      </span>
                                      <Badge
                                        className={getStatusColor(
                                          appointment.status
                                        )}
                                        style={{ fontSize: "10px" }}
                                      >
                                        {appointment.status}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1 mb-1">
                                        <User className="h-3 w-3" />
                                        {appointment.doctor?.fullName}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {appointment.type}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* {appointment && (
                                  <div className="bg-primary/10 border border-primary/20 rounded p-1 text-xs cursor-pointer hover:shadow-sm transition-shadow">
                                    <div className="truncate font-medium">
                                      {appointment.patient?.fullName ||
                                        appointment.patient
                                          ?.medicalRecordNumber}
                                    </div>
                                    <div className="truncate text-muted-foreground">
                                      {appointment.doctor?.fullName}
                                    </div>
                                  </div>
                                )} */}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Scheduled
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      New appointment
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Confirmed
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Patient confirmed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      Checked-in
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Patient arrived
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      Completed
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Appointment finished
                    </span>
                  </div>
                </div>
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
