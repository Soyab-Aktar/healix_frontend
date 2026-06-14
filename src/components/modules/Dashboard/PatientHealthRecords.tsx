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
        <div className="flex items-center justify-between p-3 border rounded-lg bg-rose-50/50 border-rose-100 hover:bg-rose-50 transition-colors">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-medium gap-1 flex items-center">
            <ShieldAlert className="h-3 w-3" /> Yes / Diagnosed
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 font-normal gap-1 flex items-center">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> No Diagnosis
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-1">
      {/* Premium Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="h-7 w-7 text-primary animate-pulse" /> Health & Medical Records
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
              Monitor your physical statistics, chronic condition history, and download clinic-uploaded laboratory reports.
            </p>
          </div>
          <Button asChild className="shrink-0 font-medium self-start sm:self-center">
            <Link href="/my-profile" className="flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" /> Manage Profile
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border grid grid-cols-2 max-w-md">
          <TabsTrigger value="overview" className="font-semibold text-sm">
            <Activity className="mr-2 h-4 w-4" /> Health Overview
          </TabsTrigger>
          <TabsTrigger value="reports" className="font-semibold text-sm">
            <FileText className="mr-2 h-4 w-4" /> Medical Reports ({reports.length})
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 outline-none">
          {/* Quick Vitals Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border border-border/80 hover:border-primary/30 transition-all duration-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                  <Heart className="h-5 w-5 fill-red-500/20" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Blood Group</p>
                  <p className="text-xl font-bold">{health?.bloodGroup || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border/80 hover:border-primary/30 transition-all duration-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Ruler className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Height</p>
                  <p className="text-xl font-bold">{health?.height ? `${health.height}` : "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border/80 hover:border-primary/30 transition-all duration-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Weight</p>
                  <p className="text-xl font-bold">{health?.weight ? `${health.weight}` : "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border/80 hover:border-primary/30 transition-all duration-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Calculated BMI</p>
                  {bmi ? (
                    <div className="flex flex-col">
                      <span className="text-xl font-bold">{bmi.value}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold w-max ${bmi.category.color}`}>
                        {bmi.category.label}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-muted-foreground/50">N/A</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Condition List */}
            <Card className="md:col-span-2 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-md font-bold flex items-center gap-2 text-foreground">
                  <ShieldAlert className="h-4.5 w-4.5 text-primary" /> Chronic Conditions & Warnings
                </CardTitle>
                <CardDescription>
                  Review diagnosed health conditions registered in our clinical system.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <Card className="shadow-sm flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-md font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary" /> Lifestyle & Background
                  </CardTitle>
                  <CardDescription>
                    Demographics and lifestyle parameters.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Date of Birth</span>
                    <p className="text-sm font-medium text-foreground">
                      {health?.dateOfBirth ? (
                        format(new Date(health.dateOfBirth), "MMMM dd, yyyy")
                      ) : (
                        <span className="text-muted-foreground/60 italic">Not Specified</span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1 border-t pt-2">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Gender</span>
                    <p className="text-sm font-medium capitalize text-foreground">
                      {health?.gender?.toLowerCase() || <span className="text-muted-foreground/60 italic">Not Specified</span>}
                    </p>
                  </div>

                  <div className="space-y-1 border-t pt-2">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Marital Status</span>
                    <p className="text-sm font-medium capitalize text-foreground">
                      {health?.maritalStatus?.toLowerCase() || <span className="text-muted-foreground/60 italic">Not Specified</span>}
                    </p>
                  </div>

                  <div className="space-y-1 border-t pt-2">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Smoking Status</span>
                    <p className="text-sm font-medium text-foreground">
                      {health?.smokingStatus === true ? (
                        <span className="text-red-500 font-semibold">Smoker</span>
                      ) : health?.smokingStatus === false ? (
                        <span className="text-emerald-500 font-semibold">Non-Smoker</span>
                      ) : (
                        <span className="text-muted-foreground/60 italic">Not Specified</span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1 border-t pt-2">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Dietary Preference</span>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {health?.dietaryPreferences || <span className="text-muted-foreground/60 italic">Not Specified</span>}
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Summaries Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-md font-bold flex items-center gap-2">
                <FileCheck className="h-4.5 w-4.5 text-primary" /> Medical Narratives & Logs
              </CardTitle>
              <CardDescription>
                Summary notes written by medical supervisors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 border rounded-xl bg-muted/10">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> Mental Health History
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {health?.mentalHealthHistory || "No documented mental health history has been submitted."}
                </p>
              </div>

              <div className="space-y-2 p-4 border rounded-xl bg-muted/10">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" /> Immunization Status
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {health?.immunizationStatus || "No recorded immunization registry logs found."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-md font-bold flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-primary" /> Laboratory Reports & Records
                  </CardTitle>
                  <CardDescription>
                    Access, view, or download clinical charts and reports.
                  </CardDescription>
                </div>
                
                {/* Search Field */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Search reports by name..." 
                    className="pl-9 pr-4 h-9" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredReports.map((report) => (
                    <div 
                      key={report.id}
                      className="group flex flex-col justify-between p-4 border rounded-xl bg-background hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-105 transition-transform">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors" title={report.reportName}>
                              {report.reportName}
                            </h4>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
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
                      
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs font-semibold h-8 flex items-center gap-1"
                          asChild
                        >
                          <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                            View Report <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed rounded-xl bg-muted/5">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <h3 className="text-md font-bold text-foreground mb-1">No Medical Reports Found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    {searchQuery ? "No reports match your current search query." : "No documents have been uploaded to your profile yet."}
                  </p>
                  <Button asChild variant="outline" size="sm" className="font-semibold">
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
