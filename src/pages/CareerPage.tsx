import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Heart,
  Users,
  Target,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Clock,
  Star,
  Check,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Shield,
  Code,
  Stethoscope,
  Building2,
  Menu,
  Play,
  HeadphonesIcon,
  MessageCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Job openings data
const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Lagos, Nigeria",
    remote: true,
    experience: "5+ years",
    description: "Build beautiful, responsive healthcare management interfaces that transform patient care delivery.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
  },
  {
    id: 2,
    title: "Healthcare Product Manager",
    department: "Product",
    type: "Full-time",
    location: "Remote",
    remote: true,
    experience: "4+ years",
    description: "Lead product strategy and development for our healthcare management platform.",
    skills: ["Product Strategy", "User Research", "Agile", "Healthcare", "Analytics"],
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Lagos, Nigeria",
    remote: true,
    experience: "3+ years",
    description: "Ensure our healthcare platform maintains 99.9% uptime with robust infrastructure.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    id: 4,
    title: "Customer Success Manager",
    department: "Customer Success",
    type: "Full-time",
    location: "Remote",
    remote: true,
    experience: "3+ years",
    description: "Help healthcare facilities maximize their use of Curacloud and achieve their goals.",
    skills: ["Customer Success", "Healthcare", "Training", "Support", "CRM"],
  },
  {
    id: 5,
    title: "UX/UI Designer",
    department: "Design",
    type: "Full-time",
    location: "Lagos, Nigeria",
    remote: true,
    experience: "3+ years",
    description: "Design intuitive experiences that make healthcare management simple and efficient.",
    skills: ["Figma", "User Research", "Prototyping", "Healthcare", "Design Systems"],
  },
  {
    id: 6,
    title: "Sales Development Representative",
    department: "Sales",
    type: "Full-time",
    location: "Remote",
    remote: true,
    experience: "2+ years",
    description: "Connect with healthcare facilities and introduce them to Curacloud's transformative solutions.",
    skills: ["Sales", "Healthcare", "CRM", "Communication", "Outreach"],
  },
];

// Benefits data
const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Industry-competitive compensation with regular reviews and bonuses",
  },
  {
    icon: Shield,
    title: "Health Insurance",
    description: "Comprehensive health, dental, and vision insurance for you and your family",
  },
  {
    icon: Globe,
    title: "Remote Work",
    description: "Flexible remote work options with occasional team gatherings",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "Annual budget for conferences, courses, and professional development",
  },
  {
    icon: Award,
    title: "Career Growth",
    description: "Clear career paths and mentorship programs for professional development",
  },
  {
    icon: Users,
    title: "Great Team Culture",
    description: "Collaborative environment with regular team events and activities",
  },
];

// Team culture data
const cultureValues = [
  {
    icon: Heart,
    title: "Patient-First Mindset",
    description: "Everything we do is centered around improving patient care and outcomes",
  },
  {
    icon: Zap,
    title: "Innovation Driven",
    description: "We encourage experimentation and pushing boundaries in healthcare technology",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description: "We believe in working together to solve complex healthcare challenges",
  },
  {
    icon: Target,
    title: "Impact Focused",
    description: "We measure success by the positive impact we create in healthcare delivery",
  },
];

export default function CareersPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    portfolio: "",
  });

  const handleGetStarted = () => {
    navigate("/auth/onboarding");
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplyDialogOpen(true);
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the application to your backend
    console.log("Application submitted:", { job: selectedJob, ...applicationForm });
    toast.success("Application submitted successfully! We'll be in touch soon.");
    setApplyDialogOpen(false);
    setApplicationForm({
      name: "",
      email: "",
      phone: "",
      resume: null,
      coverLetter: "",
      portfolio: "",
    });
  };

  const departments = ["all", "engineering", "product", "design", "sales", "customer-success"];
  const filteredJobs = activeDepartment === "all" 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department.toLowerCase() === activeDepartment);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-lg">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Curacloud
                  </span>
                  <span className="block text-xs text-muted-foreground -mt-1">Healthcare Management System</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/#solutions" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Solutions
              </Link>
              <Link to="/#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/#security" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Security
              </Link>
              <Link to="/about-us" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/careers" className="text-sm font-medium text-primary border-b-2 border-primary">
                Careers
              </Link>
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
                  <Link
                    to="/#features"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    to="/#solutions"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Solutions
                  </Link>
                  <Link
                    to="/#pricing"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/#security"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Security
                  </Link>
                  <Link
                    to="/about-us"
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/careers"
                    className="text-lg font-medium text-primary py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Careers
                  </Link>
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Join Our Team
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Build the Future of{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Healthcare
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Join us in revolutionizing healthcare delivery across Africa. Work on meaningful problems 
                that impact millions of patients and healthcare providers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-3 h-14 shadow-xl"
                  onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}
                >
                  View Open Positions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 h-14 border-2"
                  onClick={() => document.getElementById('culture').scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Learn About Culture
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Remote-first company
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Competitive salary & equity
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Health insurance
                </div>
              </div>
            </div>

            <div className="animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative rounded-3xl shadow-2xl overflow-hidden border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Users className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Growing Team</h3>
                        <p className="text-sm text-muted-foreground">
                          20+ talented professionals
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Globe className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Remote First</h3>
                        <p className="text-sm text-muted-foreground">
                          Work from anywhere
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Award className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Impact Driven</h3>
                        <p className="text-sm text-muted-foreground">
                          Transform healthcare
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Zap className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Fast Growth</h3>
                        <p className="text-sm text-muted-foreground">
                          2x team growth this year
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Values Section */}
      <section id="culture" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Heart className="h-4 w-4 mr-2" />
              Our Culture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Work With Purpose
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're building more than just software - we're creating a better healthcare future for Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105 text-center"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Award className="h-4 w-4 mr-2" />
              Perks & Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              We Take Care of Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive benefits designed to support your well-being and professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Briefcase className="h-4 w-4 mr-2" />
              Open Positions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Help us build the future of healthcare management. Check out our current openings.
            </p>
          </div>

          {/* Department Filter */}
          <Tabs value={activeDepartment} onValueChange={setActiveDepartment} className="mb-12">
            <TabsList className="flex flex-wrap justify-center">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All Departments
              </TabsTrigger>
              <TabsTrigger value="engineering" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Engineering
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Product
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Sales
              </TabsTrigger>
              <TabsTrigger value="customer-success" className="flex items-center gap-2">
                <HeadphonesIcon className="h-4 w-4" />
                Customer Success
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Job Listings */}
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="group hover:shadow-xl transition-all duration-500 hover:border-primary/30">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">{job.title}</h3>
                        <Badge variant="secondary" className="capitalize">
                          {job.department}
                        </Badge>
                        {job.remote && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Remote
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.experience}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApply(job)}
                      className="bg-gradient-primary hover:shadow-glow transition-all whitespace-nowrap"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Open Positions</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no open positions in this department. Check back later or explore other departments.
              </p>
              <Button
                onClick={() => setActiveDepartment("all")}
                variant="outline"
              >
                View All Positions
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Apply for {selectedJob?.title}
            </DialogTitle>
            <DialogDescription className="text-lg">
              Join us in transforming healthcare across Africa. We're excited to learn about you!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApplicationSubmit} className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicant-name" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="applicant-name"
                  placeholder="John Smith"
                  value={applicationForm.name}
                  onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicant-email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="applicant-email"
                  type="email"
                  placeholder="john.smith@example.com"
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="applicant-phone"
                type="tel"
                placeholder="+234 xxx xxx xxxx"
                value={applicationForm.phone}
                onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-resume" className="text-sm font-medium">Resume *</Label>
              <Input
                id="applicant-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplicationForm({ ...applicationForm, resume: e.target.files[0] })}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-portfolio" className="text-sm font-medium">Portfolio/LinkedIn URL</Label>
              <Input
                id="applicant-portfolio"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={applicationForm.portfolio}
                onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-cover" className="text-sm font-medium">Cover Letter</Label>
              <Textarea
                id="applicant-cover"
                placeholder="Tell us why you're excited about this role and what you can bring to our team..."
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary px-8">
                Submit Application
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Final CTA Section */}
      <section className="py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Can't Find Your Role?
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            We're Always Looking for Talent
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto">
            Even if you don't see the perfect role listed, we'd love to hear from you. 
            Send us your resume and tell us how you can help transform healthcare in Africa.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-12 py-6 h-16 bg-white text-primary hover:bg-white/90 shadow-2xl"
              onClick={() => {
                setSelectedJob({ title: "General Application" });
                setApplyDialogOpen(true);
              }}
            >
              Send General Application
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-6 h-16 border-white text-white hover:bg-white/10"
              onClick={() => navigate("/about-us")}
            >
              <MessageCircle className="mr-3 h-5 w-5" />
              Learn About Us
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-80">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5" />
              <span>Flexible Working Hours</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Globe className="h-5 w-5" />
              <span>Remote-First Company</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="h-5 w-5" />
              <span>Rapid Career Growth</span>
            </div>
          </div>
        </div>
          </section>
          
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