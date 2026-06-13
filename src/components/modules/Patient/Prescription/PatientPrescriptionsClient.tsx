"use client";

import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { PrescriptionRow } from "@/types/prescription.types";
import { useMemo } from "react";
import { buildPrescriptionColumns } from "../../Doctor/Prescriptions/PrescriptionColumns";
import PrescriptionViewModal from "../../Doctor/Prescriptions/PrescriptionViewModal";
import PrescriptionTable from "../../Doctor/Prescriptions/PrescriptionTable";

interface PatientPrescriptionsClientProps {
  prescriptions: PrescriptionRow[];
}

/**
 * Patient view — read-only. No edit or delete actions.
 * Shows the doctor column instead of patient column.
 */
const PatientPrescriptionsClient = ({
  prescriptions,
}: PatientPrescriptionsClientProps) => {
  const {
    viewingItem,
    isViewDialogOpen,
    onViewOpenChange,
    tableActions,
  } = useRowActionModalState<PrescriptionRow>({
    enableEdit: false,
    enableDelete: false,
  });

  const columns = useMemo(
    () =>
      buildPrescriptionColumns(
        { onView: tableActions.onView! },
        "patient",
      ),
    [tableActions],
  );

  return (
    <>
      <PrescriptionTable
        data={prescriptions}
        columns={columns}
        searchCounterpart="doctor"
      />

      <PrescriptionViewModal
        item={viewingItem}
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        perspective="patient"
      />
    </>
  );
};

export default PatientPrescriptionsClient;