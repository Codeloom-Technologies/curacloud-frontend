import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Eye, EyeOff, Shield, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoginApiPayload } from "@/types/auth";
import { mapFormToLoginApiPayload, submitLogging } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState<LoginApiPayload>({
    email: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const mutation = useMutation({
    mutationFn: submitLogging,
    onSuccess: (data) => {
      // Store auth data in zustand store
      setAuth(data.user, data.accessToken);

      toast({
        variant: "success",
        title: "Login Successful",
        description: `Welcome back, ${data.user.roles[0]?.name || "User"}`,
      });

      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Unable to log in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = mapFormToLoginApiPayload(formData);
    mutation.mutate(payload);
  };

  const features = [
    {
      icon: Shield,
      title: "Secure & HIPAA Compliant",
      description:
        "Your patient data is protected with enterprise-grade security",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description:
        "Doctors, nurses, admin staff - everyone has their custom interface",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Monitor hospital operations with live dashboards and reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="text-white space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Heart className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Curacloud</h1>
              <p className="text-lg opacity-90">Hospital Management System</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Transform Your Healthcare Operations
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Streamline patient care, optimize workflows, and improve outcomes
              with our comprehensive hospital management platform trusted by
              healthcare providers worldwide.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-strong border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your Curacloud account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-mail@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    Remember me
                  </label>
                  <Button
                    variant="link"
                    onClick={() => navigate("/auth/reset-password")}
                    className="p-0 h-auto text-primary"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-primary hover:shadow-glow transition-all"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo Accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted text-center">
                  <p className="font-medium">Doctor</p>
                  <p className="text-muted-foreground">doctor@demo.com</p>
                </div>
                <div className="p-2 rounded bg-muted text-center">
                  <p className="font-medium">Admin</p>
                  <p className="text-muted-foreground">admin@demo.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
