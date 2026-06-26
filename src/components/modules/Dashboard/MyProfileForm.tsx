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
import { updatePatientProfile, uploadImage } from "@/services/profile.services";
import { updateDoctor } from "@/services/doctor.services";
import { updateAdmin, updateSuperAdmin } from "@/services/admin.services";
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
        let profilePhoto = doctor.profilePhoto || undefined;
        if (profilePhotoFile) {
          const uploadRes = await uploadImage(profilePhotoFile);
          if (uploadRes?.success && uploadRes?.data?.url) {
            profilePhoto = uploadRes.data.url;
          } else {
            throw new Error("Failed to upload profile photo");
          }
        }
        const payload = {
          doctor: {
            name: formVal.get("name") as string,
            profilePhoto,
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
      } else if (role === "SUPER_ADMIN" && admin) {
        // Super Admin update
        let profilePhoto = admin.profilePhoto || undefined;
        if (profilePhotoFile) {
          const uploadRes = await uploadImage(profilePhotoFile);
          if (uploadRes?.success && uploadRes?.data?.url) {
            profilePhoto = uploadRes.data.url;
          } else {
            throw new Error("Failed to upload profile photo");
          }
        }
        const payload = {
          name: formVal.get("name") as string,
          profilePhoto,
          contactNumber: formVal.get("contactNumber") as string,
        };
        await updateSuperAdmin(admin.id, payload);
      } else if (role === "ADMIN" && admin) {
        // Admin update
        let profilePhoto = admin.profilePhoto || undefined;
        if (profilePhotoFile) {
          const uploadRes = await uploadImage(profilePhotoFile);
          if (uploadRes?.success && uploadRes?.data?.url) {
            profilePhoto = uploadRes.data.url;
          } else {
            throw new Error("Failed to upload profile photo");
          }
        }
        const payload = {
          name: formVal.get("name") as string,
          profilePhoto,
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#047857] border-t-transparent" />
      </div>
    );
  }

  const userPhoto = profilePhotoPreview || currentPhoto || "/placeholder-avatar.png";

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">My Profile</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage your personal credentials, contact info, and medical records.
          </p>
        </div>
        <Badge variant="secondary" className="bg-emerald-50 text-[#047857] border-emerald-100 hover:bg-emerald-100/50 capitalize px-4 py-1.5 font-bold tracking-wide gap-1.5 border rounded-full">
          <UserCheck className="h-3.5 w-3.5 text-[#047857]" />
          {role?.toLowerCase().replace("_", " ")}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Overview & Profile Photo Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden p-2">
            <CardHeader className="text-center pb-2">
              <div className="relative mx-auto w-28 h-28 rounded-[24px] border border-slate-200/60 overflow-hidden flex items-center justify-center bg-slate-50/50 shadow-2xs group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userPhoto}
                  alt={currentName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-350 cursor-pointer"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <CardTitle className="mt-4 text-slate-800 font-extrabold text-lg truncate">{currentName}</CardTitle>
              <CardDescription className="text-slate-400 font-medium truncate text-sm mt-0.5">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 border-t border-slate-100 mt-4 text-sm font-medium">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-400">Account Status</span>
                <Badge variant="outline" className="bg-emerald-50 text-[#047857] border-emerald-100 font-bold rounded-full px-2.5 py-0.5 text-xs capitalize">
                  {user?.status?.toLowerCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50 text-slate-700">
                <span className="text-slate-400">Member Since</span>
                <span>{user?.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}</span>
              </div>
              {patient && (
                <div className="flex justify-between items-center py-2 text-slate-700">
                  <span className="text-slate-400">Allergy Alerts</span>
                  {health?.hasAllergies ? (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-100/50 hover:bg-rose-100/60 font-bold rounded-full text-xs">
                      Active
                    </Badge>
                  ) : (
                    <span>No</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Tab Forms */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-slate-100 p-1 border border-slate-200/50 rounded-xl grid grid-cols-4 mb-5">
              <TabsTrigger
                value="account"
                className="font-bold text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#047857] data-[state=active]:shadow-xs rounded-lg py-2 transition-all"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="health"
                disabled={role !== "PATIENT"}
                className="font-bold text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#047857] data-[state=active]:shadow-xs rounded-lg py-2 transition-all"
              >
                Health
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                disabled={role !== "PATIENT"}
                className="font-bold text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#047857] data-[state=active]:shadow-xs rounded-lg py-2 transition-all"
              >
                Conditions
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                disabled={role !== "PATIENT"}
                className="font-bold text-sm text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#047857] data-[state=active]:shadow-xs rounded-lg py-2 transition-all"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            {/* ACCOUNT TAB */}
            <TabsContent value="account">
              <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden p-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <User className="h-5 w-5 text-[#047857]" /> General Information
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    Update your primary account info. Users with non-patient roles must supply profile URLs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-slate-700 font-bold text-xs">Full Name</Label>
                      <Input id="name" name="name" defaultValue={currentName} required className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-slate-700 font-bold text-xs">Email Address (Read-only)</Label>
                      <Input id="email" defaultValue={user?.email} disabled className="bg-slate-50 text-slate-500 rounded-lg border-slate-100" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contactNumber" className="text-slate-700 font-bold text-xs">Contact Number</Label>
                      <Input id="contactNumber" name="contactNumber" defaultValue={currentContact} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                  </div>

                  {(role === "PATIENT" || role === "DOCTOR") && (
                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-slate-700 font-bold text-xs">Residential Address</Label>
                      <Input id="address" name="address" defaultValue={currentAddress} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                  )}

                  {role === "DOCTOR" && doctor && (
                    <div className="border-t border-slate-100 pt-5 mt-5 space-y-4">
                      <h4 className="font-bold text-sm text-[#047857] uppercase tracking-wide border-b border-slate-100 pb-2">Doctor Clinical Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="designation" className="text-slate-700 font-bold text-xs">Designation</Label>
                          <Input id="designation" name="designation" defaultValue={doctor.designation} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="qualification" className="text-slate-700 font-bold text-xs">Qualification</Label>
                          <Input id="qualification" name="qualification" defaultValue={doctor.qualification} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="experience" className="text-slate-700 font-bold text-xs">Experience (Years)</Label>
                          <Input id="experience" name="experience" type="number" defaultValue={doctor.experience} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="appointmentFee" className="text-slate-700 font-bold text-xs">Appointment Fee (₹)</Label>
                          <Input id="appointmentFee" name="appointmentFee" type="number" defaultValue={doctor.appointmentFee} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="currentWorkingPlace" className="text-slate-700 font-bold text-xs">Working Place</Label>
                          <Input id="currentWorkingPlace" name="currentWorkingPlace" defaultValue={doctor.currentWorkingPlace} className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-end border-t border-slate-100 pt-4 pb-2 pr-4">
                  <Button type="submit" disabled={isSubmitting} className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg px-6 py-2.5 shadow-sm transition-all duration-300">
                    {isSubmitting ? "Saving Changes..." : "Save Account Info"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* HEALTH TAB (PATIENTS ONLY) */}
            <TabsContent value="health">
              <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden p-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Activity className="h-5 w-5 text-[#047857]" /> Vital Indicators
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    Provide height, weight, and general demographics to help doctors evaluate conditions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="gender" className="text-slate-700 font-bold text-xs">Gender</Label>
                      <Select name="gender" defaultValue={health?.gender || ""}>
                        <SelectTrigger id="gender" className="rounded-lg border-slate-300 focus:ring-[#047857] focus:border-[#047857]">
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
                      <Label htmlFor="dateOfBirth" className="text-slate-700 font-bold text-xs">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        defaultValue={health?.dateOfBirth ? format(new Date(health.dateOfBirth), "yyyy-MM-dd") : ""}
                        className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bloodGroup" className="text-slate-700 font-bold text-xs">Blood Group</Label>
                      <Select name="bloodGroup" defaultValue={health?.bloodGroup || ""}>
                        <SelectTrigger id="bloodGroup" className="rounded-lg border-slate-300 focus:ring-[#047857] focus:border-[#047857]">
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
                      <Label htmlFor="height" className="text-slate-700 font-bold text-xs">Height (cm)</Label>
                      <Input id="height" name="height" type="text" defaultValue={health?.height || ""} placeholder="e.g. 175" className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="weight" className="text-slate-700 font-bold text-xs">Weight (kg)</Label>
                      <Input id="weight" name="weight" type="text" defaultValue={health?.weight || ""} placeholder="e.g. 70" className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="maritalStatus" className="text-slate-700 font-bold text-xs">Marital Status</Label>
                      <Input id="maritalStatus" name="maritalStatus" defaultValue={health?.maritalStatus || ""} placeholder="e.g. Single / Married" className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dietaryPreferences" className="text-slate-700 font-bold text-xs">Dietary Preferences</Label>
                      <Input id="dietaryPreferences" name="dietaryPreferences" defaultValue={health?.dietaryPreferences || ""} placeholder="e.g. Vegetarian" className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t border-slate-100 pt-4 pb-2 pr-4">
                  <Button type="submit" disabled={isSubmitting} className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg px-6 py-2.5 shadow-sm transition-all duration-300">
                    {isSubmitting ? "Saving Changes..." : "Save Vitals"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* CONDITIONS TAB (PATIENTS ONLY) */}
            <TabsContent value="conditions">
              <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden p-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Heart className="h-5 w-5 text-[#047857]" /> Medical History & Conditions
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    Check diagnosed conditions or lifestyle markers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors">
                      <Checkbox id="hasDiabetes" defaultChecked={!!health?.hasDiabetes} onCheckedChange={(checked) => {
                        const input = document.getElementById("hasDiabetes_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                      <input type="hidden" id="hasDiabetes_input" name="hasDiabetes" value={health?.hasDiabetes ? "true" : "false"} />
                      <Label htmlFor="hasDiabetes" className="cursor-pointer font-bold text-slate-700 text-sm">Diabetes</Label>
                    </div>

                    <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors">
                      <Checkbox id="hasAllergies" defaultChecked={!!health?.hasAllergies} onCheckedChange={(checked) => {
                        const input = document.getElementById("hasAllergies_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                      <input type="hidden" id="hasAllergies_input" name="hasAllergies" value={health?.hasAllergies ? "true" : "false"} />
                      <Label htmlFor="hasAllergies" className="cursor-pointer font-bold text-slate-700 text-sm">Active Allergies</Label>
                    </div>

                    <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors">
                      <Checkbox id="smokingStatus" defaultChecked={!!health?.smokingStatus} onCheckedChange={(checked) => {
                        const input = document.getElementById("smokingStatus_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                      <input type="hidden" id="smokingStatus_input" name="smokingStatus" value={health?.smokingStatus ? "true" : "false"} />
                      <Label htmlFor="smokingStatus" className="cursor-pointer font-bold text-slate-700 text-sm">Smoking Status</Label>
                    </div>

                    <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors">
                      <Checkbox id="hasPastSurgeries" defaultChecked={!!health?.hasPastSurgeries} onCheckedChange={(checked) => {
                        const input = document.getElementById("hasPastSurgeries_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                      <input type="hidden" id="hasPastSurgeries_input" name="hasPastSurgeries" value={health?.hasPastSurgeries ? "true" : "false"} />
                      <Label htmlFor="hasPastSurgeries" className="cursor-pointer font-bold text-slate-700 text-sm">Past Surgeries</Label>
                    </div>

                    <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors">
                      <Checkbox id="recentAnxiety" defaultChecked={!!health?.recentAnxiety} onCheckedChange={(checked) => {
                        const input = document.getElementById("recentAnxiety_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                      <input type="hidden" id="recentAnxiety_input" name="recentAnxiety" value={health?.recentAnxiety ? "true" : "false"} />
                      <Label htmlFor="recentAnxiety" className="cursor-pointer font-bold text-slate-700 text-sm">Recent Anxiety</Label>
                    </div>

                    <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors">
                      <Checkbox id="recentDepression" defaultChecked={!!health?.recentDepression} onCheckedChange={(checked) => {
                        const input = document.getElementById("recentDepression_input") as HTMLInputElement;
                        if (input) input.value = checked ? "true" : "false";
                      }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                      <input type="hidden" id="recentDepression_input" name="recentDepression" value={health?.recentDepression ? "true" : "false"} />
                      <Label htmlFor="recentDepression" className="cursor-pointer font-bold text-slate-700 text-sm">Recent Depression</Label>
                    </div>

                    {health?.gender === "FEMALE" && (
                      <div className="flex items-center space-x-3 border border-slate-200/60 p-4.5 rounded-[16px] bg-white hover:bg-slate-50/50 transition-colors col-span-1 md:col-span-2">
                        <Checkbox id="pregnancyStatus" defaultChecked={!!health?.pregnancyStatus} onCheckedChange={(checked) => {
                          const input = document.getElementById("pregnancyStatus_input") as HTMLInputElement;
                          if (input) input.value = checked ? "true" : "false";
                        }} className="border-slate-400 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" />
                        <input type="hidden" id="pregnancyStatus_input" name="pregnancyStatus" value={health?.pregnancyStatus ? "true" : "false"} />
                        <Label htmlFor="pregnancyStatus" className="cursor-pointer font-bold text-slate-700 text-sm">Pregnancy Status</Label>
                      </div>
                    )}
                  </div>

                  {/* Text descriptions */}
                  <div className="space-y-4 border-t border-slate-100 pt-5 mt-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="mentalHealthHistory" className="text-slate-700 font-bold text-xs">Mental Health History Summary</Label>
                      <Input id="mentalHealthHistory" name="mentalHealthHistory" defaultValue={health?.mentalHealthHistory || ""} placeholder="e.g. Diagnosed with mild anxiety in 2021" className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="immunizationStatus" className="text-slate-700 font-bold text-xs">Immunization Records</Label>
                      <Input id="immunizationStatus" name="immunizationStatus" defaultValue={health?.immunizationStatus || ""} placeholder="e.g. COVID-19 booster, Hep B" className="rounded-lg border-slate-300 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t border-slate-100 pt-4 pb-2 pr-4">
                  <Button type="submit" disabled={isSubmitting} className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg px-6 py-2.5 shadow-sm transition-all duration-300">
                    {isSubmitting ? "Saving Changes..." : "Save Conditions"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* REPORTS TAB (PATIENTS ONLY) */}
            <TabsContent value="reports">
              <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden p-2">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-[#047857]" /> Medical Reports
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    Manage clinical charts, blood tests, or diagnostic PDF documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Reports */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-bold text-sm">Existing Reports</Label>
                    {reports.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {reports.map((report: IMedicalReport) => {
                          const isMarkedDelete = deletedReportIds.includes(report.id);
                          return (
                            <div
                              key={report.id}
                              className={`flex items-center justify-between p-3.5 border rounded-[16px] transition-all duration-200 ${
                                isMarkedDelete ? "opacity-50 border-rose-300 bg-rose-50/30" : "border-slate-200/60 bg-white hover:border-emerald-100 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden mr-2">
                                <FileText className={`h-4.5 w-4.5 shrink-0 ${isMarkedDelete ? "text-slate-400" : "text-rose-500"}`} />
                                <span className={`text-xs font-bold truncate max-w-[150px] text-slate-800 ${isMarkedDelete ? "line-through text-slate-400" : ""}`} title={report.reportName}>
                                  {report.reportName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button variant="outline" size="xs" className="h-7.5 px-3 text-xs font-bold border-emerald-600/30 text-[#047857] hover:bg-emerald-50 hover:text-emerald-700 rounded-lg" asChild disabled={isMarkedDelete}>
                                  <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={`h-7.5 w-7.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full ${isMarkedDelete ? "text-rose-600 bg-rose-50" : ""}`}
                                  onClick={() => toggleDeleteReport(report.id)}
                                >
                                  {isMarkedDelete ? "Undo" : <Trash2 className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic font-medium">No medical reports uploaded yet.</p>
                    )}
                  </div>

                  {/* Add New Reports */}
                  <div className="space-y-3 border-t border-slate-100 pt-5 mt-5">
                    <Label className="text-slate-700 font-bold text-sm">Upload New Reports</Label>
                    <div
                      onClick={() => reportsInputRef.current?.click()}
                      className="border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/20 hover:border-[#047857] transition-all border-slate-200 bg-slate-50/50"
                    >
                      <Upload className="h-8 w-8 text-[#047857] mb-2" />
                      <span className="text-sm font-bold text-slate-700">Click to select PDF files</span>
                      <span className="text-xs text-slate-400 mt-1 font-medium">Upload up to 5 files at a time</span>
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
                        <Label className="text-xs text-slate-400 font-bold">Files to upload:</Label>
                        <div className="space-y-1.5">
                          {newReports.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-200/60 rounded-[14px] bg-slate-50/50 text-xs font-semibold">
                              <span className="truncate max-w-[250px] font-bold text-slate-750">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50"
                                onClick={() => removeNewReport(i)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t border-slate-100 pt-4 pb-2 pr-4">
                  <Button type="submit" disabled={isSubmitting} className="bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-lg px-6 py-2.5 shadow-sm transition-all duration-300">
                    {isSubmitting ? "Saving Changes..." : "Save & Upload Reports"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {serverError && (
          <div className="col-span-1 lg:col-span-3 mt-4">
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription className="font-bold text-xs">{serverError}</AlertDescription>
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
};

export default MyProfileForm;
