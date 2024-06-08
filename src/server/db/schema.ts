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

export const restaurants = createTable("restaurants", {
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
});
