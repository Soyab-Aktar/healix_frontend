"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { getAllReviews } from "@/services/review.services";
import { PaginationMeta } from "@/types/api.types";
import { IReview } from "@/types/review.types";
import { reviewColumns } from "./reviewsColumns";
import ViewReviewDialog from "./ViewReviewDialog";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const REVIEWS_FILTER_DEFINITIONS = [
  serverManagedFilter.single("rating"),
];

const ReviewsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const {
    viewingItem,
    isViewDialogOpen,
    onViewOpenChange,
    tableActions,
  } = useRowActionModalState<IReview>();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: REVIEWS_FILTER_DEFINITIONS,
      updateParams,
    });

  const {
    data: reviewsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["reviews", queryString],
    queryFn: () => getAllReviews(queryString),
  });

  const reviews = reviewsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = reviewsResponse?.meta;

  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
    return [
      {
        id: "rating",
        label: "Stars Rating",
        type: "single-select",
        options: [
          { label: "5 Stars", value: "5" },
          { label: "4 Stars", value: "4" },
          { label: "3 Stars", value: "3" },
          { label: "2 Stars", value: "2" },
          { label: "1 Star", value: "1" },
        ],
      },
    ];
  }, []);

  const filterValuesForTable = useMemo<DataTableFilterValues>(() => {
    return {
      rating: filterValues.rating,
    };
  }, [filterValues]);

  const readOnlyActions = useMemo(() => {
    return {
      onView: tableActions.onView,
    };
  }, [tableActions.onView]);

  return (
    <>
      <DataTable
        data={reviews}
        columns={reviewColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No reviews or feedback found."
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search reviews by comment, doctor or patient name...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: filterValuesForTable,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        meta={meta}
        actions={readOnlyActions}
      />

      <ViewReviewDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        review={viewingItem}
      />
    </>
  );
};

export default ReviewsTable;
