"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useQuery } from "@tanstack/react-query";
import { getDoctors, getAllSpecialties } from "@/services/doctor.services";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { IDoctor } from "@/types/doctor.types";
import DoctorCard from "./DoctorCard";
import { ISpecialty } from "@/types/specialty.types";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT = 9;

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Fee: Low to High", value: "appointmentFee:asc" },
  { label: "Fee: High to Low", value: "appointmentFee:desc" },
  { label: "Experience: Most", value: "experience:desc" },
  { label: "Rating: Highest", value: "averageRating:desc" },
];

interface DoctorsListProps {
  initialQueryString?: string;
  isAuthenticated?: boolean;
  viewerRole?: string | null;
}

export default function DoctorsList({
  isAuthenticated,
}: DoctorsListProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isPatientRoute = pathname ? pathname.startsWith("/dashboard") : false;
  const isUserAuthenticated = isAuthenticated ?? isPatientRoute;

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
      if (!value || value === "none") {
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-8 md:p-12 mb-6 shadow-xs">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200/50 mb-4">
            🩺 Verified Medical Care
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Find a Specialist Doctor
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Browse our network of qualified, experienced doctors. Securely schedule and book your digital consultations all in one place.
          </p>
        </div>
      </div>

      {/* Search + Controls row */}
      <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            placeholder="Search by name, specialty, or designation..."
            className="w-full pl-10 pr-4 h-10 border-slate-200 rounded-xl bg-white shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 text-sm text-slate-800"
          />
        </div>

        <Button
          type="submit"
          className="bg-[#047857] hover:bg-[#035f43] text-white text-sm font-semibold h-10 px-5 rounded-xl transition-all cursor-pointer shadow-sm border-0 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>

        {/* Filter toggle */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "h-10 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer border",
            showFilters || activeFilterCount > 0
              ? "bg-emerald-50 hover:bg-emerald-50 border-emerald-200 text-emerald-700 hover:text-emerald-700 font-semibold"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs rounded-full bg-emerald-600 text-white font-bold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn("h-3.5 w-3.5 opacity-80 transition-transform duration-200", showFilters && "rotate-180")} />
        </Button>

        {/* Sort select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Sort by</span>
          <Select
            value={sortParam || "none"}
            onValueChange={handleSortChange}
            modal={false}
          >
            <SelectTrigger className="w-[180px] h-10 border-slate-200 rounded-xl bg-white shadow-xs text-slate-600 focus:ring-emerald-500/30 focus:border-emerald-600">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-lg p-1 z-50">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value || "none"} className="rounded-lg cursor-pointer px-3 py-2">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear all */}
        {hasAnyFilter && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClearAll}
            className="h-10 px-3 text-sm text-slate-500 hover:text-slate-900 rounded-xl cursor-pointer hover:bg-slate-50 flex items-center gap-1.5"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </Button>
        )}
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div
          ref={filterPanelRef}
          className="mb-6 p-5 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-inner shadow-slate-100/50 animate-in fade-in slide-in-from-top-2 duration-250"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Gender */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Gender
              </label>
              <Select
                value={gender || "all"}
                onValueChange={(val) => handleFilterChange("gender", val === "all" ? "" : val)}
                modal={false}
              >
                <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl bg-white shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 text-slate-600">
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-lg p-1 z-50">
                  <SelectItem value="all" className="rounded-lg cursor-pointer px-3 py-2">All genders</SelectItem>
                  <SelectItem value="MALE" className="rounded-lg cursor-pointer px-3 py-2">Male</SelectItem>
                  <SelectItem value="FEMALE" className="rounded-lg cursor-pointer px-3 py-2">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialty */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Specialty
              </label>
              <Select
                value={specialtyId || "all"}
                onValueChange={(val) => handleFilterChange("specialtyId", val === "all" ? "" : val)}
                modal={false}
              >
                <SelectTrigger className="w-full h-10 border-slate-200 rounded-xl bg-white shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 text-slate-600">
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-lg p-1 z-50">
                  <SelectItem value="all" className="rounded-lg cursor-pointer px-3 py-2">All specialties</SelectItem>
                  {specialties.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="rounded-lg cursor-pointer px-3 py-2">
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Fee Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={localMinFee}
                  onChange={(e) => setLocalMinFee(e.target.value)}
                  onBlur={handleRangeApply}
                  className="w-full h-10 border-slate-200 rounded-xl bg-white shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 text-sm text-slate-800"
                />
                <span className="text-slate-400 text-xs shrink-0">–</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={localMaxFee}
                  onChange={(e) => setLocalMaxFee(e.target.value)}
                  onBlur={handleRangeApply}
                  className="w-full h-10 border-slate-200 rounded-xl bg-white shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Min experience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Min. Experience (yrs)
              </label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={localMinExp}
                onChange={(e) => setLocalMinExp(e.target.value)}
                onBlur={handleRangeApply}
                className="w-full h-10 border-slate-200 rounded-xl bg-white shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">
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
        <p className="text-sm text-slate-500 mb-5">
          Showing{" "}
          <span className="font-semibold text-slate-800">{doctors.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{meta.total}</span> doctors
          {searchTerm && (
            <span>
              {" "}for{" "}
              <span className="font-semibold text-slate-800">&ldquo;{searchTerm}&rdquo;</span>
            </span>
          )}
        </p>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 animate-pulse shadow-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-2/3 mb-4" />
              <div className="h-9 bg-slate-50 rounded mt-auto" />
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
        <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-8">
          <Search className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-bounce duration-1000" />
          <p className="text-slate-400 text-base font-semibold">No doctors found matching your criteria</p>
          {hasAnyFilter && (
            <Button
              variant="link"
              onClick={handleClearAll}
              className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer font-semibold"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {!isLoading && !isError && doctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} isAuthenticated={isUserAuthenticated} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 h-9 flex items-center justify-center text-sm border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-slate-600 font-medium"
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
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item as number)}
                  className={`w-9 h-9 text-sm rounded-xl border font-semibold transition-colors ${page === item
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 h-9 flex items-center justify-center text-sm border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors text-slate-600 font-medium"
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
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-emerald-900 transition-colors cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}