import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function PatientUpdateSkeleton() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" disabled>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Update Patient</h1>
                <p className="text-muted-foreground">Loading patient data...</p>
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
