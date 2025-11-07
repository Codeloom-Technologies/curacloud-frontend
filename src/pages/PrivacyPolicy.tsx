import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Privacy Policy</h1>
            </div>
          </div>
          <Button onClick={() => navigate("/auth/login")}>Sign In</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Introduction */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Your Privacy Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Last Updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                At Curacloud HMS, we are committed to protecting your privacy
                and ensuring the security of your personal and health
                information. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                Hospital Management System.
              </p>
              <p>
                We understand the sensitive nature of healthcare data and comply
                with all applicable healthcare privacy regulations, including
                HIPAA (Health Insurance Portability and Accountability Act) and
                GDPR (General Data Protection Regulation).
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Patient Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Personal identifiers (name, date of birth, contact
                    information)
                  </li>
                  <li>Medical history and health records</li>
                  <li>Treatment plans and prescriptions</li>
                  <li>Laboratory and diagnostic test results</li>
                  <li>Insurance and billing information</li>
                  <li>Emergency contact details</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  Healthcare Provider Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Professional credentials and qualifications</li>
                  <li>Employment records and shift schedules</li>
                  <li>Contact information</li>
                  <li>Performance and training records</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">System Usage Data</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Login credentials and authentication data</li>
                  <li>Access logs and system activity</li>
                  <li>IP addresses and device information</li>
                  <li>Browser type and operating system</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Patient Care:</strong> To provide, coordinate, and
                    manage healthcare services and treatment
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Clinical Operations:</strong> To schedule
                    appointments, manage medical records, and coordinate care
                    between healthcare providers
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Billing and Insurance:</strong> To process payments,
                    submit insurance claims, and manage financial records
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Legal Compliance:</strong> To comply with healthcare
                    regulations, legal obligations, and respond to lawful
                    requests
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Quality Improvement:</strong> To analyze and improve
                    our services, system performance, and patient outcomes
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Communication:</strong> To send appointment
                    reminders, treatment updates, and important healthcare
                    notifications
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may share your information only in the following
                circumstances:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Healthcare Team:</strong> With doctors, nurses, and
                    other healthcare providers involved in your care
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Insurance Companies:</strong> For billing, claims
                    processing, and coverage verification
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Legal Authorities:</strong> When required by law,
                    court order, or to protect health and safety
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Business Associates:</strong> With trusted service
                    providers who assist in operations (all bound by strict
                    confidentiality agreements)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Your Authorization:</strong> With any other party
                    when you provide explicit written consent
                  </span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We will never sell your personal health information to third
                parties.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement comprehensive security measures to protect your
                information:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• End-to-end encryption</li>
                    <li>• Secure data transmission (SSL/TLS)</li>
                    <li>• Regular security audits</li>
                    <li>• Intrusion detection systems</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">
                    Administrative Safeguards
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Role-based access control</li>
                    <li>• Staff training programs</li>
                    <li>• Audit trails and monitoring</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Physical Safeguards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Secure data centers</li>
                    <li>• Environmental controls</li>
                    <li>• Access restrictions</li>
                    <li>• Regular backups</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Data Protection</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Data minimization</li>
                    <li>• Anonymization when possible</li>
                    <li>• Secure disposal methods</li>
                    <li>• Breach notification protocols</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You have the following rights regarding your personal and health
                information:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <div>
                    <strong>Right to Access:</strong> Request copies of your
                    medical records and personal information
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <div>
                    <strong>Right to Correction:</strong> Request corrections to
                    inaccurate or incomplete information
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <div>
                    <strong>Right to Restriction:</strong> Request limitations
                    on how your information is used or disclosed
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <div>
                    <strong>Right to Confidential Communications:</strong>{" "}
                    Request alternative methods of communication
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <div>
                    <strong>Right to an Accounting:</strong> Receive a list of
                    disclosures of your information
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <div>
                    <strong>Right to File a Complaint:</strong> File a complaint
                    if you believe your privacy rights have been violated
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                We retain your information for as long as necessary to fulfill
                the purposes outlined in this policy and as required by
                applicable laws and regulations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Medical records: Retained according to legal requirements
                  (typically 7-10 years after last treatment)
                </li>
                <li>
                  Billing records: Retained for tax and audit purposes
                  (typically 7 years)
                </li>
                <li>
                  System logs: Retained for security and audit purposes
                  (typically 1-3 years)
                </li>
                <li>
                  Employee records: Retained according to employment law
                  requirements
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We recognize the importance of protecting children's privacy.
                For patients under 18 years of age, we obtain consent from
                parents or legal guardians before collecting, using, or
                disclosing their personal health information, except where
                permitted or required by law.
              </p>
            </CardContent>
          </Card>

          {/* International Data Transfers */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you are accessing our services from outside your country,
                please be aware that your information may be transferred to,
                stored, and processed in countries where our facilities or
                service providers are located. We ensure that such transfers
                comply with applicable data protection laws and use appropriate
                safeguards.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or
                other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Posting the updated policy on our website</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending email notifications for significant changes</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We encourage you to review this policy periodically to stay
                informed about how we protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Privacy Officer</h4>
                  <p className="text-sm text-muted-foreground">
                    privacy@curacloud.com
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">
                    Data Protection Officer
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    dpo@curacloud.com
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">General Inquiries</h4>
                  <p className="text-sm text-muted-foreground">
                    support@curacloud.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +234 7058149795
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    Curacloud HMS
                    <br />
                    123 Healthcare Way
                    <br />
                    Medical District, MD 12345
                    <br />
                    FCT Abuja
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home Button */}
          <div className="flex justify-center pt-8">
            <Button size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Curacloud HMS. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
