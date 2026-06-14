import PrescriptionsTable from "@/components/modules/Admin/PrescriptionsManagement/PrescriptionsTable"
import { getAllPrescriptions } from "@/services/prescription.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const PrescriptionsManagementPage = async ({
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
    queryKey: ["prescriptions", queryString],
    queryFn: () => getAllPrescriptions(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prescriptions Management</h1>
          <p className="text-muted-foreground">
            Monitor, inspect, and access prescription documents issued by doctors to patients.
          </p>
        </div>
        <PrescriptionsTable initialQueryString={queryString} />
      </div>
    </HydrationBoundary>
  )
}

export default PrescriptionsManagementPage