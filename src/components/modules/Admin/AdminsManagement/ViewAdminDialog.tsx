import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IAdmin } from "@/types/admin.types";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ViewAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: IAdmin | null;
}

const ViewAdminDialog = ({
  open,
  onOpenChange,
  admin,
}: ViewAdminDialogProps) => {
  if (!admin) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP p");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Admin Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Header Card */}
          <div className="flex flex-col items-center justify-center p-4 border rounded-xl bg-muted/30 text-center gap-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
              {admin.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg">{admin.name}</h2>
              <Badge variant="outline" className="mt-1">
                {admin.user?.status || "ACTIVE"}
              </Badge>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground text-xs block">Email Address</span>
                <span className="font-medium">{admin.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground text-xs block">Contact Number</span>
                <span className="font-medium">{admin.contactNumber || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground text-xs block">Registered Date</span>
                <span>{formatDate(admin.createdAt)}</span>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground font-mono border-t pt-3 flex flex-col gap-0.5">
              <span>Admin ID: {admin.id}</span>
              <span>User ID: {admin.userId}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAdminDialog;
