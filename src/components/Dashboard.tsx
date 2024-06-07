"use client";

import {
  getExampleTable,
  updateRestaurant,
  addRestaurant,
  getRestaurants,
} from "@/server/db/database";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useState } from "react";
import NextImage from "next/image";
import { Image } from "@/components/Configurator";

export default function Configurator() {
  const [images, setImages] = useState<Image[]>([]);
  const [restaurants, setRestaurants] = useState<any>();
  const { isLoading, user } = useKindeBrowserClient();

  async function getData() {
    const data = await getExampleTable();
    setImages(data);
  }

  async function getRestaurantsFunc() {
    const restaurant = await getRestaurants();
    setRestaurants(restaurant);
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
    <div className="flex flex-1 flex-col h-full bg-zinc-100 rounded-xl mt-2 p-4">
      <p>Database Controls</p>
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
          onClick={() => getRestaurantsFunc()}
        >
          Get restaurants
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
        {restaurants &&
          restaurants.map((item: any) => (
            <div key={item.id}>
              {item.restaurantName}
              {item.restaurantOwner}
              {item.restaurantStatus}
            </div>
          ))}
      </div>
    </div>
  );
}
