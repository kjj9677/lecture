import { useInfiniteQuery } from "@tanstack/react-query";
import { lectureApi } from "@/data/mockApi";
import { LectureSortOption } from "@/types";

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 5;

export function useInfiniteLectures(sortOption?: LectureSortOption) {
  return useInfiniteQuery({
    queryKey: ["lectures", sortOption],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = pageParam === 0 ? INITIAL_PAGE_SIZE : PAGE_SIZE;
      const response = await lectureApi.getLectures({
        sort: sortOption,
        offset: pageParam,
        limit,
      });
      if (response.success && response.data) {
        return {
          lectures: response.data,
          nextOffset: pageParam + response.data.length,
        };
      }
      throw new Error(
        response.message || "강의 목록을 불러오는데 실패했습니다."
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.lectures.length,
        0
      );
      const expectedSize = lastPageParam === 0 ? INITIAL_PAGE_SIZE : PAGE_SIZE;

      if (lastPage.lectures.length < expectedSize) {
        return undefined;
      }

      return totalLoaded;
    },
  });
}
