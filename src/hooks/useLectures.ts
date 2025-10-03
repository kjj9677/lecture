import { useQuery } from "@tanstack/react-query";
import { lectureApi } from "@/data/mockApi";
import { LectureSortOption } from "@/types";

export function useLectures(sortOption?: LectureSortOption) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lectures", sortOption],
    queryFn: async () => {
      const response = await lectureApi.getLectures({ sort: sortOption });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || "강의 목록을 불러오는데 실패했습니다.");
    },
  });

  return {
    lectures: data || [],
    isLoading,
    error: error?.message || null,
  };
}
