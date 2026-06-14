import ReviewsTable from "@/components/modules/Admin/ReviewsManagement/ReviewsTable"
import { getAllReviews } from "@/services/review.services"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"

const ReviewsManagementPage = async ({
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
    queryKey: ["reviews", queryString],
    queryFn: () => getAllReviews(queryString),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews Management</h1>
          <p className="text-muted-foreground">
            Manage, filter, and inspect feedback shared by patients on clinical services and doctor sessions.
          </p>
        </div>
        <ReviewsTable initialQueryString={queryString} />
      </div>
    </HydrationBoundary>
  )
}

export default ReviewsManagementPage