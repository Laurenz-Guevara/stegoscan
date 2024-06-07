import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = getKindeServerSession();
  return (await isAuthenticated()) ? (
    <>{children}</>
  ) : (
    <MaxWidthWrapper>
      <div className="py-4">
        This page is protected, please{" "}
        <LoginLink className="text-green-600">Login</LoginLink> to view it.
      </div>
    </MaxWidthWrapper>
  );
}
