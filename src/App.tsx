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
import UpdatePatient from "./pages/patients/PatientUpdate";
import UpdateStaff from "./pages/staff/UpdateStaff";
import EmailVerification from "./pages/EmailVerification";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import PatientVitals from "./pages/patient-vitals/PatientVitals";
import AppointmentCheckIns from "./pages/patient-vitals/AppointmentCheckIns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PharmacyInventory from "./pages/pharmacy/PharmacyInventory";
import PrescriptionProcessing from "./pages/pharmacy/PrescriptionProcessing";
import MedicationDispensing from "./pages/pharmacy/MedicationDispensing";
import StockManagement from "./pages/pharmacy/StockManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/auth/onboarding" element={<Onboarding />} />
          <Route path="/auth/verify-email" element={<EmailVerification />} />
          <Route path="/auth/reset-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/dashboard/patients" element={<PatientDirectory />} />
          <Route
            path="/dashboard/patients/register"
            element={<RegisterPatient />}
          />
          <Route
            path="/dashboard/patients/records/:patientId"
            element={<PatientRecords />}
          />
          <Route
            path="/dashboard/patients/records/:patientId/edit"
            element={<UpdatePatient />}
          />
          <Route path="/dashboard/appointments" element={<Appointments />} />
          <Route
            path="/dashboard/appointments/calendar"
            element={<AppointmentCalendar />}
          />
          <Route
            path="/dashboard/appointments/checkin"
            element={<CheckinQueue />}
          />
          <Route path="/dashboard/consultations" element={<Consultations />} />
          <Route path="/dashboard/prescriptions" element={<Prescriptions />} />
          <Route
            path="/dashboard/medical-history"
            element={<MedicalHistory />}
          />

          {/* Laboratory Routes */}
          <Route path="/dashboard/lab/orders" element={<LabOrders />} />
          <Route path="/dashboard/lab/results" element={<ResultsEntry />} />
          <Route path="/dashboard/lab/reports" element={<LabReports />} />

          {/* Staff/HR Routes */}
          <Route path="/dashboard/staff" element={<StaffDirectory />} />
          <Route path="/dashboard/staff/register" element={<RegisterStaff />} />
          <Route
            path="/dashboard/staff/records/:staffId"
            element={<StaffRecords />}
          />
          <Route
            path="/dashboard/staff/records/:staffId/edit"
            element={<UpdateStaff />}
          />
          {/* Billing Routes */}
          <Route path="/dashboard/billing" element={<BillingOverview />} />
          <Route path="/dashboard/billing/invoices" element={<Invoices />} />
          <Route
            path="/dashboard/billing/payments"
            element={<PaymentProcessing />}
          />
          <Route
            path="/dashboard/billing/reports"
            element={<BillingReports />}
          />

          {/* Settings Route */}
          <Route path="/dashboard/settings" element={<Settings />} />

          {/* Patient vitals  routes */}
          <Route
            path="/dashboard/appointment-check-ins"
            element={<AppointmentCheckIns />}
          />
          <Route path="/dashboard/patient-vitals" element={<PatientVitals />} />

          {/* Pharmacy Routes */}
          <Route
            path="/dashboard/pharmacy/inventory"
            element={<PharmacyInventory />}
          />
          <Route
            path="/dashboard/pharmacy/prescriptions"
            element={<PrescriptionProcessing />}
          />
          <Route
            path="/dashboard/pharmacy/dispensing"
            element={<MedicationDispensing />}
          />
          <Route
            path="/dashboard/pharmacy/stock"
            element={<StockManagement />}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
