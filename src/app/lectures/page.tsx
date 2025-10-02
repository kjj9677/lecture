"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout";
import { lectureApi } from "@/data/mockApi";
import { initializeMockData } from "@/data/initialData";
import { Lecture, LectureSortOption } from "@/types";
import {
  LecturesHeader,
  LectureList,
  LoadingState,
  EmptyState,
  BatchEnrollmentBar
} from "./components";

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<LectureSortOption>("recent");
  const [error, setError] = useState<string | null>(null);
  const [selectedLectures, setSelectedLectures] = useState<string[]>([]);

  const loadLectures = async (sort: LectureSortOption = sortOption) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await lectureApi.getLectures({ sort });

      if (response.success && response.data) {
        setLectures(response.data);
      } else {
        setError(response.message || "강의 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("강의 목록을 불러오는 중 오류가 발생했습니다.");
      console.error("Load lectures error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (newSortOption: LectureSortOption) => {
    setSortOption(newSortOption);
    loadLectures(newSortOption);
  };

  const handleSelectionChange = (lectureId: string, selected: boolean) => {
    setSelectedLectures(prev => {
      if (selected) {
        return [...prev, lectureId];
      } else {
        return prev.filter(id => id !== lectureId);
      }
    });
  };

  const handleEnrollmentSuccess = () => {
    loadLectures();
  };

  const handleClearSelection = () => {
    setSelectedLectures([]);
  };

  useEffect(() => {
    const initialize = async () => {
      await initializeMockData();
      await loadLectures();
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <PageContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          textAlign: 'center',
          color: '#dc2626',
          fontSize: '16px'
        }}>
          {error}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <LecturesHeader
        totalCount={lectures.length}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <LoadingState />
      ) : lectures.length === 0 ? (
        <EmptyState />
      ) : (
        <LectureList
          lectures={lectures}
          selectedLectures={selectedLectures}
          onSelectionChange={handleSelectionChange}
        />
      )}

      <BatchEnrollmentBar
        selectedCount={selectedLectures.length}
        selectedLectureIds={selectedLectures}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        onClearSelection={handleClearSelection}
      />
    </PageContainer>
  );
}