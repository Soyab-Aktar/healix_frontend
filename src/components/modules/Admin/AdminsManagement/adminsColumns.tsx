import DateCell from "@/components/shared/cell/DateCell";
import UserInfoCell from "@/components/shared/cell/UserInfoCell";
import { Badge } from "@/components/ui/badge";
import { IAdmin } from "@/types/admin.types";
import { ColumnDef } from "@tanstack/react-table";

export const adminColumns: ColumnDef<IAdmin>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Admin Name",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        profilePhoto={row.original.profilePhoto || undefined}
      />
    ),
  },
  {
    id: "contactNumber",
    accessorKey: "contactNumber",
    header: "Contact Number",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.contactNumber || "N/A"}</span>
    ),
  },
  {
    id: "status",
    accessorKey: "user.status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.user?.status || "ACTIVE";
      let classes = "";

      switch (status) {
        case "ACTIVE":
          classes = "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
          break;
        case "BLOCKED":
          classes = "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-50";
          break;
        case "DELETED":
          classes = "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-50";
          break;
      }

      return (
        <Badge variant="outline" className={classes}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Joined On",
    cell: ({ row }) => (
      <DateCell date={row.original.createdAt} formatString="MMM dd, yyyy" />
    ),
  },
];
