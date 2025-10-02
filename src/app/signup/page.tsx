"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout";
import { initializeMockData } from "@/data/initialData";
import { SignupForm, SignupHeader, SignupFooter } from "./components";


export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeMockData();
  }, []);



  return (
    <PageContainer isLoading={isLoading}>
      <SignupHeader />
      <SignupForm onLoadingChange={setIsLoading} />
      <SignupFooter />
    </PageContainer>
  );
}
