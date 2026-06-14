import PatientsTable from "@/components/modules/Admin/PatientsManagement/PatientsTable"
import { getAllPatients } from "@/services/patient.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const PatientsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const queryParamsObjects = await searchParams

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key]

      if (value === undefined) {
        return ""
      }

      if (Array.isArray(value)) {
        return value
          .map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          .join("&")
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join("&")

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["patients", queryString],
    queryFn: () => getAllPatients(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patients Management</h1>
          <p className="text-muted-foreground">
            Manage system patients, inspect detailed electronic medical history, and moderate credentials.
          </p>
        </div>
        <PatientsTable initialQueryString={queryString} />
      </div>
    </HydrationBoundary>
  )
}

export default PatientsManagementPage