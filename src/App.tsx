import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import PatientDirectory from "./pages/patients/PatientDirectory";
import RegisterPatient from "./pages/patients/RegisterPatient";
import PatientRecords from "./pages/patients/PatientRecords";
import Appointments from "./pages/appointments/Appointments";
import AppointmentCalendar from "./pages/appointments/AppointmentCalendar";
import CheckinQueue from "./pages/appointments/CheckinQueue";
import Consultations from "./pages/medical-records/Consultations";
import Prescriptions from "./pages/medical-records/Prescriptions";
import MedicalHistory from "./pages/medical-records/MedicalHistory";
import LabOrders from "./pages/laboratory/LabOrders";
import ResultsEntry from "./pages/laboratory/ResultsEntry";
import LabReports from "./pages/laboratory/LabReports";
import StaffDirectory from "./pages/staff/StaffDirectory";
import RegisterStaff from "./pages/staff/RegisterStaff";
import StaffRecords from "./pages/staff/StaffRecords";
import BillingOverview from "./pages/billing/BillingOverview";
import Invoices from "./pages/billing/Invoices";
import PaymentProcessing from "./pages/billing/PaymentProcessing";
import BillingReports from "./pages/billing/BillingReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patients" element={<PatientDirectory />} />
          <Route path="/patients/register" element={<RegisterPatient />} />
          <Route path="/patients/records/:patientId" element={<PatientRecords />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/calendar" element={<AppointmentCalendar />} />
          <Route path="/appointments/checkin" element={<CheckinQueue />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        
        {/* Laboratory Routes */}
        <Route path="/lab/orders" element={<LabOrders />} />
        <Route path="/lab/results" element={<ResultsEntry />} />
        <Route path="/lab/reports" element={<LabReports />} />
        
        {/* Staff/HR Routes */}
        <Route path="/staff" element={<StaffDirectory />} />
        <Route path="/staff/register" element={<RegisterStaff />} />
        <Route path="/staff/records/:staffId" element={<StaffRecords />} />
        
        {/* Billing Routes */}
        <Route path="/billing" element={<BillingOverview />} />
        <Route path="/billing/invoices" element={<Invoices />} />
        <Route path="/billing/payments" element={<PaymentProcessing />} />
        <Route path="/billing/reports" element={<BillingReports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
