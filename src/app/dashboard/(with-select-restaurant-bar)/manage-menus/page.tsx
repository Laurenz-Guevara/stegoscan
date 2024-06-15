"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastVariant } from "@/server/db/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRestaurantContext } from "@/app/dashboard/(with-select-restaurant-bar)/RestaurantContext";
import {
  deleteMenuFromRestaurant,
  getMenusFromRestaurant,
} from "@/server/db/database";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoading, user } = useKindeBrowserClient();
  const [menus, setMenus] = useState<Array<any>>([]);
  const { selectedRestaurant } = useRestaurantContext();
  const { toast } = useToast();

  useEffect(() => {
    getMenus();
  }, [selectedRestaurant?.id]);

  async function getMenus() {
    if (selectedRestaurant?.id) {
      const menus = await getMenusFromRestaurant(selectedRestaurant.id);
      setMenus(menus);
    }
  }

  async function deleteMenu(menuId: number) {
    if (!isLoading && menuId && user) {
      let request = await deleteMenuFromRestaurant(menuId, user.id);

      toast({
        title: request.title,
        description: request.description,
        variant:
          request.variant === ToastVariant.Success
            ? ToastVariant.Success
            : ToastVariant.Destructive,
      });
    }
  }

  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus &&
            menus.map((menu: any) => (
              <Card key={menu.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {menu.menuName}
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Menu</DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertDialogTrigger className="text-red-500">
                              Delete Menu
                            </AlertDialogTrigger>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your menu from our servers. You
                              are about to delete "{menu.menuName}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={selectedRestaurant == undefined}
                              onClick={() => deleteMenu(menu.id)}
                              className={buttonVariants({
                                variant: "destructive",
                              })}
                            >
                              Confirm and Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </DropdownMenu>
                    </AlertDialog>
                  </CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>View Menu</p>
                </CardFooter>
              </Card>
            ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

function getData() {
  const data = [
    {
      id: 1,
      date: "Tomorrow, 3PM 12 November 2017",
      account: "Dr. Clinton Ackerman",
      specialty: "Respiratory therapist Assistive therapy",
      profile: "Confident",
    },
    {
      id: 2,
      date: "Today, 4PM 11 November 2017",
      account: "Dr. John Doe",
      specialty: "Cardiac Specialist",
      profile: "Cautious",
    },
  ];

  return data;
}
