"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { Button } from "@/components/ui/button";
import { ToastVariant } from "@/server/db/enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getMenusWithUserId, getRestaurants } from "@/server/db/database";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { RestaurantStatus } from "@/server/db/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const { toast } = useToast();
  const { isLoading, user } = useKindeBrowserClient();
  const [restaurantName, setRestaurantName] = useState<string>();
  const [restaurants, setRestaurants] = useState<any>();
  const [restaurant, setRestaurant] = useState<any>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>();

  useEffect(() => {
    getRestaurantMenus();
    getRestaurantsFromUser();
  }, [user]);

  const selectRestaurant = (value: any) => {
    setSelectedRestaurant(value.restaurantName);
    setRestaurant(value);
  };

  async function getRestaurantMenus() {
    if (user) {
      const menu = await getMenusWithUserId(user.id);
      console.log(menu);
    }
  }

  async function getRestaurantsFromUser() {
    if (user) {
      const restaurant = await getRestaurants(user.id);
      setRestaurants(restaurant);
    }
  }

  async function addMenu(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoading && user) {
      // let request = await addRestaurant({
      //   restaurantName: restaurantName,
      //   ownerId: user?.id,
      //   restaurantStatus: RestaurantStatus.Active,
      //   createdAt: new Date(),
      // });
      // toast({
      //   title: request.title,
      //   description: request?.description,
      //   variant:
      //     request.variant === ToastVariant.Success
      //       ? ToastVariant.Success
      //       : ToastVariant.Destructive,
      // });
    }
  }

  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-4 pb-4">
        <div className="flex justify-between">
          {selectedRestaurant ? (
            <h1 className="text-2xl font-semibold">{selectedRestaurant}</h1>
          ) : (
            <h1 className="text-2xl font-semibold">Select a Restaurant</h1>
          )}
          <div className="flex items-center space-x-4">
            <Select onValueChange={selectRestaurant}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants ? (
                  restaurants.map((restaurant: any) => (
                    <SelectItem key={restaurant.id} value={restaurant}>
                      {restaurant.restaurantName}
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-sm px-2 py-1">Loading...</p>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Manage Menus</h1>
        <Card className="w-full mt-4">
          <form onSubmit={addMenu}>
            <CardHeader>
              <CardTitle>Create a menu</CardTitle>
              <CardDescription>
                Fill in the details to add a restaurant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Restaurant name</Label>
                  <Input
                    onChange={(e) => setRestaurantName(e.target.value)}
                    id="restaurantName"
                    placeholder="Name of your restaurant"
                    value={restaurantName}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-green-600"
                disabled={
                  restaurantName?.length === 0 || restaurantName == undefined
                }
              >
                Add Restaurant
              </Button>
            </CardFooter>
          </form>
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}
