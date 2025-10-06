import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/services/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Failed to verify email. The link may have expired.");
      }
    };

    verify();
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            Verifying your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <>
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Success!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {message}
                </AlertDescription>
              </Alert>
              <Button onClick={handleContinue} className="w-full">
                Continue to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button onClick={handleContinue} variant="outline" className="w-full">
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
