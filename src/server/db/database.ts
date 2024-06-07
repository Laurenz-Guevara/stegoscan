"use server";

import { db } from "@/server/db";
import { restaurants } from "./schema";
import { eq } from "drizzle-orm";

export const getExampleTable = async () => {
  const selectResult = await db.query.images.findMany();
  return selectResult;
};

export const getRestaurants = async () => {
  const selectResult = await db.query.restaurants.findMany();
  return selectResult;
};

export const addRestaurant = async (obj: any) => {
  await db.insert(restaurants).values(obj);
};

export const updateRestaurant = async () => {
  await db
    .update(restaurants)
    .set({ restaurantName: "The Owly" })
    .where(eq(restaurants.restaurantName, "Mr. Dan"));
};
