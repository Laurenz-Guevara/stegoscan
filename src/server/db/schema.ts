import { sql } from "drizzle-orm";
import { RestaurantStatus } from "./enums";

import {
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `stegoscan_${name}`);

export const restaurants = createTable("restaurants", {
  id: serial("id").primaryKey(),
  restaurantName: varchar("restaurantName", { length: 256 }).notNull(),
  ownerId: varchar("ownerId", { length: 256 }).notNull(),
  restaurantStatus: varchar("restaurantStatus", { length: 32 })
    .notNull()
    .default(RestaurantStatus.Active),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const menu = createTable("menu", {
  id: serial("id").primaryKey(),
  menuName: varchar("menuName", { length: 256 }).notNull(),
  restaurantId: integer("restaurantId")
    .references(() => restaurants.id)
    .notNull(),
  ownerId: varchar("ownerId", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const images = createTable("menuImage", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  ownerId: varchar("userId", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const menuItems = createTable("menuItems", {
  id: serial("id").primaryKey(),
  menuId: integer("menuId")
    .references(() => menu.id)
    .notNull(),
  itemName: varchar("itemName", { length: 256 }).notNull(),
  itemPrice: varchar("itemPrice", { length: 256 }).notNull(),
  itemDescription: varchar("itemDescription", { length: 256 }).notNull(),
  itemAllergens: varchar("itemAllergens", { length: 256 }).notNull(),
  itemImageId: integer("itemImageId").references(() => images.id),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
