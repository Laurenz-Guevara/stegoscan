"use client";

import {
  addRestaurant,
  getExampleTable,
  getRestaurants,
  updateRestaurant,
} from "@/server/db/database";

import { Image } from "@/components/Configurator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import NextImage from "next/image";
import { useEffect, useState } from "react";

export default function Configurator() {
  const { toast } = useToast();
  const [images, setImages] = useState<Image[]>([]);
  const [restaurants, setRestaurants] = useState<any>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>();
  const { isLoading, user } = useKindeBrowserClient();

  useEffect(() => {
    getRestaurantsFromUser();
  }, [user]);

  const selectRestaurant = (value: string) => {
    setSelectedRestaurant(value);
  };

  async function getData() {
    const data = await getExampleTable();
    setImages(data);
  }

  async function getRestaurantsFromUser() {
    if (user) {
      const restaurant = await getRestaurants(user.id);
      setRestaurants(restaurant);
    }
  }

  async function addRestaurantFunc() {
    if (!isLoading) {
      await addRestaurant({
        restaurantName: "The Smith and Iron 2",
        restaurantOwner: user?.given_name,
        ownerId: user?.id,
        restaurantStatus: "active",
        createdAt: new Date(),
      });
    }
  }

  async function updateRestaurantFunc() {
    await updateRestaurant();
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between">
        {selectedRestaurant ? (
          <h1 className="text-2xl font-semibold">{selectedRestaurant}</h1>
        ) : (
          <h1 className="text-2xl font-semibold">Select a Restaurant</h1>
        )}
        <Select onValueChange={selectRestaurant}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a restaurant" />
          </SelectTrigger>
          <SelectContent>
            {restaurants ? (
              restaurants.map((restaurant: any) => (
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
      <div>
        <button
          className="bg-green-400 rounded-md px-4 py-1"
          onClick={() => addRestaurantFunc()}
        >
          Add Restaurant
        </button>
        <button
          className="bg-green-400 rounded-md px-4 py-1"
          onClick={() => updateRestaurantFunc()}
        >
          Update Restaurant
        </button>
        <button
          className="bg-green-400 rounded-md px-4 py-1"
          onClick={() => getData()}
        >
          Query
        </button>
        {images &&
          images.map((item: Image) => (
            <div key={item.id}>
              {item.name}
              <div className="w-20 h-20 relative">
                <NextImage fill src={item.url} alt={item.name} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
