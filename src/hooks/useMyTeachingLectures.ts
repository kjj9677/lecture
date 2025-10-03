import { useQuery } from "@tanstack/react-query";
import { lectureApi } from "@/data/mockApi";

export function useMyTeachingLectures() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myTeachingLectures"],
    queryFn: async () => {
      const response = await lectureApi.getMyLectures();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(
        response.message || "개설한 강의 목록을 불러오는데 실패했습니다."
      );
    },
  });

  return {
    lectures: data || [],
    isLoading,
    error: error?.message || null,
  };
}
