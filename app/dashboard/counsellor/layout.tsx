import CounsellorHeader from "@/components/CounsellorHeader";
import CounsellorSidebar from "@/components/CounsellorSidebar";


export default function CounsellorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9f8]">
      <CounsellorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CounsellorHeader />
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </div>
    </div>
  );
}