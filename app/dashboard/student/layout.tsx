// app/admin/(dashboard)/layout.tsx
import { ReactNode } from "react";

import StudentLayout from "@/components/StudentLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    
      <StudentLayout>
          {children}
      </StudentLayout>
        
      
      
   
  );
}