import { getMyReviews } from "@/services/review.services";
import PatientReviewsClient from "@/components/modules/Patient/Reviews/PatientReviewsClient";

import { IReview } from "@/types/review.types";

const MyReviewsPage = async () => {
  let reviews: IReview[] = [];
  try {
    const response = await getMyReviews();
    reviews = response?.data ?? [];
  } catch (error) {
    console.error("Error loading reviews for patient page:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-1 bg-gradient-to-b from-[#0d9488] to-[#047857] rounded-full shrink-0 mt-1" />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0d9488] to-[#047857] bg-clip-text text-transparent">
            My Reviews
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            View, edit, or delete feedback you have submitted for your clinical appointments.
          </p>
        </div>
      </div>

      <PatientReviewsClient initialReviews={reviews} />
    </div>
  );
};

export default MyReviewsPage;
