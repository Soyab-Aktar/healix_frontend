import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IPatient } from "@/types/patient.types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Activity, FileText, Heart, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ViewPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPatient | null;
}

const ViewPatientDialog = ({
  open,
  onOpenChange,
  patient,
}: ViewPatientDialogProps) => {
  if (!patient) return null;

  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP");
  };

  const health = patient.patientHealthData;
  const reports = patient.medicalReports || [];

  const yesNoBadge = (val: boolean | null | undefined) => {
    if (val === true) {
      return (
        <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-700 gap-1">
          <ShieldAlert className="h-3 w-3" /> Yes
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 gap-1">
        <CheckCircle className="h-3 w-3" /> No
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden border-slate-200/80">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-slate-50/50">
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 text-slate-800">
            <User className="h-5.5 w-5.5 text-[#047857]" />
            <span className="bg-gradient-to-r from-teal-800 to-emerald-700 bg-clip-text text-transparent">Patient Health Profile</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="px-6 py-5 space-y-6">
            {/* Basic Info */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-5 border border-emerald-100/60 rounded-2xl bg-gradient-to-br from-emerald-50/10 to-teal-50/5 shadow-xs">
              <div className="space-y-1.5">
                <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
                <p className="text-sm text-slate-500 font-medium">{patient.email}</p>
                <p className="text-xs text-slate-400 font-mono">Patient ID: {patient.id}</p>
              </div>
              <div className="text-sm space-y-1.5 sm:text-right shrink-0">
                <div>
                  <span className="text-slate-450 font-semibold">Contact: </span>
                  <span className="font-semibold text-slate-700">{patient.contactNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-450 font-semibold">Joined: </span>
                  <span className="font-medium text-slate-650">{formatDate(patient.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <span className="text-slate-450 font-semibold">Status: </span>
                  <Badge variant="outline" className={cn(
                    "capitalize text-xs font-semibold px-2 py-0.5 rounded-full",
                    patient.user?.status === "ACTIVE" && "border-emerald-300 bg-emerald-50 text-emerald-700",
                    patient.user?.status === "BLOCKED" && "border-amber-300 bg-amber-50 text-amber-700",
                    patient.user?.status === "DELETED" && "border-rose-300 bg-rose-50 text-rose-700"
                  )}>
                    {patient.user?.status?.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Health Metadata */}
            <div className="space-y-3.5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-1.5">
                <Activity className="h-4.5 w-4.5 text-[#047857]" /> Physical & Vital Stats
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 border border-slate-200/60 rounded-xl text-center bg-slate-50/20 hover:border-emerald-100 transition-colors">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Gender</span>
                  <span className="font-bold text-slate-800 capitalize">{health?.gender?.toLowerCase() || "N/A"}</span>
                </div>
                <div className="p-3.5 border border-slate-200/60 rounded-xl text-center bg-slate-50/20 hover:border-emerald-100 transition-colors">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Blood Group</span>
                  <span className="font-bold text-rose-600">{health?.bloodGroup || "N/A"}</span>
                </div>
                <div className="p-3.5 border border-slate-200/60 rounded-xl text-center bg-slate-50/20 hover:border-emerald-100 transition-colors">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Height</span>
                  <span className="font-bold text-slate-800">{health?.height ? `${health.height} cm` : "N/A"}</span>
                </div>
                <div className="p-3.5 border border-slate-200/60 rounded-xl text-center bg-slate-50/20 hover:border-emerald-100 transition-colors">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Weight</span>
                  <span className="font-bold text-slate-800">{health?.weight ? `${health.weight} kg` : "N/A"}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Date of Birth: <span className="font-bold text-slate-700">{formatDate(health?.dateOfBirth)}</span>
              </div>
            </div>

            {/* Lifestyle & Medical Conditions */}
            <div className="space-y-3.5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-1.5">
                <Heart className="h-4.5 w-4.5 text-[#047857]" /> Medical History & Lifestyle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {/* Lifestyle checks */}
                <div className="space-y-3 p-4 border border-slate-200/60 rounded-xl bg-slate-50/10">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Lifestyle</h4>
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Smoking</span>
                    {yesNoBadge(health?.smokingStatus)}
                  </div>
                  {health?.gender === "FEMALE" && (
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">Pregnancy</span>
                      {yesNoBadge(health?.pregnancyStatus)}
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Allergies</span>
                    {yesNoBadge(health?.hasAllergies)}
                  </div>
                </div>

                {/* Chronic conditions */}
                <div className="space-y-3 p-4 border border-slate-200/60 rounded-xl bg-slate-50/10 sm:col-span-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Clinical Indicators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">Diabetes</span>
                      {yesNoBadge(health?.hasDiabetes)}
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">Past Surgeries</span>
                      {yesNoBadge(health?.hasPastSurgeries)}
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">Recent Anxiety</span>
                      {yesNoBadge(health?.recentAnxiety)}
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">Recent Depression</span>
                      {yesNoBadge(health?.recentDepression)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Reports */}
            <div className="space-y-3.5">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-1.5">
                <FileText className="h-4.5 w-4.5 text-[#047857]" /> Medical Reports & Documents
              </h3>
              {reports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border border-slate-200/60 rounded-xl hover:border-emerald-100 hover:bg-slate-50/30 transition-all">
                      <div className="flex items-center gap-2.5 overflow-hidden mr-2">
                        <FileText className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]" title={report.reportName}>
                          {report.reportName}
                        </span>
                      </div>
                      <Button variant="outline" size="xs" className="h-7 text-xs font-bold border-slate-200 text-slate-650 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 shrink-0 cursor-pointer" asChild>
                        <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic font-medium">No medical reports uploaded yet.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPatientDialog;
