import StudentSidebar
 from "@/components/StudentSidebar";
 import StudentHeader from "@/components/StudentHeader";

 export default function StudentDashboardLayout({
  children,
 }: {
  children: React.ReactNode
 }){
  return(
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </main>
      </div>
    </div>
  )
 }