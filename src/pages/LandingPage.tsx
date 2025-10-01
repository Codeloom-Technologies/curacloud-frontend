import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Play,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboardPreview from "@/assets/hms-dashboard-preview.jpg";
import doctorTestimonial from "@/assets/doctor-testimonial-1.jpg";
import nurseTestimonial from "@/assets/nurse-testimonial-1.jpg";

const features = [
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Comprehensive patient records, medical history, and care coordination in one place.",
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description:
      "Smart scheduling system with automated reminders and real-time availability.",
  },
  {
    icon: FileText,
    title: "Medical Records",
    description:
      "Digital EMR/EHR system with secure access and seamless data sharing.",
  },
  {
    icon: CreditCard,
    title: "Billing & Insurance",
    description:
      "Automated billing, insurance claims processing, and payment tracking.",
  },
  {
    icon: Pill,
    title: "Pharmacy & Inventory",
    description:
      "Medication management, prescription tracking, and inventory control.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Real-time insights, performance metrics, and compliance reporting.",
  },
];

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    hospital: "Metro General Hospital",
    image: doctorTestimonial,
    rating: 5,
    quote:
      "CuraCloud HMS has transformed how we manage patient care. The intuitive interface and comprehensive features have improved our efficiency by 40%.",
  },
  {
    name: "Michael Rodriguez",
    role: "Head Nurse",
    hospital: "City Medical Center",
    image: nurseTestimonial,
    rating: 5,
    quote:
      "The scheduling system is a game-changer. We've reduced patient wait times significantly and our staff coordination has never been better.",
  },
  {
    name: "Lisa Chen",
    role: "Hospital Administrator",
    hospital: "St. Mary's Hospital",
    image: "/placeholder.svg",
    rating: 5,
    quote:
      "The analytics dashboard gives us insights we never had before. Decision-making is now data-driven and our operational costs have decreased by 25%.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₦150,000",
    period: "per month",
    description: "Perfect for small clinics and practices",
    features: [
      "Up to 500 patients",
      "Basic appointment scheduling",
      "Digital medical records",
      "Email support",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₦400,000",
    period: "per month",
    description: "Ideal for medium-sized hospitals",
    features: [
      "Up to 5,000 patients",
      "Advanced scheduling & queuing",
      "Complete EMR/EHR suite",
      "Billing & insurance integration",
      "Pharmacy management",
      "24/7 phone support",
      "Custom reporting",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large hospital networks",
    features: [
      "Unlimited patients",
      "Multi-location support",
      "Advanced analytics & AI",
      "Custom integrations",
      "Dedicated account manager",
      "On-site training",
      "99.9% uptime SLA",
    ],
    popular: false,
  },
];

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState("doctors");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    phone: "",
    facilityName: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demoForm.name || !demoForm.email || !demoForm.facilityName) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Demo request:", demoForm);
    toast.success("Thank you! We'll contact you soon to schedule your demo.");
    setDemoDialogOpen(false);
    setDemoForm({
      name: "",
      email: "",
      phone: "",
      facilityName: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CuraCloud</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Reviews
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary hover:shadow-glow transition-all"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <a
                    href="#features"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <a
                    href="#testimonials"
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reviews
                  </a>
                  <div className="pt-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/login");
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
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                🚀 Trusted by 500+ Healthcare Facilities
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Modern Healthcare Management{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Streamline patient care, appointments, billing, and medical
                records in one platform. Transform your healthcare facility with
                our comprehensive HMS solution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Dialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="text-lg px-8">
                      <Play className="mr-2 h-5 w-5" />
                      Book a Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Schedule a Demo</DialogTitle>
                      <DialogDescription>
                        Fill out the form below and our team will contact you to schedule a personalized demo.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDemoSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="demo-name">Full Name *</Label>
                        <Input
                          id="demo-name"
                          placeholder="Your full name"
                          value={demoForm.name}
                          onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demo-email">Email Address *</Label>
                        <Input
                          id="demo-email"
                          type="email"
                          placeholder="your.email@hospital.com"
                          value={demoForm.email}
                          onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demo-phone">Phone Number</Label>
                        <Input
                          id="demo-phone"
                          type="tel"
                          placeholder="+234 xxx xxx xxxx"
                          value={demoForm.phone}
                          onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demo-facility">Facility Name *</Label>
                        <Input
                          id="demo-facility"
                          placeholder="Your hospital/clinic name"
                          value={demoForm.facilityName}
                          onChange={(e) => setDemoForm({ ...demoForm, facilityName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demo-message">Message (Optional)</Label>
                        <Textarea
                          id="demo-message"
                          placeholder="Tell us about your specific needs..."
                          value={demoForm.message}
                          onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => setDemoDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                          Request Demo
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  HIPAA compliant
                </div>
              </div>
            </div>

            <div className="animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
                <img
                  src={dashboardPreview}
                  alt="CuraCloud HMS Dashboard Preview"
                  className="relative rounded-3xl shadow-2xl w-full hover-scale transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Comprehensive Healthcare Suite
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything Your Hospital Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From patient registration to discharge, manage every aspect of
              healthcare delivery with our integrated platform designed for
              modern healthcare facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover-scale group"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-primary shadow-glow group-hover:shadow-lg transition-shadow">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in 3 Easy Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined onboarding process gets your healthcare facility
              up and running quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl font-bold text-primary-foreground">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Register Your Facility
              </h3>
              <p className="text-muted-foreground">
                Sign up with your hospital details and get instant access to
                your HMS dashboard.
              </p>
            </div>

            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl font-bold text-primary-foreground">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Import & Configure</h3>
              <p className="text-muted-foreground">
                Import existing patient data and configure the system according
                to your workflow.
              </p>
            </div>

            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl font-bold text-primary-foreground">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Managing</h3>
              <p className="text-muted-foreground">
                Begin managing patients, scheduling appointments, and tracking
                all healthcare operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Digital Medical Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access complete patient histories, lab results, and
                      medical imaging in one place.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Efficient Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Manage appointments, view daily schedules, and optimize
                      patient consultation time.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Pill className="h-8 w-8 text-primary mb-2" />
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
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Patient Care Coordination</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Track patient vitals, medication schedules, and care plans
                      efficiently.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Shift Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Manage work schedules, patient assignments, and handover
                      notes seamlessly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Shield className="h-8 w-8 text-primary mb-2" />
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
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Real-time insights into hospital operations, patient flow,
                      and financial metrics.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CreditCard className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Financial Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Complete billing, insurance processing, and revenue cycle
                      management tools.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <UserCheck className="h-8 w-8 text-primary mb-2" />
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
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Online Booking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Book appointments online, view available slots, and
                      receive automated reminders.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Health Records Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Secure access to medical records, test results, and
                      treatment history.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CreditCard className="h-8 w-8 text-primary mb-2" />
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
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Trusted by Healthcare Professionals
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of healthcare professionals who trust CuraCloud HMS
              for their daily operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover-scale"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.hospital}
                      </p>
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

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-lg transition-all duration-300 hover-scale ${
                  plan.popular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-primary hover:shadow-glow"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleGetStarted}
                  >
                    {plan.price === "Custom"
                      ? "Contact Sales"
                      : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
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

      {/* Call-to-Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of healthcare facilities already using CuraCloud.
            Start your free trial today and see the difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8"
              onClick={handleGetStarted}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setDemoDialogOpen(true)}
            >
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm mt-6 opacity-75">
            No credit card required • 14-day free trial • Setup in 24 hours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">CuraCloud</span>
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
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
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
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
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
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
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
                    href="#"
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
              &copy; {new Date().getFullYear()} CuraCloud. All rights reserved.
              Built with ❤️ for healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
