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
import { 
  User, Activity, Heart, FileText, CheckCircle, ShieldAlert, Upload, Trash2, Camera, UserCheck,
  Mail, Phone, MapPin, GraduationCap, Briefcase, IndianRupee, Calendar, Sparkles, Check, ArrowRight
} from "lucide-react";
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

  // Local state for editable fields
  const role = user?.role;
  const patient = user?.patient;
  const doctor = user?.doctor;
  const admin = user?.admin || user?.superAdmin;

  // Resolve current profile info
  const currentName = patient?.name || doctor?.name || admin?.name || user?.name || "";
  const currentContact = patient?.contactNumber || doctor?.contactNumber || admin?.contactNumber || "";
  const currentAddress = patient?.address || doctor?.address || "";
  const currentPhoto = patient?.profilePhoto || doctor?.profilePhoto || admin?.profilePhoto || user?.profilePhoto || "";

  // Patient Health data
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

  const renderAccountForm = () => (
    <Card className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 md:p-6 space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
          <User className="h-5 w-5 text-[#047857]" /> General Information
        </CardTitle>
        <CardDescription className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-1.5">
          View and update your primary account details and contact information.
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="name" 
              name="name" 
              defaultValue={currentName} 
              required 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Email Address (Read-only)</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="email" 
              defaultValue={user?.email} 
              disabled 
              className="pl-10 h-11 rounded-xl border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/40 text-slate-450 dark:text-slate-500 text-sm cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactNumber" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Contact Number</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="contactNumber" 
              name="contactNumber" 
              defaultValue={currentContact} 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>

        {(role === "PATIENT" || role === "DOCTOR") && (
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="address" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Residential Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                id="address" 
                name="address" 
                defaultValue={currentAddress} 
                className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
              />
            </div>
          </div>
        )}
      </div>

      {role === "DOCTOR" && doctor && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6 space-y-6">
          <div className="pb-2 border-b border-slate-50 dark:border-slate-850">
            <h4 className="font-bold text-sm text-[#047857] dark:text-emerald-450 uppercase tracking-wide">Doctor Clinical Details</h4>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-medium">Verify or adjust your medical qualifications and schedule pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="designation" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Designation</Label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="designation" 
                  name="designation" 
                  defaultValue={doctor.designation} 
                  className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qualification" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Qualification</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="qualification" 
                  name="qualification" 
                  defaultValue={doctor.qualification} 
                  className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="experience" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Experience (Years)</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="experience" 
                  name="experience" 
                  type="number" 
                  defaultValue={doctor.experience} 
                  className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="appointmentFee" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Appointment Fee (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="appointmentFee" 
                  name="appointmentFee" 
                  type="number" 
                  defaultValue={doctor.appointmentFee} 
                  className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="currentWorkingPlace" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Working Place</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="currentWorkingPlace" 
                  name="currentWorkingPlace" 
                  defaultValue={doctor.currentWorkingPlace} 
                  className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <CardFooter className="justify-end border-t border-slate-100 dark:border-slate-800 pt-4 px-0 pb-0">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-xl h-11 px-6 shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 animate-none"
        >
          <span>{isSubmitting ? "Saving Changes..." : "Save Account Info"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderHealthForm = () => (
    <Card className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 md:p-6 space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
          <Activity className="h-5 w-5 text-[#047857]" /> Vital Indicators
        </CardTitle>
        <CardDescription className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-1.5">
          Provide height, weight, and general demographics to help doctors evaluate clinical records.
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="gender" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Gender</Label>
          <Select name="gender" defaultValue={health?.gender || ""}>
            <SelectTrigger id="gender" className="h-11 rounded-xl border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-[#047857]/20 focus:border-[#047857] text-slate-800 dark:text-slate-100 text-sm">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805 rounded-xl shadow-lg">
              <SelectItem value="MALE" className="rounded-lg cursor-pointer">Male</SelectItem>
              <SelectItem value="FEMALE" className="rounded-lg cursor-pointer">Female</SelectItem>
              <SelectItem value="OTHER" className="rounded-lg cursor-pointer">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Date of Birth</Label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              defaultValue={health?.dateOfBirth ? format(new Date(health.dateOfBirth), "yyyy-MM-dd") : ""}
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bloodGroup" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Blood Group</Label>
          <Select name="bloodGroup" defaultValue={health?.bloodGroup || ""}>
            <SelectTrigger id="bloodGroup" className="h-11 rounded-xl border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-[#047857]/20 focus:border-[#047857] text-slate-800 dark:text-slate-100 text-sm">
              <SelectValue placeholder="Select Blood Group" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805 shadow-lg max-h-56">
              <SelectItem value="A_POSITIVE" className="rounded-lg cursor-pointer">A+</SelectItem>
              <SelectItem value="A_NEGATIVE" className="rounded-lg cursor-pointer">A-</SelectItem>
              <SelectItem value="B_POSITIVE" className="rounded-lg cursor-pointer">B+</SelectItem>
              <SelectItem value="B_NEGATIVE" className="rounded-lg cursor-pointer">B-</SelectItem>
              <SelectItem value="AB_POSITIVE" className="rounded-lg cursor-pointer">AB+</SelectItem>
              <SelectItem value="AB_NEGATIVE" className="rounded-lg cursor-pointer">AB-</SelectItem>
              <SelectItem value="O_POSITIVE" className="rounded-lg cursor-pointer">O+</SelectItem>
              <SelectItem value="O_NEGATIVE" className="rounded-lg cursor-pointer">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="height" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Height (cm)</Label>
          <div className="relative">
            <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="height" 
              name="height" 
              type="text" 
              defaultValue={health?.height || ""} 
              placeholder="e.g. 175" 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Weight (kg)</Label>
          <div className="relative">
            <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="weight" 
              name="weight" 
              type="text" 
              defaultValue={health?.weight || ""} 
              placeholder="e.g. 70" 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="maritalStatus" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Marital Status</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="maritalStatus" 
              name="maritalStatus" 
              defaultValue={health?.maritalStatus || ""} 
              placeholder="e.g. Single / Married" 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dietaryPreferences" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Dietary Preferences</Label>
          <div className="relative">
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="dietaryPreferences" 
              name="dietaryPreferences" 
              defaultValue={health?.dietaryPreferences || ""} 
              placeholder="e.g. Vegetarian / Vegan" 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>
      </div>

      <CardFooter className="justify-end border-t border-slate-100 dark:border-slate-800 pt-4 px-0 pb-0">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-xl h-11 px-6 shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 animate-none"
        >
          <span>{isSubmitting ? "Saving Changes..." : "Save Vitals"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderConditionsForm = () => (
    <Card className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 md:p-6 space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
          <Heart className="h-5 w-5 text-[#047857]" /> Medical History & Conditions
        </CardTitle>
        <CardDescription className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-1.5">
          Mark any diagnosed medical conditions or active lifestyle markers for doctor review.
        </CardDescription>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diabetes */}
        <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none">
          <div className="space-y-0.5">
            <Label htmlFor="hasDiabetes" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Diabetes</Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Diagnosed diabetic history</p>
          </div>
          <Checkbox 
            id="hasDiabetes" 
            defaultChecked={!!health?.hasDiabetes} 
            onCheckedChange={(checked) => {
              const input = document.getElementById("hasDiabetes_input") as HTMLInputElement;
              if (input) input.value = checked ? "true" : "false";
            }} 
            className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
          />
          <input type="hidden" id="hasDiabetes_input" name="hasDiabetes" value={health?.hasDiabetes ? "true" : "false"} />
        </div>

        {/* Active Allergies */}
        <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none">
          <div className="space-y-0.5">
            <Label htmlFor="hasAllergies" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Active Allergies</Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Allergic to specific drugs/foods</p>
          </div>
          <Checkbox 
            id="hasAllergies" 
            defaultChecked={!!health?.hasAllergies} 
            onCheckedChange={(checked) => {
              const input = document.getElementById("hasAllergies_input") as HTMLInputElement;
              if (input) input.value = checked ? "true" : "false";
            }} 
            className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
          />
          <input type="hidden" id="hasAllergies_input" name="hasAllergies" value={health?.hasAllergies ? "true" : "false"} />
        </div>

        {/* Smoking Status */}
        <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none">
          <div className="space-y-0.5">
            <Label htmlFor="smokingStatus" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Smoking Status</Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Active smoker or user of tobacco</p>
          </div>
          <Checkbox 
            id="smokingStatus" 
            defaultChecked={!!health?.smokingStatus} 
            onCheckedChange={(checked) => {
              const input = document.getElementById("smokingStatus_input") as HTMLInputElement;
              if (input) input.value = checked ? "true" : "false";
            }} 
            className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
          />
          <input type="hidden" id="smokingStatus_input" name="smokingStatus" value={health?.smokingStatus ? "true" : "false"} />
        </div>

        {/* Past Surgeries */}
        <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none">
          <div className="space-y-0.5">
            <Label htmlFor="hasPastSurgeries" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Past Surgeries</Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Previous surgical procedures</p>
          </div>
          <Checkbox 
            id="hasPastSurgeries" 
            defaultChecked={!!health?.hasPastSurgeries} 
            onCheckedChange={(checked) => {
              const input = document.getElementById("hasPastSurgeries_input") as HTMLInputElement;
              if (input) input.value = checked ? "true" : "false";
            }} 
            className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
          />
          <input type="hidden" id="hasPastSurgeries_input" name="hasPastSurgeries" value={health?.hasPastSurgeries ? "true" : "false"} />
        </div>

        {/* Recent Anxiety */}
        <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none">
          <div className="space-y-0.5">
            <Label htmlFor="recentAnxiety" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Recent Anxiety</Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Experienced anxiety in last 30 days</p>
          </div>
          <Checkbox 
            id="recentAnxiety" 
            defaultChecked={!!health?.recentAnxiety} 
            onCheckedChange={(checked) => {
              const input = document.getElementById("recentAnxiety_input") as HTMLInputElement;
              if (input) input.value = checked ? "true" : "false";
            }} 
            className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
          />
          <input type="hidden" id="recentAnxiety_input" name="recentAnxiety" value={health?.recentAnxiety ? "true" : "false"} />
        </div>

        {/* Recent Depression */}
        <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none">
          <div className="space-y-0.5">
            <Label htmlFor="recentDepression" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Recent Depression</Label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Experienced depressive state recently</p>
          </div>
          <Checkbox 
            id="recentDepression" 
            defaultChecked={!!health?.recentDepression} 
            onCheckedChange={(checked) => {
              const input = document.getElementById("recentDepression_input") as HTMLInputElement;
              if (input) input.value = checked ? "true" : "false";
            }} 
            className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
          />
          <input type="hidden" id="recentDepression_input" name="recentDepression" value={health?.recentDepression ? "true" : "false"} />
        </div>

        {health?.gender === "FEMALE" && (
          <div className="flex items-center justify-between p-4 border border-slate-200/60 dark:border-slate-850 rounded-[18px] bg-white dark:bg-slate-950/20 hover:border-emerald-100 dark:hover:border-emerald-950/65 hover:bg-slate-50/30 dark:hover:bg-slate-950/40 transition-all select-none col-span-1 md:col-span-2">
            <div className="space-y-0.5">
              <Label htmlFor="pregnancyStatus" className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer">Pregnancy Status</Label>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Currently pregnant or planning</p>
            </div>
            <Checkbox 
              id="pregnancyStatus" 
              defaultChecked={!!health?.pregnancyStatus} 
              onCheckedChange={(checked) => {
                const input = document.getElementById("pregnancyStatus_input") as HTMLInputElement;
                if (input) input.value = checked ? "true" : "false";
              }} 
              className="border-slate-350 dark:border-slate-700 data-[state=checked]:bg-[#047857] data-[state=checked]:border-[#047857] w-5 h-5 rounded-md" 
            />
            <input type="hidden" id="pregnancyStatus_input" name="pregnancyStatus" value={health?.pregnancyStatus ? "true" : "false"} />
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6">
        <div className="space-y-1.5">
          <Label htmlFor="mentalHealthHistory" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Mental Health History Summary</Label>
          <div className="relative">
            <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="mentalHealthHistory" 
              name="mentalHealthHistory" 
              defaultValue={health?.mentalHealthHistory || ""} 
              placeholder="e.g. Diagnosed with mild anxiety in 2021" 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="immunizationStatus" className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide">Immunization Records</Label>
          <div className="relative">
            <CheckCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              id="immunizationStatus" 
              name="immunizationStatus" 
              defaultValue={health?.immunizationStatus || ""} 
              placeholder="e.g. COVID-19 booster, Hepatitis B, Influenza" 
              className="pl-10 h-11 rounded-xl transition-all duration-200 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-3 focus-visible:ring-[#047857]/10 focus-visible:border-[#047857]/85 text-sm" 
            />
          </div>
        </div>
      </div>

      <CardFooter className="justify-end border-t border-slate-100 dark:border-slate-800 pt-4 px-0 pb-0">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-xl h-11 px-6 shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 animate-none"
        >
          <span>{isSubmitting ? "Saving Changes..." : "Save Conditions"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderReportsForm = () => (
    <Card className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/60 dark:border-slate-800 shadow-xs p-5 md:p-6 space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
          <FileText className="h-5 w-5 text-[#047857]" /> Medical Reports
        </CardTitle>
        <CardDescription className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-1.5">
          Manage clinical charts, lab results, blood tests, or diagnostic PDF documents.
        </CardDescription>
      </div>

      <div className="space-y-4">
        <Label className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wide">Existing Reports</Label>
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reports.map((report: IMedicalReport) => {
              const isMarkedDelete = deletedReportIds.includes(report.id);
              return (
                <div
                  key={report.id}
                  className={`flex items-center justify-between p-3.5 border rounded-2xl transition-all duration-200 ${
                    isMarkedDelete 
                      ? "opacity-50 border-rose-350 bg-rose-50/20 dark:bg-rose-950/10 dark:border-rose-900/40" 
                      : "border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950/15 hover:border-emerald-100 dark:hover:border-emerald-950 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden mr-2">
                    <FileText className={`h-4.5 w-4.5 shrink-0 ${isMarkedDelete ? "text-slate-400" : "text-emerald-600 dark:text-emerald-500"}`} />
                    <span className={`text-xs font-bold truncate max-w-[130px] md:max-w-[150px] text-slate-800 dark:text-slate-200 ${isMarkedDelete ? "line-through text-slate-450 dark:text-slate-500" : ""}`} title={report.reportName}>
                      {report.reportName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="xs" 
                      className="h-8 px-3 text-xs font-bold border-emerald-600/30 dark:border-emerald-900/40 text-[#047857] dark:text-emerald-450 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg cursor-pointer" 
                      asChild 
                      disabled={isMarkedDelete}
                    >
                      <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full cursor-pointer ${isMarkedDelete ? "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40" : ""}`}
                      onClick={() => toggleDeleteReport(report.id)}
                    >
                      {isMarkedDelete ? (
                        <span className="text-[10px] font-bold px-1.5">Undo</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic font-semibold">No medical reports uploaded yet.</p>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6">
        <Label className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wide">Upload New Reports</Label>
        <div
          onClick={() => reportsInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/20 dark:hover:bg-emerald-950/15 hover:border-[#047857] dark:hover:border-emerald-700/80 transition-all bg-slate-50/40 dark:bg-slate-950/10 text-center"
        >
          <Upload className="h-8 w-8 text-[#047857] dark:text-emerald-500 mb-2.5" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to select PDF reports</span>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Upload up to 5 files at a time</span>
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
          <div className="space-y-2.5">
            <Label className="text-xs text-slate-400 dark:text-slate-500 font-bold">Files selected for upload:</Label>
            <div className="space-y-2">
              {newReports.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-200/60 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold">
                  <span className="truncate max-w-[200px] sm:max-w-[280px] font-bold text-slate-700 dark:text-slate-300">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full cursor-pointer"
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

      <CardFooter className="justify-end border-t border-slate-100 dark:border-slate-800 pt-4 px-0 pb-0">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto bg-[#047857] hover:bg-[#035f43] text-white font-bold rounded-xl h-11 px-6 shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 animate-none"
        >
          <span>{isSubmitting ? "Saving Changes..." : "Save & Upload Reports"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Profile Hero Banner */}
      <div className="relative h-40 md:h-44 w-full rounded-[24px] bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-950/40 dark:to-emerald-950/20 overflow-hidden shadow-xs border border-teal-100/10">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-12 -mb-12 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Overlapping Glass Card */}
      <div className="relative -mt-16 mx-4 sm:mx-6 md:mx-8">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] border border-slate-200/60 dark:border-slate-800/80 shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Profile Photo Uploader */}
            <div className="relative w-28 h-28 rounded-[24px] border border-slate-200/60 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-xs group shrink-0">
              <img
                src={userPhoto}
                alt={currentName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
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

            {/* Info details */}
            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight truncate">{currentName}</h2>
                <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/20 text-[#047857] dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100/50 capitalize px-3 py-1 font-bold text-xs tracking-wide gap-1.5 border rounded-full shrink-0">
                  <UserCheck className="h-3.5 w-3.5" />
                  {role?.toLowerCase().replace("_", " ")}
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {currentContact && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{currentContact}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>Joined {user?.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Profile Form Card/Tabs Area */}
      <form onSubmit={handleSubmit} className="w-full">
        {role === "PATIENT" ? (
          <Tabs defaultValue="account" className="w-full mt-6">
            <TabsList className="bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200/50 dark:border-slate-800 rounded-xl grid grid-cols-4 mb-6">
              <TabsTrigger
                value="account"
                className="font-bold text-sm text-slate-500 dark:text-slate-400 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:text-[#047857] data-[state=active]:dark:text-emerald-450 data-[state=active]:shadow-xs rounded-lg py-2 transition-all cursor-pointer"
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="font-bold text-sm text-slate-500 dark:text-slate-400 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:text-[#047857] data-[state=active]:dark:text-emerald-450 data-[state=active]:shadow-xs rounded-lg py-2 transition-all cursor-pointer"
              >
                Health
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="font-bold text-sm text-slate-500 dark:text-slate-400 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:text-[#047857] data-[state=active]:dark:text-emerald-450 data-[state=active]:shadow-xs rounded-lg py-2 transition-all cursor-pointer"
              >
                Conditions
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="font-bold text-sm text-slate-500 dark:text-slate-400 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:text-[#047857] data-[state=active]:dark:text-emerald-450 data-[state=active]:shadow-xs rounded-lg py-2 transition-all cursor-pointer"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              {renderAccountForm()}
            </TabsContent>
            <TabsContent value="health">
              {renderHealthForm()}
            </TabsContent>
            <TabsContent value="conditions">
              {renderConditionsForm()}
            </TabsContent>
            <TabsContent value="reports">
              {renderReportsForm()}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-6">
            {renderAccountForm()}
          </div>
        )}

        {serverError && (
          <div className="mt-6">
            <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 text-destructive p-3">
              <AlertDescription className="font-bold text-xs leading-relaxed">{serverError}</AlertDescription>
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
};

export default MyProfileForm;
