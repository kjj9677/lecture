import { ReactNode } from "react";
import styles from "./PageContainer.module.css";

interface PageContainerProps {
  children: ReactNode;
  isLoading?: boolean;
}

export default function PageContainer({ children, isLoading = false }: PageContainerProps) {
  return (
    <div className={`${styles.container} ${isLoading ? styles.loadingState : ""}`}>
      {children}
    </div>
  );
}