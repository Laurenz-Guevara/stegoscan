"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getRestaurantPage } from "@/server/db/database";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page(params: any) {
  const [restaurant, setRestaurant] = useState<any>();
  const [exists, setExists] = useState<boolean>(true);

  useEffect(() => {
    getRestaurantFromDatabase();
  }, []);

  async function getRestaurantFromDatabase() {
    const restaurant = await getRestaurantPage(params.params.slug);
    if (restaurant === undefined) {
      setExists(false);
    }
    setRestaurant(restaurant);
  }

  if (!exists) {
    return notFound();
  }

  if (!restaurant) {
    return (
      <MaxWidthWrapper>
        <h1>Loading...</h1>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <h1>Menu for {restaurant.restaurantName}</h1>
    </MaxWidthWrapper>
  );
}
