import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Configurator from "@/components/Configurator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/server/db";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  // const images = await db.query.images.findMany();

  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-2 pb-4">
        <h1 className="font-semibold">
          Stegoscan <span> - {user ? "👑" : "Not Logged In"}</span>
        </h1>
        {user && (
          <>
            {isAdmin ? (
              <>
                {/* <Configurator images={images} /> */}
                <Dashboard />
              </>
            ) : (
              <>
                <p>Only admins can see this dashboard, please login.</p>
              </>
            )}
          </>
        )}
      </MaxWidthWrapper>
    </section>
  );
}
