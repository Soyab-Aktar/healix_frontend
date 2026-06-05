import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/doctor.types";
import { cn } from "@/lib/utils";

interface IStatusBadgeCellProps {
  status: UserStatus;
}

const statusBadgeStyles: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]:
    "border-emerald-400 bg-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer",
  [UserStatus.BLOCKED]:
    "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100 cursor-pointer",
  [UserStatus.DELETED]:
    "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-100 cursor-pointer",
};

const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(statusBadgeStyles[status])}
    >
      <span className="text-sm capitalize ">{status.toLowerCase()}</span>
    </Badge>
  );
};

export default StatusBadgeCell;
