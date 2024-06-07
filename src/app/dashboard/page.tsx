import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-2 pb-4">
        {user && (
          <>
            {isAdmin ? (
              <>
                <Dashboard />
              </>
            ) : (
              <>
                <Dashboard />
                {/* <p>Only admins can see this dashboard, please login.</p> */}
              </>
            )}
          </>
        )}
      </MaxWidthWrapper>
    </section>
  );
}
