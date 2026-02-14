import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ActiveCallProvider } from "@/components/providers/active-call-provider";

const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full">
      {/* En soldaki Sunucu Listesi (Navigation Sidebar) */}
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>

      {/* Ana İçerik Alanı */}
      <main className="md:pl-[72px] h-full">
        {children}
        
        {/* GLOBAL SESLİ SOHBET PENCERESİ */}
        {/* Sayfalar değişse bile bu bileşen burada sabit kalır */}
        <ActiveCallProvider /> 
      </main>
    </div>
   );
}
 
export default MainLayout;