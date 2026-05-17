import { Wrench, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg">
            <Wrench className="w-10 h-10 animate-bounce" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Maintenance</h1>
          <p className="text-slate-500 leading-relaxed">
            We are currently performing scheduled maintenance to improve your experience on <span className="font-semibold text-slate-700">Curacloud</span>. We'll be back online shortly.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-sm text-slate-600 font-medium bg-slate-50 py-3 rounded-lg">
          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>Estimated downtime: ~15-30 minutes</span>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 rounded-xl"
            onClick={() => window.location.reload()}
          >
            Check Status
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-slate-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} Curacloud. All rights reserved.
      </div>
    </div>
  );
};

export default MaintenancePage;
