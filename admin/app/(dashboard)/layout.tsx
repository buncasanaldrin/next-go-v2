import Link from "next/link";
import { Bell, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import LeftSidebarMobile from "@/components/shared/LeftSidebarMobile";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { getCurrentUser } from "@/utils/auth";

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = async ({ children }) => {
  const user = await getCurrentUser();

  return (
    <main>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span>King Ebeb</span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <LeftSidebar />
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <LeftSidebarMobile />
            <Navbar user={user?.user} />
          </header>

          <div className="pt-6 lg:px-6">
            <BreadCrumb />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
