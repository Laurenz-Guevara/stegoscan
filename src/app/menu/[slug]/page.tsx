import { getRestaurantPage, getRestaurantPages } from "@/server/db/database";
import { notFound } from "next/navigation";
import MenuPage from "./page.menu";

interface PageParams {
  params: { slug: string };
}

export default async function Page({ params: { slug } }: PageParams) {
  const page = await getRestaurantPage(slug);

  if (page.length === 0) {
    return notFound();
  }

  return <MenuPage slug={slug} />;
}

export async function generateStaticParams() {
  const pages = await getRestaurantPages();

  return pages.map(({ restaurantSlug }) => restaurantSlug);
}
