"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/url";

interface Props {
  route: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchbar: React.FC<Props> = ({
  route,
  placeholder,
  otherClasses,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const params = searchParams.toString();
        const currentUrl = qs.parse(params);

        currentUrl["page"] = "1";

        const newUrl = formUrlQuery({
          params: qs.stringify(currentUrl),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, query, searchParams]);

  return (
    <div className={`px-4 ${otherClasses}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular"
      />
    </div>
  );
};

export default LocalSearchbar;
