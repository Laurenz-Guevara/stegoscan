"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { Button } from "@/components/ui/button";
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
import {
  addRestaurant,
  getRestaurants,
  deleteRestaurant,
} from "@/server/db/database";
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

export default function Home() {
  const { toast } = useToast();
  const { isLoading, user } = useKindeBrowserClient();
  const [restaurantName, setRestaurantName] = useState<string>();
  const [restaurants, setRestaurants] = useState<any>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>();

  useEffect(() => {
    getRestaurantsFromUser();
  }, [user]);

  const selectRestaurant = (value: string) => {
    setSelectedRestaurant(value);
  };

  async function getRestaurantsFromUser() {
    if (user) {
      const restaurant = await getRestaurants(user.id);
      setRestaurants(restaurant);
    }
  }

  async function deleteRestaurantFunc() {
    // TODO: Feature that you must first deactivate the restaurant before deleting it
    if (!isLoading && selectedRestaurant && user) {
      let request = await deleteRestaurant(selectedRestaurant, user.id);

      toast({
        title: request.title,
        description: request.description,
        variant: request.variant === "success" ? "success" : "destructive",
      });
    }

    getRestaurantsFromUser();
  }

  async function addRestaurantFunc() {
    console.log(restaurantName, user?.given_name, user?.id);
    if (!isLoading && user) {
      let request = await addRestaurant({
        restaurantName: restaurantName,
        restaurantOwner: user?.given_name,
        ownerId: user?.id,
        restaurantStatus: RestaurantStatus.Active,
        createdAt: new Date(),
      });

      toast({
        title: request.title,
        description: request?.description,
        variant: request.variant === "success" ? "success" : "destructive",
      });
    }
    getRestaurantsFromUser();
  }

  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-4 pb-4">
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Add a restaurant</CardTitle>
            <CardDescription>
              Fill in the details to add a restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Restaurant name</Label>
                  <Input
                    onChange={(e) => setRestaurantName(e.target.value)}
                    id="restaurantName"
                    placeholder="Name of your restaurant"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => addRestaurantFunc()}>Add Restaurant</Button>
          </CardFooter>
        </Card>
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Delete a restaurant</CardTitle>
            <CardDescription>Select a restaurant to delete</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="restaurant">Restaurant name</Label>
            <Select onValueChange={selectRestaurant}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants ? (
                  restaurants.map((restaurant: any) => (
                    <SelectItem
                      key={restaurant.id}
                      value={restaurant.restaurantName}
                    >
                      {restaurant.restaurantName}
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-sm px-2 py-1">Loading...</p>
                )}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => deleteRestaurantFunc()}
            >
              Delete Restaurant
            </Button>
          </CardFooter>
        </Card>
      </MaxWidthWrapper>
    </section>
  );
}
