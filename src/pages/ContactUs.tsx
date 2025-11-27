import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Heart,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  HeadphonesIcon,
  Zap,
  Check,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Calendar,
  Building2,
  Globe,
  Shield,
  Menu,
  Send,
  MessageSquare,
  Video,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Contact methods data
const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll get back to you within 24 hours",
    details: "hello@curacloud.com",
    action: "Send Email",
    color: "bg-blue-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team during business hours",
    details: "+234 800 000 0000",
    action: "Call Now",
    color: "bg-green-500",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come see us at our headquarters in Lagos",
    details: "Lagos, Nigeria",
    action: "Get Directions",
    color: "bg-purple-500",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    details: "Available 24/7",
    action: "Start Chat",
    color: "bg-orange-500",
  },
];

// Support types data
const supportTypes = [
  {
    icon: HeadphonesIcon,
    title: "Technical Support",
    description: "Get help with platform issues, bugs, or technical questions",
    responseTime: "Within 2 hours",
    department: "Support Team",
  },
  {
    icon: Users,
    title: "Sales Inquiry",
    description: "Learn about pricing, features, and how Curacloud can help your facility",
    responseTime: "Within 1 hour",
    department: "Sales Team",
  },
  {
    icon: Building2,
    title: "Partnership",
    description: "Explore integration opportunities and strategic partnerships",
    responseTime: "Within 24 hours",
    department: "Partnerships Team",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Questions about data security, HIPAA compliance, and certifications",
    responseTime: "Within 4 hours",
    department: "Security Team",
  },
];

// FAQ data
const faqs = [
  {
    question: "How quickly can I get started with Curacloud?",
    answer: "You can start your free 14-day trial immediately after signing up. Most facilities are fully set up and running within 48 hours."
  },
  {
    question: "Do you offer custom solutions for large hospitals?",
    answer: "Yes! Our Enterprise plan includes custom development, dedicated support, and tailored features for large healthcare facilities."
  },
  {
    question: "Is Curacloud HIPAA compliant?",
    answer: "Absolutely. We maintain full HIPAA compliance with end-to-end encryption, secure data centers, and regular security audits."
  },
  {
    question: "Can I integrate Curacloud with my existing systems?",
    answer: "Yes, we offer comprehensive API access and support integrations with most major healthcare systems and laboratory interfaces."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide 24/7 support via phone, email, and live chat, along with dedicated account managers for enterprise customers."
  },
  {
    question: "Do you offer training for our staff?",
    answer: "Yes, we provide comprehensive training sessions, documentation, and ongoing support to ensure your team is comfortable with the platform."
  },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    facilityName: "",
    facilitySize: "",
    subject: "",
    message: "",
    contactMethod: "email",
  });
  const [activeFaq, setActiveFaq] = useState(null);

  const handleGetStarted = () => {
    navigate("/auth/onboarding");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Contact form submitted:", contactForm);
    toast.success("Thank you! We'll get back to you within 24 hours.");
    setContactForm({
      name: "",
      email: "",
      phone: "",
      facilityName: "",
      facilitySize: "",
      subject: "",
      message: "",
      contactMethod: "email",
    });
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    toast.success("Demo scheduled! We'll contact you to confirm the time.");
    setDemoDialogOpen(false);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
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
                    className="text-lg font-medium hover:text-primary transition-colors py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Careers
                  </Link>
                  <Link
                    to="/contact"
                    className="text-lg font-medium text-primary py-2 border-b"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
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
                <MessageCircle className="h-4 w-4 mr-2" />
                Get In Touch
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Let's Transform{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Healthcare
                </span>{" "}
                Together
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Ready to streamline your healthcare facility? Our team is here to help you 
                get started, answer questions, and support your digital transformation journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-3 h-14 shadow-xl"
                  onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </Button>
                <Dialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-3 h-14 border-2"
                    >
                      <Video className="mr-2 h-5 w-5" />
                      Schedule Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Schedule a Personalized Demo</DialogTitle>
                      <DialogDescription className="text-lg">
                        See how Curacloud can transform your healthcare facility with a live demo.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDemoSubmit} className="space-y-6 mt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="demo-name" className="text-sm font-medium">Full Name *</Label>
                          <Input
                            id="demo-name"
                            placeholder="Dr. John Smith"
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="demo-email" className="text-sm font-medium">Email Address *</Label>
                          <Input
                            id="demo-email"
                            type="email"
                            placeholder="john.smith@hospital.com"
                            required
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="demo-phone" className="text-sm font-medium">Phone Number</Label>
                          <Input
                            id="demo-phone"
                            type="tel"
                            placeholder="+234 xxx xxx xxxx"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="demo-facility" className="text-sm font-medium">Facility Name *</Label>
                          <Input
                            id="demo-facility"
                            placeholder="Metro General Hospital"
                            required
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="demo-date" className="text-sm font-medium">Preferred Date</Label>
                          <Input
                            id="demo-date"
                            type="date"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="demo-time" className="text-sm font-medium">Preferred Time</Label>
                          <Input
                            id="demo-time"
                            type="time"
                            className="h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demo-notes" className="text-sm font-medium">Specific Areas of Interest</Label>
                        <Textarea
                          id="demo-notes"
                          placeholder="Tell us which features you're most interested in..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => setDemoDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary px-8">
                          Schedule Demo
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  24/7 Support Available
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Response within 2 hours
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  HIPAA Compliant
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
                          <HeadphonesIcon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">24/7 Support</h3>
                        <p className="text-sm text-muted-foreground">
                          Always here to help
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Zap className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Fast Response</h3>
                        <p className="text-sm text-muted-foreground">
                          Under 2 hours
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Secure</h3>
                        <p className="text-sm text-muted-foreground">
                          HIPAA Compliant
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Globe className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">Global</h3>
                        <p className="text-sm text-muted-foreground">
                          Serving Africa
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

      {/* Contact Methods Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <MessageSquare className="h-4 w-4 mr-2" />
              How to Reach Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Multiple Ways to Connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the contact method that works best for you. We're here to help however you prefer to communicate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105 text-center"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{method.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  <p className="text-lg font-semibold text-primary mb-4">
                    {method.details}
                  </p>
                  <Button variant="outline" className="w-full">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Types Section */}
      <section className="py-24 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Users className="h-4 w-4 mr-2" />
              Get the Right Help
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Specialized Support Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our dedicated teams are ready to assist with your specific needs and ensure you get the best possible support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportTypes.map((support, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <support.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{support.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {support.description}
                  </p>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="font-semibold text-green-600">{support.responseTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Team:</span>
                      <span className="font-semibold">{support.department}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Send className="h-4 w-4 mr-2" />
                Send us a Message
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Have questions about Curacloud? Interested in a demo? Need technical support? 
                Fill out the form and our team will get back to you promptly.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">hello@curacloud.com</p>
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

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 8AM - 6PM WAT</p>
                    <p className="text-muted-foreground">Support: 24/7 Available</p>
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
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Dr. John Smith"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.smith@hospital.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 xxx xxx xxxx"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility" className="text-sm font-medium">Facility Name</Label>
                      <Input
                        id="facility"
                        placeholder="Metro General Hospital"
                        value={contactForm.facilityName}
                        onChange={(e) => setContactForm({ ...contactForm, facilityName: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your healthcare facility and how we can help..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary h-12">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <MessageCircle className="h-4 w-4 mr-2" />
              Common Questions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find quick answers to the most common questions about Curacloud and our services.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    <div className={`transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </button>
                  {activeFaq === index && (
                    <p className="text-muted-foreground mt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            Ready to Get Started?
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Transform Your Healthcare Facility Today
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-4xl mx-auto">
            Join thousands of healthcare facilities using Curacloud to deliver exceptional patient care 
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
              onClick={() => setDemoDialogOpen(true)}
            >
              <Video className="mr-3 h-5 w-5" />
              Schedule Live Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-80">
            <div className="flex items-center justify-center gap-3">
              <HeadphonesIcon className="h-5 w-5" />
              <span>24/7 Dedicated Support</span>
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