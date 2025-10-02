"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout";
import { initializeMockData } from "@/data/initialData";
import { LoginHeader, LoginForm, LoginFooter } from "./components";

export default function Home() {
  const [isLogInLoading, setIsLogInLoading] = useState(false);

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <PageContainer isLoading={isLogInLoading}>
      <LoginHeader />
      <LoginForm onLoadingChange={setIsLogInLoading} />
      <LoginFooter />
    </PageContainer>
  );
}
