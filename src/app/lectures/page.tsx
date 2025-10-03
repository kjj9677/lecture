"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import CreateLectureModal from "./components/CreateLectureModal";

export default function LecturesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    lectures,
    isLoading,
    error,
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
  } = useLecturesPage();

  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

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
        onCreateLecture={() => setIsCreateModalOpen(true)}
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
          currentUserId={user?.id}
          observerRef={observerRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      <BatchEnrollmentBar
        selectedLectureIds={selectedLectures}
        lectures={lectures}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        onClearSelection={handleClearSelection}
      />

      <CreateLectureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateLectureSuccess}
      />
    </PageContainer>
  );
}
