"use client";

import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useMemo } from "react";

import { PrescriptionRow, PrescriptionUpdatePayload } from "@/types/prescription.types";
import PrescriptionTable from "./PrescriptionTable";
import PrescriptionViewModal from "./PrescriptionViewModal";
import PrescriptionEditModal from "./PrescriptionEditModal";
import PrescriptionDeleteDialog from "./PrescriptionDeleteDialog";
import { buildPrescriptionColumns } from "./PrescriptionColumns";
interface DoctorPrescriptionsClientProps {
  prescriptions: PrescriptionRow[];
  onUpdate: (id: string, payload: PrescriptionUpdatePayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DoctorPrescriptionsClient = ({
  prescriptions,
  onUpdate,
  onDelete,
}: DoctorPrescriptionsClientProps) => {
  const {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<PrescriptionRow>();

  const columns = useMemo(
    () =>
      buildPrescriptionColumns(
        {
          onView: tableActions.onView!,
          onEdit: tableActions.onEdit,
          onDelete: tableActions.onDelete,
        },
        "doctor",
      ),
    [tableActions],
  );

  return (
    <>
      <PrescriptionTable
        data={prescriptions}
        columns={columns}
        searchCounterpart="patient"
      />

      <PrescriptionViewModal
        item={viewingItem}
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        perspective="doctor"
      />

      <PrescriptionEditModal
        item={editingItem}
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        onUpdate={onUpdate}
      />

      <PrescriptionDeleteDialog
        item={deletingItem}
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        onDelete={onDelete}
      />
    </>
  );
};

export default DoctorPrescriptionsClient;