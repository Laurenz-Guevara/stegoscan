import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import RestaurantSelector from "@/components/RestaurantSelector";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RestaurantProvider } from "@/app/dashboard/(with-select-restaurant-bar)/RestaurantContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = getKindeServerSession();
  return (await isAuthenticated()) ? (
    <RestaurantProvider>
      <RestaurantSelector />
      {children}
    </RestaurantProvider>
  ) : (
    <MaxWidthWrapper>
      <div className="py-4">
        This page is protected, please&nbsp;
        <LoginLink className="text-green-600">Login</LoginLink> to view it.
      </div>
    </MaxWidthWrapper>
  );
}
