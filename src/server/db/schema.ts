import { relations, sql } from "drizzle-orm";
import { RestaurantStatus } from "./enums";
import { createId } from "@paralleldrive/cuid2";

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
  restaurantSlug: varchar("restaurantSlug", { length: 256 }).$defaultFn(() =>
    createId(),
  ),
  restaurantPrettySlug: varchar("restaurantPrettySlug", {
    length: 256,
  }),
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

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  menus: many(menus),
}));

export const menus = createTable("menu", {
  id: serial("id").primaryKey(),
  menuName: varchar("menuName", { length: 256 }).notNull(),
  ownerId: varchar("ownerId", { length: 256 }).notNull(),
  restaurantId: integer("restaurantId").notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const menusRelations = relations(menus, ({ many, one }) => ({
  menuItems: many(menuItems),
  restaurantOwner: one(restaurants, {
    fields: [menus.restaurantId],
    references: [restaurants.id],
  }),
}));

export const menuItems = createTable("menuItems", {
  id: serial("id").primaryKey(),
  menuId: integer("menuId").notNull(),
  itemName: varchar("itemName", { length: 256 }).notNull(),
  itemPrice: varchar("itemPrice", { length: 256 }).notNull(),
  itemDescription: varchar("itemDescription", { length: 256 }),
  itemAllergens: varchar("itemAllergens", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  menu: one(menus, {
    fields: [menuItems.menuId],
    references: [menus.id],
  }),
}));
