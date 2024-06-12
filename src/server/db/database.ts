"use server";

import { db } from "@/server/db";
import { restaurants, menu } from "./schema";
import { and, eq } from "drizzle-orm";

export const getRestaurants = async (userId: string) => {
  const selectResult = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.ownerId, userId));
  return selectResult;
};

export const addRestaurant = async (obj: any) => {
  const doesExist = await db
    .select()
    .from(restaurants)
    .where(
      and(
        eq(restaurants.restaurantName, obj.restaurantName),
        eq(restaurants.ownerId, obj.ownerId),
      ),
    );

  if (doesExist.length > 0) {
    return {
      status: false,
      title: "Error :(",
      description: "This restaurant already exists",
      variant: "destructive",
    };
  }

  try {
    await db.insert(restaurants).values(obj);
  } catch (error) {
    return {
      status: false,
      title: "Error :(",
      description: "There was an error adding the restaurant",
      variant: "destructive",
    };
  }
  return {
    status: true,
    title: "Success",
    description: "The restaurant has been added successfully",
    variant: "success",
  };
};

export const updateRestaurant = async () => {
  await db
    .update(restaurants)
    .set({ restaurantName: "The Owly" })
    .where(eq(restaurants.restaurantName, "Mr. Dan"));
};

export const deleteRestaurant = async (
  restaurantName: string,
  userId: string,
) => {
  try {
    const result = await db
      .delete(restaurants)
      .where(
        and(
          eq(restaurants.restaurantName, restaurantName),
          eq(restaurants.ownerId, userId),
        ),
      );

    if (result.rowCount === 0) {
      return {
        status: false,
        title: "Error :(",
        description: "This restaurant does not exist",
        variant: "destructive",
      };
    } else {
      return {
        status: true,
        title: "Success",
        description: "The restaurant has been deleted successfully",
        variant: "success",
      };
    }
  } catch (error) {
    return {
      status: false,
      title: "Error :(",
      description: "There was an error deleting the restaurant",
      variant: "destructive",
    };
  }
};

export const getRestaurantPages = async () => {
  const selectResult = await db.select().from(restaurants);
  return selectResult;
};

export const getRestaurantPage = async (cuid: string) => {
  const selectResult = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.restaurantSlug, cuid));
  return selectResult[0];
};

export const getRestaurantAndMenus = async (cuid: string) => {
  const selectResult = await db
    .select({
      restaurant: { id: restaurants.id },
      menus: { menuId: menu.id, menuName: menu.menuName },
    })
    .from(restaurants)
    .where(eq(restaurants.restaurantSlug, cuid))
    .innerJoin(menu, eq(restaurants.id, menu.restaurantId));

  const restaurantMap = new Map();

  selectResult.forEach(({ restaurant, menus }) => {
    if (!restaurantMap.has(restaurant.id)) {
      restaurantMap.set(restaurant.id, { restaurant, menus: [] });
    }
    restaurantMap.get(restaurant.id).menus.push(menus);
  });

  const groupedResult = Array.from(restaurantMap.values());

  console.log(groupedResult);
  return groupedResult;
};
