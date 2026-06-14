import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getUserinfo } from "@/services/auth.services";
import MyProfileForm from "@/components/modules/Dashboard/MyProfileForm";

const MyProfilePage = async () => {
  const queryClient = new QueryClient();

  // Prefetch current logged in user details
  await queryClient.prefetchQuery({
    queryKey: ["me"],
    queryFn: getUserinfo,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyProfileForm />
    </HydrationBoundary>
  );
};

export default MyProfilePage;