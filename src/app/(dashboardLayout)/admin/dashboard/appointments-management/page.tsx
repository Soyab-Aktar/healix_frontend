import AppointmentsTable from "@/components/modules/Admin/AppointmentsManagement/AppointmentsTable"
import { getAllAppointments } from "@/services/appointment.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const AppointmentsManagementPage = async ({
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
    queryKey: ["appointments", queryString],
    queryFn: () => getAllAppointments(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments Management</h1>
          <p className="text-muted-foreground">
            Manage patient appointments, view video room sessions, and update statuses.
          </p>
        </div>
        <AppointmentsTable initialQueryString={queryString} />
      </div>
    </HydrationBoundary>
  )
}

export default AppointmentsManagementPage