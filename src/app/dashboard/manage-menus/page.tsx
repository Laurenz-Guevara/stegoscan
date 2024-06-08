"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import { Button, buttonVariants } from "@/components/ui/button";
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

      if (request.status === true) {
        setSelectedRestaurant(undefined);
      }
    }

    getRestaurantsFromUser();
  }

  async function addRestaurantFunc(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoading && user) {
      let request = await addRestaurant({
        restaurantName: restaurantName,
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
        <h1 className="text-2xl font-semibold">Manage Menus</h1>
      </MaxWidthWrapper>
    </section>
  );
}
