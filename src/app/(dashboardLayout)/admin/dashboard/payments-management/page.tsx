import PaymentsTable from "@/components/modules/Admin/PaymentsManagement/PaymentsTable"
import { getAllPayments } from "@/services/payment.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const PaymentsManagementPage = async ({
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
    queryKey: ["payments", queryString],
    queryFn: () => getAllPayments(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments Management</h1>
          <p className="text-muted-foreground">
            Track and monitor patient billing logs, invoice details, and stripe transaction records.
          </p>
        </div>
        <PaymentsTable initialQueryString={queryString} />
      </div>
    </HydrationBoundary>
  )
}

export default PaymentsManagementPage