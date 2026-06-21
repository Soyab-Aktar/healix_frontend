"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Heart, 
  FileText, 
  Calendar, 
  ShieldAlert, 
  ArrowUpRight, 
  Ruler,
  Scale,
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink,
  PlusCircle,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { format } from "date-fns";
import { IPatient } from "@/types/patient.types";

interface PatientHealthRecordsProps {
  patientData: IPatient | null | undefined;
}

const PatientHealthRecords = ({ patientData }: PatientHealthRecordsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const health = patientData?.patientHealthData;
  const reports = patientData?.medicalReports || [];

  // Parse height and weight to calculate BMI
  const calculateBMI = () => {
    if (!health?.height || !health?.weight) return null;
    
    // Parse weight (expecting kg, strip any letters)
    const weightKg = parseFloat(health.weight.replace(/[^0-9.]/g, ""));
    
    // Parse height (can be cm like "180", meters like "1.8", or inches)
    let heightM = parseFloat(health.height.replace(/[^0-9.]/g, ""));
    if (isNaN(weightKg) || isNaN(heightM)) return null;

    if (heightM > 10) {
      // height is probably in cm, convert to meters
      heightM = heightM / 100;
    }

    if (heightM <= 0) return null;
    const bmi = weightKg / (heightM * heightM);
    return {
      value: bmi.toFixed(1),
      category: getBMICategory(bmi)
    };
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-500 bg-amber-50" };
    if (bmi < 25) return { label: "Normal weight", color: "text-emerald-500 bg-emerald-50" };
    if (bmi < 30) return { label: "Overweight", color: "text-orange-500 bg-orange-50" };
    return { label: "Obese", color: "text-rose-500 bg-rose-50" };
  };

  const bmi = calculateBMI();

  // Filter reports by search query
  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper for boolean conditions
  const renderConditionBadge = (label: string, value: boolean | null | undefined) => {
    if (value === true) {
      return (
        <div className="flex items-center justify-between p-3.5 border border-rose-100 rounded-2xl bg-rose-50/40 hover:bg-rose-50/70 transition-all duration-200">
          <span className="text-sm font-semibold text-slate-800">{label}</span>
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full gap-1 flex items-center px-3 py-1 text-xs">
            <ShieldAlert className="h-3 w-3" /> Yes / Diagnosed
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-all duration-200">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="inline-flex items-center gap-1.5 text-xs bg-[#eefcf7] text-[#047857] px-3 py-1 rounded-full font-bold border border-emerald-100/30">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#047857]" /> No Diagnosis
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Premium Header with Gradient */}
      <div className="relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 sm:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#047857] animate-pulse" /> Health & Medical Records
            </h1>
            <p className="text-slate-500 max-w-xl text-sm sm:text-base font-medium">
              Monitor your physical statistics, chronic condition history, and download clinic-uploaded laboratory reports.
            </p>
          </div>
          <Button asChild className="shrink-0 font-bold self-start sm:self-center bg-[#047857] hover:bg-[#035f43] text-white rounded-lg px-5 py-2.5 shadow-sm transition-all duration-300">
            <Link href="/my-profile" className="flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4 text-white" /> Manage Profile
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl grid grid-cols-2 max-w-md">
          <TabsTrigger
            value="overview"
            className="font-bold text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#047857] data-[state=active]:shadow-xs rounded-lg py-2 transition-all"
          >
            <Activity className="mr-2 h-4 w-4" /> Health Overview
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="font-bold text-sm text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#047857] data-[state=active]:shadow-xs rounded-lg py-2 transition-all"
          >
            <FileText className="mr-2 h-4 w-4" /> Medical Reports ({reports.length})
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 outline-none">
          {/* Quick Vitals Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white rounded-[20px] border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-100/90 transition-all duration-300">
              <CardContent className="p-4.5 flex items-center gap-3">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-[14px]">
                  <Heart className="h-5 w-5 fill-red-500/20" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Blood Group</p>
                  <p className="text-xl font-bold text-slate-800">{health?.bloodGroup || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-[20px] border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-100/90 transition-all duration-300">
              <CardContent className="p-4.5 flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-[#047857] rounded-[14px]">
                  <Ruler className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Height</p>
                  <p className="text-xl font-bold text-slate-800">{health?.height ? `${health.height}` : "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-[20px] border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-100/90 transition-all duration-300">
              <CardContent className="p-4.5 flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-[14px]">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weight</p>
                  <p className="text-xl font-bold text-slate-800">{health?.weight ? `${health.weight}` : "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-[20px] border border-slate-200/60 shadow-xs hover:shadow-md hover:border-emerald-100/90 transition-all duration-300">
              <CardContent className="p-4.5 flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-[14px]">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calculated BMI</p>
                  {bmi ? (
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-800">{bmi.value}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold w-max ${bmi.category.color}`}>
                        {bmi.category.label}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-slate-400/50">N/A</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Condition List */}
            <Card className="md:col-span-2 bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <ShieldAlert className="h-5 w-5 text-[#047857]" /> Chronic Conditions & Warnings
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium">
                  Review diagnosed health conditions registered in our clinical system.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderConditionBadge("Diabetes Status", health?.hasDiabetes)}
                {renderConditionBadge("Hypertension (High BP)", health?.hasHypertension)}
                {renderConditionBadge("Asthma / Respiratory", health?.hasAsthma)}
                {renderConditionBadge("Cardiovascular Disease", health?.hasCardiovascularDisease)}
                {renderConditionBadge("Renal (Kidney) Disease", health?.hasRenalDisease)}
                {renderConditionBadge("Cancer History", health?.hasCancer)}
                {renderConditionBadge("Past Surgeries", health?.hasPastSurgeries)}
                {renderConditionBadge("Allergies", health?.hasAllergies)}
              </CardContent>
            </Card>

            {/* Basic Info & Lifestyle Card */}
            <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="h-5 w-5 text-[#047857]" /> Lifestyle & Background
                </CardTitle>
                <CardDescription className="text-slate-400 font-medium">
                  Demographics and lifestyle parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col gap-1 py-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Date of Birth</span>
                  <p className="text-sm font-bold text-slate-800">
                    {health?.dateOfBirth ? (
                      format(new Date(health.dateOfBirth), "MMMM dd, yyyy")
                    ) : (
                      <span className="text-slate-400/80 italic font-medium">Not Specified</span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 py-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gender</span>
                  <p className="text-sm font-bold capitalize text-slate-800">
                    {health?.gender?.toLowerCase() || <span className="text-slate-400/80 italic font-medium">Not Specified</span>}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 py-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Marital Status</span>
                  <p className="text-sm font-bold capitalize text-slate-800">
                    {health?.maritalStatus?.toLowerCase() || <span className="text-slate-400/80 italic font-medium">Not Specified</span>}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 py-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Smoking Status</span>
                  <p className="text-sm font-bold text-slate-800">
                    {health?.smokingStatus === true ? (
                      <span className="text-red-500 font-bold">Smoker</span>
                    ) : health?.smokingStatus === false ? (
                      <span className="text-[#047857] font-bold">Non-Smoker</span>
                    ) : (
                      <span className="text-slate-400/80 italic font-medium">Not Specified</span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 py-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dietary Preference</span>
                  <p className="text-sm font-bold text-slate-800 capitalize">
                    {health?.dietaryPreferences || <span className="text-slate-400/80 italic font-medium">Not Specified</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summaries Card */}
          <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <FileCheck className="h-5 w-5 text-[#047857]" /> Medical Narratives & Logs
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">
                Summary notes written by medical supervisors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5 p-4.5 border border-slate-100 rounded-[20px] bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-[#047857]" /> Mental Health History
                </span>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {health?.mentalHealthHistory || "No documented mental health history has been submitted."}
                </p>
              </div>

              <div className="space-y-2.5 p-4.5 border border-slate-100 rounded-[20px] bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#047857]" /> Immunization Status
                </span>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {health?.immunizationStatus || "No recorded immunization registry logs found."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6 outline-none">
          <Card className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-[#047857]" /> Laboratory Reports & Records
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-medium">
                    Access, view, or download clinical charts and reports.
                  </CardDescription>
                </div>
                
                {/* Search Field */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Search reports by name..." 
                    className="pl-9 pr-4 h-9 rounded-lg border-slate-200 focus-visible:border-[#047857] focus-visible:ring-emerald-500/20" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredReports.map((report) => (
                    <div 
                      key={report.id}
                      className="group flex flex-col justify-between p-5 border border-slate-200/60 rounded-[20px] bg-white hover:border-emerald-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-red-500/10 text-red-500 rounded-[14px] group-hover:scale-105 transition-transform duration-300">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-sm font-bold truncate text-slate-800 group-hover:text-emerald-700 transition-colors" title={report.reportName}>
                              {report.reportName}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {report.createdAt ? (
                                format(new Date(report.createdAt), "MMM dd, yyyy")
                              ) : (
                                "Date Unknown"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs font-bold h-9 flex items-center justify-center gap-1.5 border-emerald-600/30 text-[#047857] hover:bg-emerald-50 hover:text-emerald-700 rounded-lg shadow-2xs transition-all"
                          asChild
                        >
                          <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                            View Report <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-14 px-5 border border-dashed border-slate-200 rounded-[20px] bg-slate-50/50">
                  <FileText className="h-12 w-12 text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">No Medical Reports Found</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm mb-4">
                    {searchQuery ? "No reports match your current search query." : "No documents have been uploaded to your profile yet."}
                  </p>
                  <Button asChild variant="outline" size="sm" className="font-bold border-emerald-600/30 text-[#047857] hover:bg-emerald-50 rounded-lg shadow-2xs">
                    <Link href="/my-profile" className="flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" /> Go Upload Records
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientHealthRecords;
