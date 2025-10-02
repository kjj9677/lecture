"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout";
import { initializeMockData } from "@/data/initialData";
import { LoginHeader, LoginForm, LoginFooter } from "./components";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <PageContainer isLoading={isLoading}>
      <LoginHeader />
      <LoginForm onLoadingChange={setIsLoading} />
      <LoginFooter />
    </PageContainer>
  );
}
