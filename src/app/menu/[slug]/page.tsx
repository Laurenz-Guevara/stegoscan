import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getRestaurantPage } from "@/server/db/database";
import { notFound } from "next/navigation";

export default async function Page(params: any) {
  let restaurant = await getRestaurantPage(params.params.slug);

  if (!restaurant) {
    return notFound();
  }

  return (
    <MaxWidthWrapper>
      <h1>Menu for {restaurant.restaurantName}</h1>
    </MaxWidthWrapper>
  );
}
