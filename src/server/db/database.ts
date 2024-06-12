"use server";

import { db } from "@/server/db";
import { restaurants } from "./schema";
import { ToastVariant } from "./enums";
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
      variant: ToastVariant.Destructive,
    };
  }

  try {
    await db.insert(restaurants).values(obj);
  } catch (error) {
    return {
      status: false,
      title: "Error :(",
      description: "There was an error adding the restaurant",
      variant: ToastVariant.Destructive,
    };
  }
  return {
    status: true,
    title: "Success",
    description: "The restaurant has been added successfully",
    variant: ToastVariant.Success,
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
        variant: ToastVariant.Destructive,
      };
    } else {
      return {
        status: true,
        title: "Success",
        description: "The restaurant has been deleted successfully",
        variant: ToastVariant.Success,
      };
    }
  } catch (error) {
    return {
      status: false,
      title: "Error :(",
      description: "There was an error deleting the restaurant",
      variant: ToastVariant.Destructive,
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
  const selectResult = await db.query.restaurants.findFirst({
    where: (restaurants, { eq }) => eq(restaurants.restaurantSlug, cuid),
    with: {
      menus: {
        with: {
          menuItems: true,
        },
      },
    },
  });

  return selectResult;
};

export const getMenusWithUserId = async (userId: string) => {
  const selectResult = await db.query.restaurants.findMany({
    where: (restaurants, { eq }) => eq(restaurants.ownerId, userId),
    with: {
      menus: true,
    },
  });

  return selectResult;
};
