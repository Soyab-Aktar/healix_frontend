
import DoctorSchedulesTable from "@/components/modules/Doctor/DoctorSchedules/DoctorSchedulesTable"
import { getMyDoctorSchedules } from "@/services/doctorSchedule.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const MySchedulesPage = async ({
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
    queryKey: ["my-doctor-schedules", queryString],
    queryFn: () => getMyDoctorSchedules(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <DoctorSchedulesTable initialQueryString={queryString} />
      </div>
    </HydrationBoundary>
  )
}

export default MySchedulesPage