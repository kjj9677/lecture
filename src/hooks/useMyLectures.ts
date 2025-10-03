import { useQuery } from "@tanstack/react-query";
import { lectureApi } from "@/data/mockApi";

export function useMyLectures() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myLectures"],
    queryFn: async () => {
      const response = await lectureApi.getMyApplications();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(
        response.message || "신청한 강의 목록을 불러오는데 실패했습니다."
      );
    },
  });

  return {
    lectures: data || [],
    isLoading,
    error: error?.message || null,
  };
}
