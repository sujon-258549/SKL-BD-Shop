import { Suspense, type ReactNode } from "react";
import LoadingPage from "@/components/common/loding/LoadingPage";

// Wrapper component for Suspense
export const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<LoadingPage />}>{children}</Suspense>
);

