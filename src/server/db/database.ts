"use server";

import { db } from "@/server/db";
import { restaurants, menus } from "./schema";
import { ToastVariant } from "./enums";
import { and, eq } from "drizzle-orm";

export const getRestaurants = async (userId: string) => {
  const selectResult = await db.query.restaurants.findMany({
    where: (restaurants, { eq }) => eq(restaurants.ownerId, userId),
    columns: {
      id: true,
      restaurantName: true,
      restaurantPrettySlug: true,
      restaurantSlug: true,
      restaurantStatus: true,
    },
  });

  return selectResult;
};

// TODO: Sort types
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

export const deleteMenuFromRestaurant = async (
  menuId: number,
  userId: string,
) => {
  try {
    const result = await db
      .delete(menus)
      .where(and(eq(menus.id, menuId), eq(menus.ownerId, userId)));

    if (result.rowCount === 0) {
      return {
        status: false,
        title: "Error :(",
        description: "This menu does not exist",
        variant: ToastVariant.Destructive,
      };
    } else {
      return {
        status: true,
        title: "Success",
        description: "The menu has been deleted successfully",
        variant: ToastVariant.Success,
      };
    }
  } catch (error) {
    return {
      status: false,
      title: "Error :(",
      description: "There was an error deleting the menu",
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

export const getMenusFromRestaurant = async (restaurantId: number) => {
  const selectResult = await db.query.menus.findMany({
    where: (menus, { eq }) => eq(menus.restaurantId, restaurantId),
  });

  return selectResult;
};

export const addMenu = async (obj: {
  menuName: string;
  ownerId: string;
  restaurantId: number;
}) => {
  const doesExist = await db
    .select()
    .from(menus)
    .where(
      and(eq(menus.menuName, obj.menuName), eq(menus.ownerId, obj.ownerId)),
    );

  if (doesExist.length > 0) {
    return {
      status: false,
      title: "Error :(",
      description: "This menu already exists",
      variant: ToastVariant.Destructive,
    };
  }

  try {
    await db.insert(menus).values(obj);
  } catch (error) {
    return {
      status: false,
      title: "Error :(",
      description: "There was an error adding the menu",
      variant: ToastVariant.Destructive,
    };
  }
  return {
    status: true,
    title: "Success",
    description: "The menu has been added successfully",
    variant: ToastVariant.Success,
  };
};
