import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Heart,
  Users,
  Target,
  Eye,
  Award,
  TrendingUp,
  Shield,
  Globe,
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
  Zap,
  BarChart3,
  Stethoscope,
  UserCheck,
  Building2,
  Menu,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Team data
const teamMembers = [
  {
    name: "Obed M .G",
    role: "Chief Executive Officer",
    image: "/placeholder.svg",
    bio: "Senior Software Engineerwith 7+ years in software engineering",
    expertise: ["System Architecture", "AI & Machine Learning","DevOps"],
  },
  {
    name: "Michael Rodriguez",
    role: "Chief Technology Officer",
    image: "/placeholder.svg",
    bio: "Technology visionary with expertise in healthcare systems, security, and scalable architecture.",
    expertise: ["System Architecture", "Security", "AI & Machine Learning"],
  },
  {
    name: "Dr. James Okafor",
    role: "Chief Medical Officer",
    image: "/placeholder.svg",
    bio: "Board-certified physician with deep experience in clinical workflows and healthcare operations.",
    expertise: ["Clinical Workflows", "Medical Standards", "Quality Assurance"],
  },
  {
    name: "Lisa Thompson",
    role: "Head of Product",
    image: "/placeholder.svg",
    bio: "Product leader passionate about creating intuitive healthcare solutions that improve patient outcomes.",
    expertise: ["Product Strategy", "UX Design", "User Research"],
  },
];

// Values data
const values = [
  {
    icon: Heart,
    title: "Patient First",
    description: "Every decision we make prioritizes patient safety, privacy, and positive health outcomes.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "We maintain the highest standards of data security and regulatory compliance in healthcare.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in working closely with healthcare providers to build solutions that truly meet their needs.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Constantly pushing boundaries to deliver cutting-edge technology that transforms healthcare delivery.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making quality healthcare management accessible to facilities of all sizes, everywhere.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Committed to delivering exceptional quality in every feature, update, and support interaction.",
  },
];

// Milestones data
const milestones = [
  {
    year: "2022",
    title: "Company Founded",
    description: "Curacloud was born from a vision to revolutionize healthcare management in Africa.",
  },
  {
    year: "2023",
    title: "First Product Launch",
    description: "Launched our MVP serving 2 healthcare facilities with core HMS features.",
  },
  {
    year: "2024",
    title: "Growth Phase",
    description: "Expanded to serve 10+ healthcare facilities and introduced advanced analytics.",
  },
  {
    year: "2025",
    title: "Future Vision",
    description: "Planned expansion across West Africa with AI-powered predictive healthcare tools.",
  },
];

// Stats data
const companyStats = [
  { number: "2+", label: "Healthcare Facilities", icon: Building2 },
  { number: "10+", label: "Patients Served", icon: Users },
  { number: "99.9%", label: "System Uptime", icon: Clock },
  { number: "24/7", label: "Support Coverage", icon: UserCheck },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mission");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate("/auth/onboarding");
  };

  const handleContact = () => {
    toast.success("Our team will contact you within 24 hours!");
  };

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
              {/* <Link 
                to="/about-us" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                About Us
              </Link> */}
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
                About Curacloud
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Revolutionizing{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Healthcare
                </span>{" "}
                in Africa
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                We're on a mission to transform healthcare delivery through innovative technology, 
                making quality care accessible and efficient for every African healthcare facility.
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
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 h-14 border-2"
                  onClick={handleContact}
                >
                  Contact Us
                </Button>
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
                          <Target className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Our Mission</h3>
                        <p className="text-sm text-muted-foreground">
                          Democratize access to world-class healthcare management
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Eye className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Our Vision</h3>
                        <p className="text-sm text-muted-foreground">
                          Healthcare without boundaries across Africa
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Heart className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Our Values</h3>
                        <p className="text-sm text-muted-foreground">
                          Patient-first approach in everything we do
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Globe className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Our Impact</h3>
                        <p className="text-sm text-muted-foreground">
                          Serving healthcare facilities across the continent
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

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-16">
              <TabsTrigger value="mission" className="flex items-center gap-2 text-lg py-3">
                <Target className="h-5 w-5" />
                Our Mission
              </TabsTrigger>
              <TabsTrigger value="vision" className="flex items-center gap-2 text-lg py-3">
                <Eye className="h-5 w-5" />
                Our Vision
              </TabsTrigger>
              <TabsTrigger value="story" className="flex items-center gap-2 text-lg py-3">
                <Award className="h-5 w-5" />
                Our Story
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mission" className="animate-fade-in">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">
                    Our Mission: Transform Healthcare Delivery
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    We believe every healthcare facility in Africa deserves access to world-class 
                    management tools that enhance patient care, streamline operations, and drive growth.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Make advanced healthcare technology accessible and affordable",
                      "Empower healthcare providers with data-driven insights",
                      "Improve patient outcomes through better care coordination",
                      "Reduce administrative burden so providers can focus on patients"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
                  <Card className="relative p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <div className="text-6xl mb-4">🏥</div>
                      <h3 className="text-2xl font-bold mb-4">Why We Exist</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        Healthcare facilities across Africa face unique challenges in management, 
                        technology adoption, and resource optimization. Curacloud was built specifically 
                        to address these challenges with localized, affordable, and powerful solutions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vision" className="animate-fade-in">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20"></div>
                  <Card className="relative p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <div className="text-6xl mb-4">🌍</div>
                      <h3 className="text-2xl font-bold mb-4">The Future We're Building</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        A connected healthcare ecosystem where every facility, regardless of size or location, 
                        can deliver exceptional care through intelligent technology and seamless collaboration.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">
                    Our Vision: Healthcare Without Boundaries
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    We envision a future where technology bridges healthcare gaps, connects providers, 
                    and creates a unified health ecosystem across Africa.
                  </p>
                  <div className="space-y-4">
                    {[
                      "AI-powered predictive healthcare across the continent",
                      "Seamless health data exchange between facilities",
                      "Real-time public health monitoring and response",
                      "Telemedicine integration for remote communities"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-blue-500 flex-shrink-0" />
                        <span className="text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="story" className="animate-fade-in">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Journey</h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  From a simple idea to transform healthcare management to becoming a trusted partner 
                  for healthcare facilities across Africa.
                </p>

                <div className="relative">
                  {/* Timeline */}
                  <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0">
                          <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2 text-lg">
                            {milestone.year}
                          </Badge>
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-2xl font-bold mb-3">{milestone.title}</h3>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Heart className="h-4 w-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Drives Us Every Day
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our core values shape our culture, guide our decisions, and define how we serve our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
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

      {/* Team Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Users className="h-4 w-4 mr-2" />
              Meet Our Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Minds Behind Curacloud
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A diverse team of healthcare experts, technologists, and innovators united by a common mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 text-center">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Join Our Mission
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Transform Your Healthcare Facility?
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto">
            Join the growing number of healthcare facilities using Curacloud to deliver exceptional care 
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
              className="text-lg px-12 py-6 h-16 border-white text-white hover:bg-white/10"
              onClick={handleContact}
            >
              Contact Our Team
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-80">
            <div className="flex items-center justify-center gap-3">
              <Stethoscope className="h-5 w-5" />
              <span>Built by Healthcare Experts</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5" />
              <span>Enterprise-Grade Security</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Check className="h-5 w-5" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Get In Touch
              </Badge>
              <h2 className="text-4xl font-bold mb-6">Let's Build the Future of Healthcare Together</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Whether you're a healthcare provider, potential partner, or interested in joining our team, 
                we'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">hello@curacloud.com.ng</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">+234 800 000 0000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="ghost" size="sm">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Dr. John Smith" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john.smith@hospital.com" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      placeholder="Tell us about your healthcare facility and how we can help..."
                      rows={5}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary h-12">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
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