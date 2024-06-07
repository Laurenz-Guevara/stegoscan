import { sql } from "drizzle-orm";
import { RestaurantStatus } from "./enums";

import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `stegoscan_${name}`);

import { db } from "@/server/db";

export const images = createTable(
  "image",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),

    userId: varchar("userId", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const restaurants = createTable(
  "restaurants",
  {
    id: serial("id").primaryKey(),
    restaurantName: varchar("restaurantName", { length: 256 }).notNull(),
    ownerId: varchar("ownerId", { length: 256 }).notNull(),
    restaurantOwner: varchar("restaurantOwner", { length: 256 }).notNull(),
    restaurantStatus: varchar("restaurantStatus", { length: 32 })
      .notNull()
      .default(RestaurantStatus.Active),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("restaurant_idx").on(example.restaurantName),
  }),
);
