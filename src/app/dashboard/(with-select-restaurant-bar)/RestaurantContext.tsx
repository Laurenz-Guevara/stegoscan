"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Restaurant } from "@/server/db/types";

interface RestaurantContextProps {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant) => void;
}

const RestaurantContext = createContext<RestaurantContextProps | undefined>(
  undefined,
);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  return (
    <RestaurantContext.Provider
      value={{ selectedRestaurant, setSelectedRestaurant }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(
      "useRestaurantContext must be used within a RestaurantProvider",
    );
  }
  return context;
};
