"use client"

import { getDoctors } from "@/services/doctor.services";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DoctorsTable = () => {
  const { data: doctorDataResponse } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  })
  const { data: doctors } = doctorDataResponse! || [];
  const doctorColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "specialization", header: "Specialization" },
    { accessorKey: "experience", header: "Experience" },
    { accessorKey: "rating", header: "Rating" },
  ];

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: doctors,
    columns: doctorColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Table>
      <TableHeader>
        {getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DoctorsTable;