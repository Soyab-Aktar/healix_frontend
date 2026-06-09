"use client"

import { getDoctors } from "@/services/doctor.services";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { IDoctor } from "@/types/doctor.types";
import DataTable from "@/components/shared/table/DataTable";
import { doctorColumns } from "./doctorsColumns";

const DoctorsTable = ({ queryString, queryParamsObjects }: { queryString: string, queryParamsObjects: { [key: string]: string | string[] | undefined } }) => {
  const { data: doctorDataResponse, isLoading } = useQuery({
    queryKey: ["doctors", queryParamsObjects],
    queryFn: () => getDoctors(queryString),
    refetchOnWindowFocus: "always",
  })
  const { data: doctors } = doctorDataResponse! || [];
  // const doctorColumns: ColumnDef<IDoctor>[] = [
  //   { accessorKey: "name", header: "Name" },
  //   { accessorKey: "specialization", header: "Specialization" },
  //   { accessorKey: "experience", header: "Experience" },
  //   { accessorKey: "rating", header: "Rating" },
  // ];

  const handleView = (doctor: IDoctor) => {
    console.log("View Doctor :", doctor);
  }
  const handleEdit = (doctor: IDoctor) => {
    console.log("Edit Doctor :", doctor);
  }
  const handleDelete = (doctor: IDoctor) => {
    console.log("Delete Doctor :", doctor);
  }

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: doctors,
    columns: doctorColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <DataTable
      data={doctors}
      columns={doctorColumns}
      isLoading={isLoading}
      emptyMessage="No Doctors Found"
      actions={
        {
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }
      }
    />
  );

  // return (
  //   <Table>
  //     <TableHeader>
  //       {getHeaderGroups().map((hg) => (
  //         <TableRow key={hg.id}>
  //           {hg.headers.map((header) => (
  //             <TableHead key={header.id}>
  //               {flexRender(
  //                 header.column.columnDef.header,
  //                 header.getContext(),
  //               )}
  //             </TableHead>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableHeader>
  //     <TableBody>
  //       {getRowModel().rows.map((row) => (
  //         <TableRow key={row.id}>
  //           {row.getVisibleCells().map((cell) => (
  //             <TableCell key={cell.id}>
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableBody>
  //   </Table>
  // );
};

export default DoctorsTable;