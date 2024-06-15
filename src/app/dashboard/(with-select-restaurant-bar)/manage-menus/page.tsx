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
  addMenu,
} from "@/server/db/database";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { isLoading, user } = useKindeBrowserClient();
  const [menus, setMenus] = useState<Array<any>>([]);
  const { selectedRestaurant } = useRestaurantContext();
  const { toast } = useToast();
  const [menuName, setMenuName] = useState<string>();

  useEffect(() => {
    getMenus();
  }, [selectedRestaurant?.id]);

  async function getMenus() {
    if (selectedRestaurant?.id) {
      const menus = await getMenusFromRestaurant(selectedRestaurant.id);
      setMenus(menus);
    }
  }

  async function addMenuToRestaurant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRestaurant?.id) {
      toast({
        title: "Error :(",
        description: "Please first select a restaurant",
        variant: ToastVariant.Destructive,
      });
    }

    if (!isLoading && user && selectedRestaurant?.id && menuName) {
      let request = await addMenu({
        menuName: menuName,
        ownerId: user.id,
        restaurantId: selectedRestaurant.id,
      });

      toast({
        title: request.title,
        description: request?.description,
        variant:
          request.variant === ToastVariant.Success
            ? ToastVariant.Success
            : ToastVariant.Destructive,
      });

      if (request.variant === ToastVariant.Success) {
        setOpen(false);
      }
      getMenus();
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

      if (request.variant === ToastVariant.Success) {
        getMenus();
      }
    }
  }

  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col pb-4">
        <div className="flex justify-end mb-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Create Menu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Menu</DialogTitle>
                <DialogDescription>
                  Make changes to your menu here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addMenuToRestaurant}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Food Menu"
                      onChange={(e) => setMenuName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button asChild variant="outline">
                    <DialogClose>Cancel</DialogClose>
                  </Button>
                  <Button className="bg-green-600" type="submit">
                    Create Menu
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
