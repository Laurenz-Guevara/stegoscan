"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { getRestaurants } from "@/server/db/database";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Restaurant } from "@/server/db/types";
import { useRestaurantContext } from "@/app/dashboard/(with-select-restaurant-bar)/RestaurantContext";

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>();
  const { user } = useKindeBrowserClient();
  const { selectedRestaurant, setSelectedRestaurant } = useRestaurantContext();

  useEffect(() => {
    getRestaurantsFromUser();
  }, [user]);

  const selectRestaurant = (value: string) => {
    const restaurant = restaurants?.find(
      (restaurant: Restaurant) => restaurant.restaurantName === value,
    );
    if (restaurant) {
      setSelectedRestaurant(restaurant);
    }
  };

  async function getRestaurantsFromUser() {
    if (user) {
      const restaurant = await getRestaurants(user.id);
      setRestaurants(restaurant as Restaurant[]);
    }
  }

  return (
    <MaxWidthWrapper>
      <div className="flex justify-between items-center py-4 w-full">
        {selectedRestaurant ? (
          <h1 className="text-2xl font-semibold">
            {selectedRestaurant.restaurantName}
          </h1>
        ) : (
          <h1 className="text-2xl font-semibold">Select a Restaurant</h1>
        )}
        <div className="flex items-center space-x-4">
          {selectedRestaurant && (
            <Button className="bg-green-600" asChild>
              <Link href={`/menu/${selectedRestaurant.restaurantSlug}`}>
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
                restaurants.map((restaurant: Restaurant) => (
                  <SelectItem
                    key={restaurant.id}
                    value={restaurant.restaurantName}
                  >
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
