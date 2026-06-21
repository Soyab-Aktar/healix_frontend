import AdminsTable from "@/components/modules/Admin/AdminsManagement/AdminsTable"
import { getAllAdmins } from "@/services/admin.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const AdminsManagementPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: getAllAdmins,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Admins Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage administrators credentials, register new admin users, and soft-delete accounts.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
          <AdminsTable />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default AdminsManagementPage