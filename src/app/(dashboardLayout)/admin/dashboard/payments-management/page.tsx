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
        <div className="flex items-start gap-3">
          <div className="h-10 w-1 bg-gradient-to-b from-[#0d9488] to-[#047857] rounded-full shrink-0 mt-1" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">Payments Management</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Track and monitor patient billing logs, invoice details, and stripe transaction records.
            </p>
          </div>
        </div>
        <div className="rounded-[24px] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
          <PaymentsTable initialQueryString={queryString} />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default PaymentsManagementPage