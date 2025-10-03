import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLectures } from "@/hooks/useLectures";
import { LectureSortOption } from "@/types";

export function useLecturesPage() {
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<LectureSortOption>("recent");
  const [selectedLectures, setSelectedLectures] = useState<string[]>([]);

  const { lectures, isLoading, error } = useLectures(sortOption);

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

  return {
    lectures,
    isLoading,
    error,
    sortOption,
    selectedLectures,
    handleSortChange,
    handleSelectionChange,
    handleEnrollmentSuccess,
    handleClearSelection,
  };
}
