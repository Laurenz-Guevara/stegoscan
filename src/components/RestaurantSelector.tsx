"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

import { getRestaurants } from "@/server/db/database";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "./ui/button";

export default function RestaurantSelector() {
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();
  // const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  const [restaurants, setRestaurants] = useState<any>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>();
  const [restaurant, setRestaurant] = useState<any>();
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    getRestaurantsFromUser();
  }, [user]);

  const selectRestaurant = (value: any) => {
    setSelectedRestaurant(value.restaurantName);
    setRestaurant(value);
  };

  async function getRestaurantsFromUser() {
    if (user) {
      const restaurant = await getRestaurants(user.id);
      setRestaurants(restaurant);
    }
  }

  return (
    <MaxWidthWrapper>
      <div className="flex justify-between items-center py-4 w-full">
        {selectedRestaurant ? (
          <h1 className="text-2xl font-semibold">{selectedRestaurant}</h1>
        ) : (
          <h1 className="text-2xl font-semibold">Select a Restaurant</h1>
        )}
        <div className="flex items-center space-x-4">
          {restaurant && (
            <Button className="bg-green-600" asChild>
              <Link href={`/menu/${restaurant.restaurantSlug}`}>
                Visit Menu
              </Link>
            </Button>
          )}
          <Select onValueChange={selectRestaurant}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants ? (
                restaurants.map((restaurant: any) => (
                  <SelectItem key={restaurant.id} value={restaurant}>
                    {restaurant.restaurantName}
                  </SelectItem>
                ))
              ) : (
                <p className="text-sm px-2 py-1">Loading...</p>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
