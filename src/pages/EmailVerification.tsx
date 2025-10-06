import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/services/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Query to verify email
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      if (!token)
        throw new Error("Invalid verification link. No token provided.");
      return await verifyEmail(token);
    },
    retry: false, // don't retry invalid/expired links
  });

  const handleContinue = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Verifying your email...
              </p>
            </div>
          )}

          {isSuccess && (
            <>
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">
                  Success!
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {data?.message || "Email verified successfully!"}
                </AlertDescription>
              </Alert>
              <Button onClick={handleContinue} className="w-full">
                Continue to Login
              </Button>
            </>
          )}

          {isError && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  {(error as Error)?.message ||
                    "Failed to verify email. The link may have expired."}
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleContinue}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
