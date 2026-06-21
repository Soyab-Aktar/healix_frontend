import DoctorReviewsTable from "@/components/modules/Doctor/Reviews/DoctorReviewsTable";
import { getUserinfo } from "@/services/auth.services";
import { getReviewsByDoctorId } from "@/services/review.services";
import { IReview } from "@/types/review.types";

const MyReviewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;
  const queryString = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") {
      queryString.append(key, value);
    }
  });

  const user = await getUserinfo();

  const { data: reviews } = await getReviewsByDoctorId(
    user.doctor?.id || "",
    queryString.toString()
  );

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
      ).toFixed(1)
      : "0.0";

  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const fourStar = reviews.filter((r) => r.rating === 4).length;
  const threeStar = reviews.filter((r) => r.rating === 3).length;
  const twoStar = reviews.filter((r) => r.rating === 2).length;
  const oneStar = reviews.filter((r) => r.rating === 1).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Reviews</h1>
        <p className="text-muted-foreground">
          View all patient reviews and ratings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Average Rating</p>

          <h2 className="mt-2 text-3xl font-bold">
            ⭐ {averageRating}
          </h2>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Reviews
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalReviews}
          </h2>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            5★ Reviews
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-500">
            {fiveStar}
          </h2>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-2">
          <p className="text-sm text-muted-foreground">
            Rating Breakdown
          </p>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>5★</span>
              <span>{fiveStar}</span>
            </div>

            <div className="flex justify-between">
              <span>4★</span>
              <span>{fourStar}</span>
            </div>

            <div className="flex justify-between">
              <span>3★</span>
              <span>{threeStar}</span>
            </div>

            <div className="flex justify-between">
              <span>2★</span>
              <span>{twoStar}</span>
            </div>

            <div className="flex justify-between">
              <span>1★</span>
              <span>{oneStar}</span>
            </div>
          </div>
        </div>
      </div>

      <DoctorReviewsTable reviews={reviews} />
    </div>
  );
};

export default MyReviewsPage;