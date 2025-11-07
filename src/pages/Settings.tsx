import { useState } from "react";
import { User, Lock, Bell, Shield, Moon, Sun } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDERS, TITLES } from "@/constants";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Country,
  fetchCities,
  fetchCountries,
  fetchStates,
} from "@/services/onboarding";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const { toast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [_, setSelectedState] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleId: "",
    departmentId: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    cityId: "",
    stateId: "",
    countryId: "",
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
      variant: "success",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
      variant: "success",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
      variant: "success",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ============================
   * FETCH COUNTRIES
  ================================
   */
  const {
    data: countries = [],
    isLoading: loadingCountries,
    isFetching: isFetchingCountries,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  /* ============================
   * FETCH STATE
  ================================
   */
  const {
    data: states = [],
    isLoading: loadingState,
    isFetching: isFetchingStates,
  } = useQuery({
    queryKey: ["states", selectedCountry?.id],
    queryFn: () => fetchStates(selectedCountry!.id),
    enabled: !!selectedCountry,
  });
  /* ============================
   * FETCH CITIES
  ================================
   */
  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ["cities", formData.stateId],
    queryFn: () => fetchCities(Number(formData.stateId)),
    enabled: !!formData.stateId,
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="shadow-medium border-border/50">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="title">Title * </Label>
                        <Select
                          required={true}
                          // value={formData.title}
                          // onValueChange={(value) =>
                          //   setFormData({ ...formData, title: value })
                          // }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Title" />
                          </SelectTrigger>
                          <SelectContent>
                            {TITLES.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select
                          required={true}
                          // value={formData.gender}
                          // onValueChange={(value) =>
                          //   setFormData({ ...formData, gender: value })
                          // }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="darkmode"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={formData.countryId}
                          onValueChange={(value) => {
                            handleInputChange("countryId", value);
                            const country = countries.find(
                              (c) => c.id === Number(value)
                            );
                            setSelectedCountry(country || null);
                            setSelectedState(null);
                            handleInputChange("stateId", "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                loadingCountries || isFetchingCountries
                                  ? "Loading..."
                                  : "Select Country"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem
                                key={country.id}
                                value={country.id.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={country.flag.svg}
                                    alt={country.name}
                                    className="w-5 h-4 object-cover"
                                  />
                                  <span>{country.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.stateId}
                          onValueChange={(value) => {
                            handleInputChange("stateId", value);
                            setSelectedState(Number(value));
                          }}
                          disabled={!selectedCountry}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                loadingState || isFetchingStates
                                  ? "Loading..."
                                  : "Select State"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem
                                key={state.id}
                                value={state.id.toString()}
                              >
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={formData.cityId}
                          onValueChange={(value) => {
                            const city = cities.find(
                              (c) => c.id === Number(value)
                            );
                            setFormData((prev) => ({
                              ...prev,
                              cityId: value,
                              city: city?.name || "",
                            }));
                          }}
                          disabled={!formData.stateId}
                        >
                          <SelectTrigger id="city">
                            <SelectValue
                              placeholder={
                                loadingCities ? "Loading..." : "Select city"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={String(city.id)}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Type address here"
                        className="min-h-[100px]"
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account">
                <div className="space-y-6">
                  <Card className="shadow-medium border-border/50">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input id="currentPassword" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input id="confirmPassword" type="password" />
                      </div>

                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Password must be at least 8 characters long and
                          include uppercase, lowercase, numbers, and special
                          characters.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-end">
                        <Button onClick={handleChangePassword}>
                          Update Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-medium border-border/50">
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>
                        Add an extra layer of security to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Enable 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Require authentication code in addition to password
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="shadow-medium border-border/50">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about important events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates and alerts via email
                          </p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Get urgent alerts via text message
                          </p>
                        </div>
                        <Switch
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-medium">Appointment Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Reminders for upcoming appointments
                          </p>
                        </div>
                        <Switch
                          checked={appointmentReminders}
                          onCheckedChange={setAppointmentReminders}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-medium">Lab Results</p>
                          <p className="text-sm text-muted-foreground">
                            Notification when lab results are available
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                          <p className="font-medium">System Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Important system maintenance and updates
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotifications}>
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <div className="space-y-6">
                  <Card className="shadow-medium border-border/50">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>
                        Control your data and privacy preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div className="space-y-1">
                            <p className="font-medium">Profile Visibility</p>
                            <p className="text-sm text-muted-foreground">
                              Make your profile visible to other staff members
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div className="space-y-1">
                            <p className="font-medium">Activity Status</p>
                            <p className="text-sm text-muted-foreground">
                              Show when you're online or active
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div className="space-y-1">
                            <p className="font-medium">Data Sharing</p>
                            <p className="text-sm text-muted-foreground">
                              Share anonymized data for research purposes
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Appearance</h3>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div className="space-y-1 flex-1">
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">
                              Switch between light and dark theme
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-muted-foreground" />
                            <Switch
                              checked={darkMode}
                              onCheckedChange={setDarkMode}
                            />
                            <Moon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <Alert
                        variant="destructive"
                        className="border-destructive/50"
                      >
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <p className="font-semibold mb-2">Danger Zone</p>
                          <p className="text-sm mb-4">
                            Once you delete your account, there is no going
                            back. Please be certain.
                          </p>
                          <Button variant="destructive" size="sm">
                            Delete Account
                          </Button>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
