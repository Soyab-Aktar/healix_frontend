"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Activity, Heart, FileText, CheckCircle, ShieldAlert, Upload, Trash2, Camera, UserCheck } from "lucide-react";
import { getUserinfo } from "@/services/auth.services";
import { updatePatientProfile } from "@/services/profile.services";
import { updateDoctor } from "@/services/doctor.services";
import { updateAdmin } from "@/services/admin.services";
import { format } from "date-fns";
import { IMedicalReport } from "@/types/patient.types";

const MyProfileForm = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportsInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getUserinfo,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // File Upload states (for patient uploads)
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [newReports, setNewReports] = useState<File[]>([]);
  const [deletedReportIds, setDeletedReportIds] = useState<string[]>([]);

  // Local state for editable fields (initialized in useEffect or read directly)
  const role = user?.role;
  const patient = user?.patient;
  const doctor = user?.doctor;
  const admin = user?.admin || user?.superAdmin;

  // Resolve current profile info
  const currentName = patient?.name || doctor?.name || admin?.name || user?.name || "";
  const currentContact = patient?.contactNumber || doctor?.contactNumber || admin?.contactNumber || "";
  const currentAddress = patient?.address || doctor?.address || "";
  const currentPhoto = patient?.profilePhoto || doctor?.profilePhoto || admin?.profilePhoto || user?.profilePhoto || "";

  // Patient Health data (local form state overrides)
  const health = patient?.patientHealthData;
  const reports = patient?.medicalReports || [];

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleReportsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const array = Array.from(files);
      if (newReports.length + array.length > 5) {
        toast.error("You can upload at most 5 new medical reports at once.");
        return;
      }
      setNewReports((prev) => [...prev, ...array]);
    }
  };

  const removeNewReport = (index: number) => {
    setNewReports((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteReport = (reportId: string) => {
    setDeletedReportIds((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    const formDataElements = e.currentTarget;
    const formVal = new FormData(formDataElements);

    try {
      if (role === "PATIENT" && patient) {
        // Patient update -> FormData with 'data' stringified JSON
        const patientInfo = {
          name: formVal.get("name") as string,
          contactNumber: formVal.get("contactNumber") as string,
          address: formVal.get("address") as string,
        };

        const dobVal = formVal.get("dateOfBirth") as string;
        const patientHealthData = {
          gender: formVal.get("gender") as string,
          dateOfBirth: dobVal ? new Date(dobVal).toISOString() : undefined,
          bloodGroup: formVal.get("bloodGroup") as string,
          height: formVal.get("height") as string,
          weight: formVal.get("weight") as string,
          smokingStatus: formVal.get("smokingStatus") === "true",
          pregnancyStatus: formVal.get("pregnancyStatus") === "true",
          hasAllergies: formVal.get("hasAllergies") === "true",
          hasDiabetes: formVal.get("hasDiabetes") === "true",
          hasPastSurgeries: formVal.get("hasPastSurgeries") === "true",
          recentAnxiety: formVal.get("recentAnxiety") === "true",
          recentDepression: formVal.get("recentDepression") === "true",
          dietaryPreferences: formVal.get("dietaryPreferences") as string,
          mentalHealthHistory: formVal.get("mentalHealthHistory") as string,
          immunizationStatus: formVal.get("immunizationStatus") as string,
          maritalStatus: formVal.get("maritalStatus") as string,
        };

        const medicalReportsPayload = deletedReportIds.map((id) => ({
          shouldDelete: true,
          reportId: id,
        }));

        const dataPayload = {
          patientInfo,
          patientHealthData,
          medicalReports: medicalReportsPayload,
        };

        const uploadFormData = new FormData();
        uploadFormData.append("data", JSON.stringify(dataPayload));

        if (profilePhotoFile) {
          uploadFormData.append("profilePhoto", profilePhotoFile);
        }

        newReports.forEach((file) => {
          uploadFormData.append("medicalReports", file);
        });

        await updatePatientProfile(uploadFormData);
      } else if (role === "DOCTOR" && doctor) {
        // Doctor update
        const payload = {
          doctor: {
            name: formVal.get("name") as string,
            profilePhoto: formVal.get("profilePhotoUrl") as string || doctor.profilePhoto || undefined,
            contactNumber: formVal.get("contactNumber") as string,
            address: formVal.get("address") as string,
            qualification: formVal.get("qualification") as string,
            currentWorkingPlace: formVal.get("currentWorkingPlace") as string,
            designation: formVal.get("designation") as string,
            experience: Number(formVal.get("experience")) || undefined,
            appointmentFee: Number(formVal.get("appointmentFee")) || undefined,
          },
        };
        await updateDoctor(doctor.id, payload);
      } else if ((role === "ADMIN" || role === "SUPER_ADMIN") && admin) {
        // Admin update
        const payload = {
          name: formVal.get("name") as string,
          profilePhoto: formVal.get("profilePhotoUrl") as string || admin.profilePhoto || undefined,
          contactNumber: formVal.get("contactNumber") as string,
        };
        await updateAdmin(admin.id, payload);
      }

      toast.success("Profile updated successfully!");
      setNewReports([]);
      setDeletedReportIds([]);
      setProfilePhotoFile(null);
      // Invalidate queries to reload /auth/me
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const userPhoto = profilePhotoPreview || currentPhoto || "/placeholder-avatar.png";

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal credentials, contact info, and medical records.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize px-3 py-1 font-semibold tracking-wide gap-1 bg-muted text-foreground border">
          <UserCheck className="h-3.5 w-3.5" />
          {role?.toLowerCase().replace("_", " ")}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Overview & Profile Photo Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="text-center pb-2">
              <div className="relative mx-auto w-28 h-28 rounded-full border-2 border-primary/20 overflow-hidden flex items-center justify-center bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userPhoto}
                  alt={currentName}
                  className="w-full h-full object-cover"
                />
                {role === "PATIENT" && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                )}
              </div>
              {role === "PATIENT" && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              )}
              <CardTitle className="mt-4 text-lg font-bold truncate">{currentName}</CardTitle>
              <CardDescription className="truncate">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-sm border-t mt-4">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Account Status</span>
                <Badge variant="outline" className="text-xs capitalize font-medium">
                  {user?.status?.toLowerCase()}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Member Since</span>
                <span>{user?.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}</span>
              </div>
              {patient && (
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Allergy Alerts</span>
                  <span>{health?.hasAllergies ? "Yes" : "No"}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Tab Forms */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 bg-muted">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="health" disabled={role !== "PATIENT"}>Health</TabsTrigger>
              <TabsTrigger value="conditions" disabled={role !== "PATIENT"}>Conditions</TabsTrigger>
              <TabsTrigger value="reports" disabled={role !== "PATIENT"}>Reports</TabsTrigger>
            </TabsList>

            {/* ACCOUNT TAB */}
            <TabsContent value="account">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-bold flex items-center gap-2">
                    <User className="h-4.5 w-4.5 text-primary" /> General Information
                  </CardTitle>
                  <CardDescription>
                    Update your primary account info. Users with non-patient roles must supply profile URLs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" defaultValue={currentName} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address (Read-only)</Label>
                      <Input id="email" defaultValue={user?.email} disabled className="bg-muted" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" name="contactNumber" defaultValue={currentContact} />
                    </div>
                    {role !== "PATIENT" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
                        <Input id="profilePhotoUrl" name="profilePhotoUrl" defaultValue={currentPhoto} placeholder="https://example.com/avatar.jpg" />
                      </div>
                    )}
                  </div>

                  {(role === "PATIENT" || role === "DOCTOR") && (
                    <div className="space-y-1.5">
                      <Label htmlFor="address">Residential Address</Label>
                      <Input id="address" name="address" defaultValue={currentAddress} />
                    </div>
                  )}

                  {role === "DOCTOR" && doctor && (
                    <div className="border-t pt-4 mt-4 space-y-4">
                      <h4 className="font-semibold text-sm text-primary">Doctor Clinical Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="designation">Designation</Label>
                          <Input id="designation" name="designation" defaultValue={doctor.designation} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="qualification">Qualification</Label>
                          <Input id="qualification" name="qualification" defaultValue={doctor.qualification} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="experience">Experience (Years)</Label>
                          <Input id="experience" name="experience" type="number" defaultValue={doctor.experience} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="appointmentFee">Appointment Fee ($)</Label>
                          <Input id="appointmentFee" name="appointmentFee" type="number" defaultValue={doctor.appointmentFee} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="currentWorkingPlace">Working Place</Label>
                          <Input id="currentWorkingPlace" name="currentWorkingPlace" defaultValue={doctor.currentWorkingPlace} />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving Changes..." : "Save Account Info"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* HEALTH TAB (PATIENTS ONLY) */}
            <TabsContent value="health">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-bold flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-primary" /> Vital Indicators
                  </CardTitle>
                  <CardDescription>
                    Provide height, weight, and general demographics to help doctors evaluate conditions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" defaultValue={health?.gender || ""}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        defaultValue={health?.dateOfBirth ? format(new Date(health.dateOfBirth), "yyyy-MM-dd") : ""}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select name="bloodGroup" defaultValue={health?.bloodGroup || ""}>
                        <SelectTrigger id="bloodGroup">
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A_POSITIVE">A+</SelectItem>
                          <SelectItem value="A_NEGATIVE">A-</SelectItem>
                          <SelectItem value="B_POSITIVE">B+</SelectItem>
                          <SelectItem value="B_NEGATIVE">B-</SelectItem>
                          <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                          <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                          <SelectItem value="O_POSITIVE">O+</SelectItem>
                          <SelectItem value="O_NEGATIVE">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" name="height" type="text" defaultValue={health?.height || ""} placeholder="e.g. 175" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" name="weight" type="text" defaultValue={health?.weight || ""} placeholder="e.g. 70" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Input id="maritalStatus" name="maritalStatus" defaultValue={health?.maritalStatus || ""} placeholder="e.g. Single / Married" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
                      <Input id="dietaryPreferences" name="dietaryPreferences" defaultValue={health?.dietaryPreferences || ""} placeholder="e.g. Vegetarian" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving Changes..." : "Save Vitals"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* CONDITIONS TAB (PATIENTS ONLY) */}
            <TabsContent value="conditions">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-bold flex items-center gap-2">
                    <Heart className="h-4.5 w-4.5 text-primary" /> Medical History & Conditions
                  </CardTitle>
                  <CardDescription>
                    Check diagnosed conditions or lifestyle markers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10">
                      <Checkbox id="hasDiabetes" defaultChecked={!!health?.hasDiabetes} onCheckedChange={(checked) => {
                        const input = document.getElementById("hasDiabetes_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} />
                      <input type="hidden" id="hasDiabetes_input" name="hasDiabetes" value={health?.hasDiabetes ? "true" : "false"} />
                      <Label htmlFor="hasDiabetes" className="cursor-pointer font-medium">Diabetes</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10">
                      <Checkbox id="hasAllergies" defaultChecked={!!health?.hasAllergies} onCheckedChange={(checked) => {
                        const input = document.getElementById("hasAllergies_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} />
                      <input type="hidden" id="hasAllergies_input" name="hasAllergies" value={health?.hasAllergies ? "true" : "false"} />
                      <Label htmlFor="hasAllergies" className="cursor-pointer font-medium">Active Allergies</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10">
                      <Checkbox id="smokingStatus" defaultChecked={!!health?.smokingStatus} onCheckedChange={(checked) => {
                        const input = document.getElementById("smokingStatus_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} />
                      <input type="hidden" id="smokingStatus_input" name="smokingStatus" value={health?.smokingStatus ? "true" : "false"} />
                      <Label htmlFor="smokingStatus" className="cursor-pointer font-medium">Smoking Status</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10">
                      <Checkbox id="hasPastSurgeries" defaultChecked={!!health?.hasPastSurgeries} onCheckedChange={(checked) => {
                        const input = document.getElementById("hasPastSurgeries_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} />
                      <input type="hidden" id="hasPastSurgeries_input" name="hasPastSurgeries" value={health?.hasPastSurgeries ? "true" : "false"} />
                      <Label htmlFor="hasPastSurgeries" className="cursor-pointer font-medium">Past Surgeries</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10">
                      <Checkbox id="recentAnxiety" defaultChecked={!!health?.recentAnxiety} onCheckedChange={(checked) => {
                        const input = document.getElementById("recentAnxiety_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} />
                      <input type="hidden" id="recentAnxiety_input" name="recentAnxiety" value={health?.recentAnxiety ? "true" : "false"} />
                      <Label htmlFor="recentAnxiety" className="cursor-pointer font-medium">Recent Anxiety</Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10">
                      <Checkbox id="recentDepression" defaultChecked={!!health?.recentDepression} onCheckedChange={(checked) => {
                        const input = document.getElementById("recentDepression_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} />
                      <input type="hidden" id="recentDepression_input" name="recentDepression" value={health?.recentDepression ? "true" : "false"} />
                      <Label htmlFor="recentDepression" className="cursor-pointer font-medium">Recent Depression</Label>
                    </div>

                    {health?.gender === "FEMALE" && (
                      <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/10 col-span-1 md:col-span-2">
                        <Checkbox id="pregnancyStatus" defaultChecked={!!health?.pregnancyStatus} onCheckedChange={(checked) => {
                          const input = document.getElementById("pregnancyStatus_input") as HTMLInputElement;
                          if (input) input.value = checked ? "true" : "false";
                        }} />
                        <input type="hidden" id="pregnancyStatus_input" name="pregnancyStatus" value={health?.pregnancyStatus ? "true" : "false"} />
                        <Label htmlFor="pregnancyStatus" className="cursor-pointer font-medium">Pregnancy Status</Label>
                      </div>
                    )}
                  </div>

                  {/* Text descriptions */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="mentalHealthHistory">Mental Health History Summary</Label>
                      <Input id="mentalHealthHistory" name="mentalHealthHistory" defaultValue={health?.mentalHealthHistory || ""} placeholder="e.g. Diagnosed with mild anxiety in 2021" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="immunizationStatus">Immunization Records</Label>
                      <Input id="immunizationStatus" name="immunizationStatus" defaultValue={health?.immunizationStatus || ""} placeholder="e.g. COVID-19 booster, Hep B" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving Changes..." : "Save Conditions"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* REPORTS TAB (PATIENTS ONLY) */}
            <TabsContent value="reports">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md font-bold flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-primary" /> Medical Reports
                  </CardTitle>
                  <CardDescription>
                    Manage clinical charts, blood tests, or diagnostic PDF documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Reports */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Existing Reports</Label>
                    {reports.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {reports.map((report: IMedicalReport) => {
                          const isMarkedDelete = deletedReportIds.includes(report.id);
                          return (
                            <div
                              key={report.id}
                              className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-150 ${
                                isMarkedDelete ? "opacity-50 border-destructive bg-destructive/5" : "hover:bg-muted/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden mr-2">
                                <FileText className={`h-4 w-4 shrink-0 ${isMarkedDelete ? "text-muted-foreground" : "text-red-500"}`} />
                                <span className={`text-xs font-medium truncate max-w-[150px] ${isMarkedDelete ? "line-through text-muted-foreground" : ""}`} title={report.reportName}>
                                  {report.reportName}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Button variant="outline" size="xs" className="h-7 text-xs" asChild disabled={isMarkedDelete}>
                                  <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7 w-7 text-muted-foreground hover:text-destructive ${isMarkedDelete ? "text-destructive" : ""}`}
                                  onClick={() => toggleDeleteReport(report.id)}
                                >
                                  {isMarkedDelete ? "Undo" : <Trash2 className="h-3.5 w-3.5" />}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No medical reports uploaded yet.</p>
                    )}
                  </div>

                  {/* Add New Reports */}
                  <div className="space-y-3 border-t pt-4">
                    <Label className="text-sm font-semibold">Upload New Reports</Label>
                    <div
                      onClick={() => reportsInputRef.current?.click()}
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors border-muted-foreground/20"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">Click to select PDF files</span>
                      <span className="text-xs text-muted-foreground mt-1">Upload up to 5 files at a time</span>
                      <input
                        ref={reportsInputRef}
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleReportsChange}
                        className="hidden"
                      />
                    </div>

                    {newReports.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Files to upload:</Label>
                        <div className="space-y-1.5">
                          {newReports.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border rounded bg-muted/20 text-xs">
                              <span className="truncate max-w-[250px] font-medium">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => removeNewReport(i)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving Changes..." : "Save & Upload Reports"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {serverError && (
          <div className="col-span-1 lg:col-span-3 mt-4">
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
};

export default MyProfileForm;
