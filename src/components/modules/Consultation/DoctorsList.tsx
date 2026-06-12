"use client";

import { useQuery } from "@tanstack/react-query";
import { getDoctors, getAllSpecialties } from "@/services/doctor.services";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { IDoctor } from "@/types/doctor.types";
import DoctorCard from "./DoctorCard";
import { ISpecialty } from "@/types/specialty.types";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";

const LIMIT = 9;

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Fee: Low to High", value: "appointmentFee:asc" },
  { label: "Fee: High to Low", value: "appointmentFee:desc" },
  { label: "Experience: Most", value: "experience:desc" },
  { label: "Rating: Highest", value: "averageRating:desc" },
];

export default function DoctorsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read all filter state from URL
  const page = Number(searchParams.get("page") ?? "1");
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const gender = searchParams.get("gender") ?? "";
  const specialtyId = searchParams.get("specialtyId") ?? "";
  const minFee = searchParams.get("appointmentFee[gte]") ?? "";
  const maxFee = searchParams.get("appointmentFee[lte]") ?? "";
  const minExp = searchParams.get("experience[gte]") ?? "";
  const sortParam = searchParams.get("sortBy")
    ? `${searchParams.get("sortBy")}:${searchParams.get("sortOrder") ?? "asc"}`
    : "";

  // Local input state (committed on form submit / blur)
  const [inputSearch, setInputSearch] = useState(searchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const [localMinFee, setLocalMinFee] = useState(minFee);
  const [localMaxFee, setLocalMaxFee] = useState(maxFee);
  const [localMinExp, setLocalMinExp] = useState(minExp);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Sync local inputs if URL changes externally
  useEffect(() => { setInputSearch(searchTerm); }, [searchTerm]);
  useEffect(() => { setLocalMinFee(minFee); }, [minFee]);
  useEffect(() => { setLocalMaxFee(maxFee); }, [maxFee]);
  useEffect(() => { setLocalMinExp(minExp); }, [minExp]);

  // Build query string from URL params
  const queryString = (() => {
    const p = new URLSearchParams();
    if (searchTerm) p.set("searchTerm", searchTerm);
    if (gender) p.set("gender", gender);
    if (specialtyId) p.set("specialtyId", specialtyId);
    if (minFee) p.set("appointmentFee[gte]", minFee);
    if (maxFee) p.set("appointmentFee[lte]", maxFee);
    if (minExp) p.set("experience[gte]", minExp);
    if (searchParams.get("sortBy")) {
      p.set("sortBy", searchParams.get("sortBy")!);
      p.set("sortOrder", searchParams.get("sortOrder") ?? "asc");
    }
    p.set("page", String(page));
    p.set("limit", String(LIMIT));
    return p.toString();
  })();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctors", queryString],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getAllSpecialties(),
    staleTime: 1000 * 60 * 60 * 6,
  });

  const doctors: IDoctor[] = (data?.data as IDoctor[]) ?? [];
  const specialties: ISpecialty[] = (specialtiesData?.data as ISpecialty[]) ?? [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / LIMIT) : 1;

  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(window.location.search);
      updater(params);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams((params) => {
      if (inputSearch.trim()) {
        params.set("searchTerm", inputSearch.trim());
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
    });
  };

  const handleRangeApply = () => {
    updateParams((params) => {
      if (localMinFee) params.set("appointmentFee[gte]", localMinFee); else params.delete("appointmentFee[gte]");
      if (localMaxFee) params.set("appointmentFee[lte]", localMaxFee); else params.delete("appointmentFee[lte]");
      if (localMinExp) params.set("experience[gte]", localMinExp); else params.delete("experience[gte]");
      params.set("page", "1");
    });
  };

  const handleSortChange = (value: string) => {
    updateParams((params) => {
      if (!value) {
        params.delete("sortBy");
        params.delete("sortOrder");
      } else {
        const [field, order] = value.split(":");
        params.set("sortBy", field);
        params.set("sortOrder", order);
      }
      params.set("page", "1");
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams((params) => { params.set("page", String(newPage)); });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setInputSearch("");
    setLocalMinFee("");
    setLocalMaxFee("");
    setLocalMinExp("");
    router.push("?");
  };

  // Count active filters (excluding search + page)
  const activeFilterCount = [gender, specialtyId, minFee, maxFee, minExp].filter(Boolean).length;
  const hasAnyFilter = !!(searchTerm || activeFilterCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Find a Doctor</h1>
        <p className="text-gray-500 text-sm">Browse our qualified specialists and book a consultation</p>
      </div>

      {/* Search + Controls row */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Search by name, specialty, or designation..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${showFilters || activeFilterCount > 0
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-blue-600 text-white font-semibold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Sort */}
        <select
          value={sortParam}
          onChange={(e) => handleSortChange(e.target.value)}
          className="py-2.5 px-3 text-sm border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear all */}
        {hasAnyFilter && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div
          ref={filterPanelRef}
          className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Specialty
              </label>
              <select
                value={specialtyId}
                onChange={(e) => handleFilterChange("specialtyId", e.target.value)}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All specialties</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee range */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Fee Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={localMinFee}
                  onChange={(e) => setLocalMinFee(e.target.value)}
                  onBlur={handleRangeApply}
                  className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400 text-xs shrink-0">–</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={localMaxFee}
                  onChange={(e) => setLocalMaxFee(e.target.value)}
                  onBlur={handleRangeApply}
                  className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Min experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Min. Experience (yrs)
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={localMinExp}
                onChange={(e) => setLocalMinExp(e.target.value)}
                onBlur={handleRangeApply}
                className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
              {gender && (
                <FilterChip
                  label={`Gender: ${gender === "MALE" ? "Male" : "Female"}`}
                  onRemove={() => handleFilterChange("gender", "")}
                />
              )}
              {specialtyId && (
                <FilterChip
                  label={`Specialty: ${specialties.find((s) => s.id === specialtyId)?.title ?? specialtyId}`}
                  onRemove={() => handleFilterChange("specialtyId", "")}
                />
              )}
              {(minFee || maxFee) && (
                <FilterChip
                  label={`Fee: ${minFee ? `₹${minFee}` : "any"} – ${maxFee ? `₹${maxFee}` : "any"}`}
                  onRemove={() => {
                    setLocalMinFee("");
                    setLocalMaxFee("");
                    updateParams((p) => {
                      p.delete("appointmentFee[gte]");
                      p.delete("appointmentFee[lte]");
                      p.set("page", "1");
                    });
                  }}
                />
              )}
              {minExp && (
                <FilterChip
                  label={`Min exp: ${minExp} yr${Number(minExp) !== 1 ? "s" : ""}`}
                  onRemove={() => {
                    setLocalMinExp("");
                    updateParams((p) => {
                      p.delete("experience[gte]");
                      p.set("page", "1");
                    });
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Results info */}
      {!isLoading && meta && (
        <p className="text-sm text-gray-500 mb-5">
          Showing{" "}
          <span className="font-medium text-gray-800">{doctors.length}</span> of{" "}
          <span className="font-medium text-gray-800">{meta.total}</span> doctors
          {searchTerm && (
            <span>
              {" "}for{" "}
              <span className="font-medium text-gray-800">&ldquo;{searchTerm}&rdquo;</span>
            </span>
          )}
        </p>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-8 bg-gray-100 rounded mt-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500 font-medium">Failed to load doctors. Please try again.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && doctors.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-base font-medium">No doctors found</p>
          {hasAnyFilter && (
            <button
              onClick={handleClearAll}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Doctor grid */}
      {!isLoading && !isError && doctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item as number)}
                  className={`w-9 h-9 text-sm rounded-lg border transition-colors ${page === item
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-blue-900 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}