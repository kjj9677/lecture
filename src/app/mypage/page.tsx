"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { useMyLectures } from "@/hooks/useMyLectures";
import { useMyTeachingLectures } from "@/hooks/useMyTeachingLectures";
import { MyPageHeader, TabSelector, MyLectureList } from "./components";
import LoadingState from "../lectures/components/LoadingState";

type TabType = "created" | "enrolled";

export default function MyPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("created");

  const isInstructor = user?.userType === "instructor";

  const myLectures = useMyLectures();
  const myTeachingLectures = useMyTeachingLectures();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
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

  const currentLectures =
    isInstructor && activeTab === "created"
      ? myTeachingLectures
      : myLectures;

  return (
    <PageContainer>
      <MyPageHeader />

      {isInstructor && (
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <MyLectureList
        lectures={currentLectures.lectures}
        isLoading={currentLectures.isLoading}
        error={currentLectures.error}
      />
    </PageContainer>
  );
}
