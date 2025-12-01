import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Users,
  Calendar,
  FileText,
  CreditCard,
  Pill,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  Heart,
  Shield,
  Clock,
  UserCheck,
  Stethoscope,
  Building2,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Play,
  ChevronRight,
  Menu,
  X,
  Zap,
  TrendingUp,
  Award,
  Globe,
  Lock,
  Smartphone,
  Cloud,
  Server,
  Database,
  ShieldCheck,
  MessageCircle,
  HeadphonesIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import dashboardPreview from "@/assets/hms-dashboard-preview.jpg";
import { getSubscriptionPlans } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";
import { formatNaira } from "@/lib/formatters";
import { LoadingSpinner } from "@/components/ui/Preloader";
import { InlineWidget } from "react-calendly";

const features = [
  {
    icon: Users,
    title: "Patient Management",
    description: "Comprehensive patient records, medical history, and care coordination in one secure platform.",
    benefits: ["Digital Health Records", "Patient Portal", "Care Coordination"]
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Intelligent scheduling with automated reminders, waitlist management, and real-time availability.",
    benefits: ["Online Booking", "Automated Reminders", "Resource Optimization"]
  },
  {
    icon: FileText,
    title: "Electronic Health Records",
    description: "Fully compliant EMR/EHR system with secure data sharing and interoperability standards.",
    benefits: ["HIPAA Compliant", "Interoperability", "Clinical Documentation"]
  },
  {
    icon: CreditCard,
    title: "Revenue Cycle Management",
    description: "End-to-end billing, insurance claims processing, and financial analytics.",
    benefits: ["Automated Billing", "Insurance Claims", "Revenue Analytics"]
  },
  {
    icon: Pill,
    title: "Pharmacy & Inventory",
    description: "Complete medication management with prescription tracking and smart inventory control.",
    benefits: ["e-Prescribing", "Inventory Tracking", "Drug Interactions"]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time business intelligence, performance metrics, and predictive analytics.",
    benefits: ["Real-time Dashboards", "Predictive Analytics", "Performance Metrics"]
  },
];

const testimonials = [
  {
    name: "Miracle D.",
    role: "Chief Medical Officer",
    hospital: "Metro General Hospital",
    image: "/placeholder.svg",
    rating: 5,
    quote: "Curacloud HMS has transformed how we manage patient care. The intuitive interface and comprehensive features have improved our efficiency by 40%.",
    metrics: "40% efficiency improvement"
  },
  {
    name: "Michael Rodriguez",
    role: "Head Nurse",
    hospital: "Metro General Hospital",
    image: "/placeholder.svg",
    rating: 5,
    quote: "The scheduling system is a game-changer. We've reduced patient wait times significantly and our staff coordination has never been better.",
    metrics: "Reduced wait times by 35%"
  },
  {
    name: "Lisa Chen",
    role: "Hospital Administrator",
    hospital: "Metro General Hospital",
    image: "/placeholder.svg",
    rating: 5,
    quote: "The analytics dashboard gives us insights we never had before. Decision-making is now data-driven and our operational costs have decreased by 25%.",
    metrics: "25% cost reduction"
  },
];

const stats = [
  { number: "1+", label: "Healthcare Facilities" },
  { number: "30+", label: "Patients Served" },
  { number: "99.9%", label: "Uptime Reliability" },
  { number: "24/7", label: "Support Coverage" },
];

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "HIPAA Compliant",
    description: "Full compliance with healthcare data security standards"
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data encrypted in transit and at rest"
  },
  {
    icon: Database,
    title: "Secure Data Centers",
    description: "Enterprise-grade infrastructure with redundant backups"
  },
  {
    icon: Cloud,
    title: "SOC 2 Certified",
    description: "Regular security audits and compliance certifications"
  },
];



// Calendly Popup Component
const CalendlyPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const CALENDLY_URL = "https://calendly.com/gaiyaobed94/30min?month=2025-12";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Schedule a Demo</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <InlineWidget
            url={CALENDLY_URL}
            styles={{
              height: '650px',
              width: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState("doctors");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
    const [showCalendly, setShowCalendly] = useState(false);

  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    phone: "",
    facilityName: "",
    facilitySize: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth/onboarding");
  };

  const { 
    data: subscriptionPlans, 
    isLoading,
    isFetching,
    isError
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => getSubscriptionPlans(),
  });

  if (isLoading || isFetching || isError) {
    return <LoadingSpinner />; 
  }

  return (
    <div className="min-h-screen bg-background">
       {/* Calendly Popup */}
      <CalendlyPopup isOpen={showCalendly} onClose={() => setShowCalendly(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-lg">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Curacloud
                </span>
                <span className="block text-xs text-muted-foreground -mt-1">Healthcare Management System</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#solutions" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Solutions
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#security" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Security
              </a>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth/login")}>
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary hover:shadow-glow transition-all shadow-md"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <a
                    href="#features"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#solutions"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Solutions
                  </a>
                  <a
                    href="#pricing"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <a
                    href="#security"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Security
                  </a>
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/auth/login");
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleGetStarted();
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
                🏥 Trusted by 1+ Healthcare Facilities Worldwide
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Healthcare
                </span>{" "}
                Delivery
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Enterprise-grade healthcare management platform that streamlines operations, 
                enhances patient care, and drives financial performance for modern healthcare facilities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-3 h-14 shadow-xl"
                  onClick={handleGetStarted}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setShowCalendly(true)}
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-3 h-14 border-2"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  No setup fees
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  HIPAA & GDPR Compliant
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Enterprise-grade security
                </div>
              </div>
            </div>

            <div className="animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative rounded-3xl shadow-2xl overflow-hidden border">
                  <img
                    src={dashboardPreview}
                    alt="Curacloud HMS Dashboard Preview"
                    className="w-full hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  Live
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <Award className="h-4 w-4 inline mr-1" />
                  Award Winning
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Enterprise Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Healthcare Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to manage modern healthcare delivery, from patient intake to discharge 
              and everything in between.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border hover:border-primary/20 hover:scale-105"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-primary shadow-lg group-hover:shadow-xl transition-shadow">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Enterprise Security
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built with Security First
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your patient data is protected with enterprise-grade security measures and full regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section - Fixed ID */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Built for Everyone
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Designed for Every Healthcare Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tailored interfaces and features for different healthcare
              professionals and patients.
            </p>
          </div>

          <Tabs
            value={activeRole}
            onValueChange={setActiveRole}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctors
              </TabsTrigger>
              <TabsTrigger value="nurses" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Nurses
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Admins
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Digital Medical Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access complete patient histories, lab results, and
                      medical imaging in one place.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Efficient Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Manage appointments, view daily schedules, and optimize
                      patient consultation time.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Pill className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Prescription Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Digital prescriptions with drug interaction checks and
                      pharmacy integration.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nurses" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Patient Care Coordination</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Track patient vitals, medication schedules, and care plans
                      efficiently.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Shift Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Manage work schedules, patient assignments, and handover
                      notes seamlessly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Mobile Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access patient information and update records on-the-go
                      with mobile app.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="admins" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Real-time insights into hospital operations, patient flow,
                      and financial metrics.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CreditCard className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Financial Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Complete billing, insurance processing, and revenue cycle
                      management tools.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UserCheck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Staff Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Manage staff schedules, roles, permissions, and
                      performance tracking.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="patients" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Online Booking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Book appointments online, view available slots, and
                      receive automated reminders.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Health Records Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Secure access to medical records, test results, and
                      treatment history.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow group hover:border-primary/30">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CreditCard className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Online Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      View bills, make payments online, and track insurance
                      claims status.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-muted/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Star className="h-4 w-4 mr-2" />
              Customer Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of healthcare facilities that have transformed their operations with Curacloud.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-lg text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center gap-4 pt-6 border-t">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-primary font-medium">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.hospital}</p>
                      <p className="text-sm text-green-600 font-medium mt-1">{testimonial.metrics}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Flexible Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Scalable pricing options designed to grow with your healthcare
              facility.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {subscriptionPlans?.map((plan, index) => {
              const isPopular = plan.name === 'Growth Plan';
              const isEnterprise = plan.name === 'Enterprise Plan';
              
              return (
                <Card
                  key={plan.id || index}
                  className={`relative hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                    isPopular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
{/* 
                  {isEnterprise && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                      Enterprise
                    </Badge>
                  )} */}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">
                        {isEnterprise ? 'Custom' : formatNaira(Math.abs(plan.price))}
                      </span> 
                      <span className="text-muted-foreground">
                        {isEnterprise ? '' : '/month'}
                      </span>
                    </div>
                    <CardDescription>
                      {isEnterprise 
                        ? 'For large healthcare facilities with custom needs'
                        : plan.description || `Perfect for ${plan.name?.toLowerCase()} healthcare facilities`
                      }
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features && Array.isArray(plan.features) ? (
                        plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center gap-3 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground text-center">
                          No features listed
                        </li>
                      )}
                    </ul>

                    <Button
                      className={`w-full ${
                        isPopular ? "bg-gradient-primary hover:shadow-glow" : "bg-primary hover:bg-primary/90"
                      } ${isEnterprise ? "bg-gradient-primary hover:shadow-glow" : ""}`}
                      onClick={isEnterprise ? () => setDemoDialogOpen(true) : handleGetStarted}
                    >
                      {isEnterprise ? (
                        <>
                          Contact Sales
                          <Mail className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Start Free Trial
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12 animate-fade-in">
            <p className="text-muted-foreground mb-4">
              All plans include 14-day free trial • No setup fees • Cancel
              anytime
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                99.9% Uptime
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Ready to Transform Your Facility?
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Start Your Digital Transformation Today
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto">
            Join the leading healthcare facilities using Curacloud to deliver exceptional patient care 
            while optimizing operations and driving growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-12 py-6 h-16 bg-white text-primary hover:bg-white/90 shadow-2xl"
              onClick={handleGetStarted}
            >
              Start Free 14-Day Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-6 h-16 border-white text-primary  hover:bg-white/10"
              onClick={() => setDemoDialogOpen(true)}
            >
              <MessageCircle className="mr-3 h-5 w-5" />
              Talk to Sales
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-80">
            <div className="flex items-center justify-center gap-3">
              <HeadphonesIcon className="h-5 w-5" />
              <span>24/7 Dedicated Support</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <span>Enterprise-Grade Security</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Check className="h-5 w-5" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-background border-t py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Curacloud</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Modern healthcare management solution trusted by healthcare
                facilities worldwide.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#solutions"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
    to="/about-us"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    About Us
  </Link>
                </li>
                <li>
                               <Link
    to="/careers"
    className="text-muted-foreground hover:text-foreground transition-colors"
  >
    Careers
  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <Link
    to="/contact-us"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Curacloud. All rights reserved.
              Built with ❤️ for healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}