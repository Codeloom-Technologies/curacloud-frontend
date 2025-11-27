import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Building2, User, Shield, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { verifyInvitation, acceptInvitation } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface InvitationData {
  id: number;
  email: string;
  fullName: string;
  healthcareProvider: {
    id: number;
    name: string;
    xHospitalId: string;
  };
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
  inviterName: string;
}

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const { clearAuth } = useAuthStore();

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Verify invitation token
  const {
    data: invitationResponse,
    isLoading: isVerifying,
    isError: isVerifyError,
    error: verifyError,
  } = useQuery({
    queryKey: ["verify-invitation", token],
    queryFn: () => verifyInvitation(token!),
    enabled: !!token,
    retry: false,
  });

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      toast({
        title: "Welcome to the team!",
        description: "Your account has been successfully activated.",
        variant: "success",
      });
     localStorage.removeItem('authUser');
    localStorage.removeItem('hospital');
    localStorage.removeItem('authToken');
    localStorage.removeItem('hospitalToken');
      localStorage.removeItem('auth-storage')
          localStorage.removeItem('hospitals');

    // Clear auth store
    clearAuth();
      // Redirect to login or dashboard
      setTimeout(() => {
        navigate("/auth/login", { 
          state: { 
            message: "Account activated successfully. Please login with your new password." 
          } 
        });
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Activation failed",
        description: error?.message || "Failed to activate your account",
        variant: "destructive",
      });
    },
  });

  

  useEffect(() => {
    if (invitationResponse) {
      setInvitationData(invitationResponse);
    }

  }, [invitationResponse]);

  const onSubmit = (data: PasswordFormData) => {
    if (!token || !invitationData) return;

    acceptInvitationMutation.mutate({
      token,
      password: data.password,
    });
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <InvalidInvitation 
          title="Invalid Invitation Link"
          message="The invitation link is missing or invalid. Please check your email for the correct link."
        />
      </div>
    );
  }

  if (isVerifyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <InvalidInvitation 
          title="Invalid Invitation"
          message={verifyError?.message || "This invitation link is invalid or has expired."}
        />
      </div>
    );
  }

  if (invitationData?.status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <InvalidInvitation 
          title="Invitation Expired"
          message="This invitation has expired. Please contact your healthcare facility administrator for a new invitation."
        />
      </div>
    );
  }

  if (invitationData?.status === 'accepted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <InvalidInvitation 
          title="Invitation Already Accepted"
          message="This invitation has already been accepted. Please login to access your account."
          showLoginButton={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-blue-900">
              Accept Invitation
            </CardTitle>
            <CardDescription className="text-blue-700">
              Complete your account setup for {invitationData?.healthcareProvider?.name}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Invitation Details */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{invitationData?.fullName}</p>
                  <p className="text-xs text-blue-600">{invitationData?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{invitationData?.healthcareProvider?.name}</p>
                  <p className="text-xs text-blue-600">ID: {invitationData?.healthcareProvider?.xHospitalId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Role</p>
                  <p className="text-xs text-blue-600 capitalize">{invitationData?.role?.replace('_', ' ')}</p>
                </div>
              </div>

              {invitationData?.inviterName && (
                <div className="text-xs text-blue-600">
                  Invited by: {invitationData?.inviterName}
                </div>
              )}
            </div>

            {/* Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900">
                  Create Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pr-10 border-blue-200 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-blue-900">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="pr-10 border-blue-200 focus:border-blue-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <PasswordStrengthIndicator password={password} />
              )}

              {/* Password Match Indicator */}
              {password && confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-red-600" />
                      <span className="text-red-600">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={acceptInvitationMutation.isPending}
                className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
              >
                {acceptInvitationMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Activating Account...
                  </>
                ) : (
                  "Activate Account"
                )}
              </Button>
            </form>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700 text-sm">
                By activating your account, you agree to our Terms of Service and Privacy Policy.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Password Strength Component
function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-green-600"];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-blue-900">Password Strength</span>
        <span className={`font-medium ${
          strength >= 4 ? "text-green-600" : 
          strength >= 2 ? "text-yellow-600" : "text-red-600"
        }`}>
          {strengthLabels[strength]}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors ${
              index <= strength ? strengthColors[strength] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Invalid Invitation Component
function InvalidInvitation({ 
  title, 
  message, 
  showLoginButton = false 
}: { 
  title: string; 
  message: string; 
  showLoginButton?: boolean; 
}) {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm max-w-md w-full">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-blue-900">{title}</CardTitle>
        <CardDescription className="text-blue-700">{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {showLoginButton && (
          <Button 
            onClick={() => {
              localStorage.removeItem('authUser');
              localStorage.removeItem('hospital');
              localStorage.removeItem('authToken');
              localStorage.removeItem('hospitalToken');
              localStorage.removeItem('auth-storage')
                        localStorage.removeItem('hospitals');
              navigate("/auth/login")
              
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        )}
      </CardContent>
    </Card>
  );
}