import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInfiniteLectures } from "@/hooks/useInfiniteLectures";
import { LectureSortOption } from "@/types";

export function useLecturesPage() {
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<LectureSortOption>("recent");
  const [selectedLectures, setSelectedLectures] = useState<string[]>([]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLectures(sortOption);

  const lectures = data?.pages.flatMap((page) => page.lectures) || [];

  const handleSortChange = (newSortOption: LectureSortOption) => {
    setSortOption(newSortOption);
  };

  const handleSelectionChange = (lectureId: string, selected: boolean) => {
    setSelectedLectures((prev) => {
      if (selected) {
        return [...prev, lectureId];
      } else {
        return prev.filter((id) => id !== lectureId);
      }
    });
  };

  const handleEnrollmentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["lectures"] });
    queryClient.invalidateQueries({ queryKey: ["myLectures"] });
  };

  const handleClearSelection = () => {
    setSelectedLectures([]);
  };

  const handleCreateLectureSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["lectures"] });
    queryClient.invalidateQueries({ queryKey: ["myTeachingLectures"] });
  };

  return {
    lectures,
    isLoading,
    error: error?.message || null,
    sortOption,
    selectedLectures,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleSortChange,
    handleSelectionChange,
    handleEnrollmentSuccess,
    handleClearSelection,
    handleCreateLectureSuccess,
  };
}
