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
      <div className="flex items-start gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-[#0d9488] to-[#047857] rounded-full shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">My Reviews</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            View all patient reviews and ratings.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Average Rating</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            ⭐ {averageRating}
          </h2>
        </div>

        <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Reviews</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {totalReviews}
          </h2>
        </div>

        <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">5★ Reviews</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-500">
            {fiveStar}
          </h2>
        </div>

        <div className="rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm space-y-2">
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Rating Breakdown</p>
          <div className="space-y-1 text-sm text-slate-600 font-medium">
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