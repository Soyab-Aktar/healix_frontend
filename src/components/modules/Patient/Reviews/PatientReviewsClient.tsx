"use client";

import { useEffect, useState, useMemo } from "react";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import DataTable from "@/components/shared/table/DataTable";
import { getPatientReviewsColumns } from "./patientReviewsColumns";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewDialog from "./DeleteReviewDialog";
import { getMyReviews } from "@/services/review.services";
import { IReview } from "@/types/review.types";

interface PatientReviewsClientProps {
  initialReviews: IReview[];
}

export default function PatientReviewsClient({
  initialReviews,
}: PatientReviewsClientProps) {
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Modal states
  const [editReview, setEditReview] = useState<IReview | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteReviewItem, setDeleteReviewItem] = useState<IReview | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await getMyReviews();
      setReviews(res?.data ?? []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to refresh reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review: IReview) => {
    setEditReview(review);
    setIsEditOpen(true);
  };

  const handleDelete = (review: IReview) => {
    setDeleteReviewItem(review);
    setIsDeleteOpen(true);
  };

  // Client-side search filtering
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const doctorName = review.doctor?.name?.toLowerCase() ?? "";
      const comment = review.comment?.toLowerCase() ?? "";
      const search = searchTerm.toLowerCase().trim();
      return doctorName.includes(search) || comment.includes(search);
    });
  }, [reviews, searchTerm]);

  // Client-side sorting
  const sortedReviews = useMemo(() => {
    const sorted = [...filteredReviews];
    const sort = sorting[0];
    if (sort) {
      sorted.sort((a, b) => {
        const getValue = (item: IReview) => {
          if (sort.id === "rating") return item.rating;
          if (sort.id === "createdAt") return new Date(item.createdAt).getTime();
          return "";
        };

        const valA = getValue(a);
        const valB = getValue(b);

        if (valA < valB) return sort.desc ? 1 : -1;
        if (valA > valB) return sort.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredReviews, sorting]);

  // Client-side pagination calculations
  const totalRows = sortedReviews.length;
  const totalPages = Math.max(Math.ceil(totalRows / pagination.pageSize), 1);
  const pageIndex = Math.min(pagination.pageIndex, totalPages - 1);
  const paginatedReviews = useMemo(() => {
    const start = pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedReviews.slice(start, end);
  }, [sortedReviews, pageIndex, pagination.pageSize]);

  const columns = useMemo(
    () => getPatientReviewsColumns(handleEdit, handleDelete),
    []
  );

  return (
    <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
      <DataTable
        data={paginatedReviews}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="You haven't submitted any reviews yet."
        sorting={{
          state: sorting,
          onSortingChange: setSorting,
        }}
        pagination={{
          state: { ...pagination, pageIndex },
          onPaginationChange: setPagination,
        }}
        search={{
          initialValue: searchTerm,
          placeholder: "Search reviews by doctor or comments...",
          onDebouncedChange: setSearchTerm,
        }}
        meta={{
          page: pageIndex + 1,
          limit: pagination.pageSize,
          total: totalRows,
          totalPages,
        }}
      />

      <EditReviewModal
        review={editReview}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchReviews}
      />

      <DeleteReviewDialog
        review={deleteReviewItem}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchReviews}
      />
    </div>
  );
}
