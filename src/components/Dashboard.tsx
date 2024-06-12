"use client";

import { getRestaurants } from "@/server/db/database";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

// interface RestaurantProps {
//   id: string;
//   restaurantName: string;
//   ownerId: string;
//   restaurantSlug: string;
//   restaurantPrettySlug?: string;
// }

export default function Configurator() {
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
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between">
        {selectedRestaurant ? (
          <h1 className="text-2xl font-semibold">{selectedRestaurant}</h1>
        ) : (
          <h1 className="text-2xl font-semibold">Select a Restaurant</h1>
        )}
        <div className="flex items-center space-x-4">
          {restaurant && (
            <Button className="bg-green-600" asChild>
              <Link href={"menu/" + restaurant.restaurantSlug}>Visit Menu</Link>
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
      <div className="flex flex-1 flex-col gap-4 pt-2">
        <div className="h-8 w-1/4 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-96 w-full bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
