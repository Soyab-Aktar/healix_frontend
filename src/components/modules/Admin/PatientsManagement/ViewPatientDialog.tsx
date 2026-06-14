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
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Health Profile
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="px-6 py-5 space-y-6">
            {/* Basic Info */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-xl bg-muted/30">
              <div className="space-y-1">
                <h2 className="text-lg font-bold">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">{patient.email}</p>
                <p className="text-xs text-muted-foreground font-mono">Patient ID: {patient.id}</p>
              </div>
              <div className="text-sm space-y-1 sm:text-right shrink-0">
                <div>
                  <span className="text-muted-foreground">Contact: </span>
                  <span className="font-medium">{patient.contactNumber || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined: </span>
                  <span>{formatDate(patient.createdAt)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {patient.user?.status?.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Health Metadata */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary border-b pb-1">
                <Activity className="h-4 w-4" /> Physical & Vital Stats
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <span className="text-xs text-muted-foreground block">Gender</span>
                  <span className="font-semibold capitalize">{health?.gender?.toLowerCase() || "N/A"}</span>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <span className="text-xs text-muted-foreground block">Blood Group</span>
                  <span className="font-semibold text-rose-600">{health?.bloodGroup || "N/A"}</span>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <span className="text-xs text-muted-foreground block">Height</span>
                  <span className="font-semibold">{health?.height ? `${health.height} cm` : "N/A"}</span>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <span className="text-xs text-muted-foreground block">Weight</span>
                  <span className="font-semibold">{health?.weight ? `${health.weight} kg` : "N/A"}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Date of Birth: <span className="font-medium text-foreground">{formatDate(health?.dateOfBirth)}</span>
              </div>
            </div>

            {/* Lifestyle & Medical Conditions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary border-b pb-1">
                <Heart className="h-4 w-4" /> Medical History & Lifestyle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {/* Lifestyle checks */}
                <div className="space-y-3 p-4 border rounded-xl bg-muted/10">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Lifestyle</h4>
                  <div className="flex justify-between items-center">
                    <span>Smoking</span>
                    {yesNoBadge(health?.smokingStatus)}
                  </div>
                  {health?.gender === "FEMALE" && (
                    <div className="flex justify-between items-center">
                      <span>Pregnancy</span>
                      {yesNoBadge(health?.pregnancyStatus)}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Allergies</span>
                    {yesNoBadge(health?.hasAllergies)}
                  </div>
                </div>

                {/* Chronic conditions */}
                <div className="space-y-3 p-4 border rounded-xl bg-muted/10 sm:col-span-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Clinical Indicators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                    <div className="flex justify-between items-center">
                      <span>Diabetes</span>
                      {yesNoBadge(health?.hasDiabetes)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Past Surgeries</span>
                      {yesNoBadge(health?.hasPastSurgeries)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Recent Anxiety</span>
                      {yesNoBadge(health?.recentAnxiety)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Recent Depression</span>
                      {yesNoBadge(health?.recentDepression)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Reports */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-primary border-b pb-1">
                <FileText className="h-4 w-4" /> Medical Reports & Documents
              </h3>
              {reports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <FileText className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="text-xs font-medium truncate max-w-[200px]" title={report.reportName}>
                          {report.reportName}
                        </span>
                      </div>
                      <Button variant="outline" size="xs" className="h-7 text-xs shrink-0" asChild>
                        <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No medical reports uploaded yet.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPatientDialog;
