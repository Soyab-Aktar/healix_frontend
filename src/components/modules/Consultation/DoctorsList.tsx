"use client";

import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/doctor.services";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { IDoctor } from "@/types/doctor.types";
import DoctorCard from "./DoctorCard";

const LIMIT = 9;

export default function DoctorsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") ?? "1");
  const searchTerm = searchParams.get("searchTerm") ?? "";

  const [inputValue, setInputValue] = useState(searchTerm);

  const queryString = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    page: String(page),
    limit: String(LIMIT),
  }).toString();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctors", queryString],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  const doctors: IDoctor[] = (data?.data as IDoctor[]) ?? [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / LIMIT) : 1;

  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(window.location.search);
      updater(params);
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams((params) => {
      if (inputValue.trim()) {
        params.set("searchTerm", inputValue.trim());
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");
    });
  };

  const handlePageChange = (newPage: number) => {
    updateParams((params) => {
      params.set("page", String(newPage));
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
        <p className="text-gray-500">Browse our qualified specialists and book a consultation</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex gap-3">
        <div className="relative flex-1 max-w-lg">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name, specialty, or designation..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              updateParams((params) => {
                params.delete("searchTerm");
                params.set("page", "1");
              });
            }}
            className="px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Results info */}
      {!isLoading && meta && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {doctors.length} of {meta.total} doctors
          {searchTerm && (
            <span>
              {" "}for <span className="font-medium text-gray-800">&ldquo;{searchTerm}&rdquo;</span>
            </span>
          )}
        </p>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500 font-medium">Failed to load doctors. Please try again.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && doctors.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No doctors found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
        </div>
      )}

      {/* Doctor Cards Grid */}
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
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item as number)}
                  className={`w-9 h-9 text-sm rounded-lg border transition-colors ${page === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
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