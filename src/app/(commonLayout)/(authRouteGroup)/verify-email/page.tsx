import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";
import { Suspense } from "react";

// VerifyEmailForm uses useSearchParams → must be wrapped in Suspense
const VerifyEmailPage = () => {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;