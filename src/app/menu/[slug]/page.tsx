import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getRestaurantAndMenus } from "@/server/db/database";
import { notFound } from "next/navigation";

export default async function Page(params: any) {
  let restaurant = await getRestaurantAndMenus(params.params.slug);

  if (!restaurant) {
    return notFound();
  }

  return (
    <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-4 pb-4">
      <h1 className="text-2xl font-semibold">
        {restaurant.restaurantName} Menu
      </h1>

      <div className="flex flex-row space-x-10">
        {restaurant.menus &&
          restaurant.menus.map((menu) => (
            <div key={menu.id}>
              <p>{menu.menuName}</p>
              {menu.menuItems &&
                menu.menuItems.map((item) => (
                  <div key={item.id} className="flex flex-row space-x-10">
                    <div>{item.itemName}</div>
                    <div>£{item.itemPrice}</div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </MaxWidthWrapper>
  );
}
