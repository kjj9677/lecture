"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout";
import { initializeMockData } from "@/data/initialData";
import { useAuth } from "@/hooks/useAuth";
import { useLecturesPage } from "./hooks/useLecturesPage";
import {
  LecturesHeader,
  LectureList,
  LoadingState,
  EmptyState,
  ErrorState,
  BatchEnrollmentBar,
} from "./components";

export default function LecturesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    lectures,
    isLoading,
    error,
    sortOption,
    selectedLectures,
    handleSortChange,
    handleSelectionChange,
    handleEnrollmentSuccess,
    handleClearSelection,
  } = useLecturesPage();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!authLoading && isAuthenticated) {
      initializeMockData();
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} />
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
        selectedLectureIds={selectedLectures}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        onClearSelection={handleClearSelection}
      />
    </PageContainer>
  );
}
