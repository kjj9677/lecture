import { useQuery } from "@tanstack/react-query";
import { lectureApi } from "@/data/mockApi";
import { useAuth } from "./useAuth";

export function useMyLectures() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["myLectures", user?.id],
    queryFn: async () => {
      const response = await lectureApi.getMyApplications();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(
        response.message || "신청한 강의 목록을 불러오는데 실패했습니다."
      );
    },
    enabled: !!user?.id,
  });

  return {
    lectures: data || [],
    isLoading,
    error: error?.message || null,
  };
}
