import { ReactNode } from "react";
import CounsellorLayout from "@/components/CounsellorLayout";

export default function CounsellorDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <CounsellorLayout>
      {children}
    </CounsellorLayout>
  );
}
