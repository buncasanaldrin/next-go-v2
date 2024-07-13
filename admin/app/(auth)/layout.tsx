import Image from "next/image";
import { redirect } from "next/navigation";

import { fetchCurrentUser } from "@/actions/users";

type Props = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<Props> = async ({ children }) => {
  const user = await fetchCurrentUser();
  if (user.data) redirect("/");

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">{children}</div>
      <div className="hidden bg-muted lg:block">
        <Image
          priority
          src="/assets/images/placeholder.svg"
          alt="Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
