"use server";

import { db } from "@/server/db";

export const getExampleTable = async () => {
  const selectResult = await db.query.images.findMany();
  return selectResult;
};
