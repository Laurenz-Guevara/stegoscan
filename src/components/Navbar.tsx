import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { QrCode } from "lucide-react";

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex space-x-2 z-40 font-semibold">
            <QrCode />
            <span className="text-green-600">Stego</span>scan
          </Link>
          <div>
            <Link
              href={""}
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              How it works
            </Link>
            <Link
              href={""}
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              Features
            </Link>
            <Link
              href={""}
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              Pricing
            </Link>
            <Link
              href={""}
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              Contact
            </Link>
          </div>
          <div className="h-full flex items-center justify-between space-x-4">
            {user ? (
              <>
                <Link
                  href={"/dashboard"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Dashboard ✨
                </Link>
                {/* {isAdmin ? ( */}
                {/*   <div */}
                {/*     className={`${buttonVariants({ */}
                {/*       size: "sm", */}
                {/*       variant: "ghost", */}
                {/*     })} ${"cursor-default"}`} */}
                {/*   > */}
                {/*     Admin ✨ */}
                {/*   </div> */}
                {/* ) : null} */}
                <Link
                  href={"/api/auth/logout"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/register"
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "default",
                  })} ${"!bg-[#16A34A]"}`}
                >
                  Sign up
                </Link>

                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
