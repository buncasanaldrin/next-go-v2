"use client";

import Link from "next/link";
import { Home, Package } from "lucide-react";
import { usePathname } from "next/navigation";

const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const pages = [
    {
      name: "Dashboard",
      url: "/",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Products",
      url: "/products",
      icon: <Package className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex-1">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {pages.map((page) => (
          <Link
            key={page.name}
            href={page.url}
            className={`flex items-center gap-3 rounded-lg ${page.url === pathname ? "bg-muted text-primary" : "text-muted-foreground"} px-3 py-2 transition-all hover:text-primary`}
          >
            {page.icon}
            {page.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default LeftSidebar;
