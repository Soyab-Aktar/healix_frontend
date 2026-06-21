import SpecialtiesTable from "@/components/modules/Admin/SpecialtiesManagement/SpecialtiesTable"
import { getAllSpecialties } from "@/services/specialty.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const SpecialtiesManagementPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["specialties"],
    queryFn: getAllSpecialties,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Specialties Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage and organize medical specialties, define category names, and upload icon graphics.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
          <SpecialtiesTable />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default SpecialtiesManagementPage