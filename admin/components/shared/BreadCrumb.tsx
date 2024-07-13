"use client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const BreadCrumb: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const isRoot = pathSegments.length === 1;

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem className="capitalize">
          {isRoot ? (
            <BreadcrumbPage>{pathSegments[0]}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={`/${pathSegments[0]}`}>{pathSegments[0]}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {pathSegments?.[1] && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {pathSegments[1]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
