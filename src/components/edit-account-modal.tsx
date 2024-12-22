import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { updateSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { UserRecord, IUpdateAccountForm } from "@/lib/types";
import { useUserService } from "../../convex/services/userService";
import { useConvex } from "convex/react";
import Link from "next/link";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserRecord;
  clerkUser: any;
}

export function EditAccountModal({
  isOpen,
  onClose,
  user,
  clerkUser,
}: UserModalProps) {
  const convex = useConvex();
  const userService = useUserService(convex);

  const [message, setMessage] = useState<string[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateAccountForm>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      password: "",
      confirm: "",
    },
    resolver: zodResolver(updateSchema),
  });

  const resetEffects = () => {
    setLoadingMessage(false);
    setMessage(null);
  };

  const onSubmit: SubmitHandler<IUpdateAccountForm> = async (data) => {
    resetEffects();
    setLoadingMessage(true);

    try {
      await clerkUser.updatePassword({
        newPassword: data.password,
        currentPassword: user.password,
      });
      await clerkUser.update({
        firstName: data.firstName,
        lastName: data.lastName,
      });
      const userId = (await userService.getUserByEmail(user.email))!._id;
      await userService.updateUser(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: user.email,
        password: data.password,
        confirm: data.confirm,
        type: user.type,
        code: user.code,
        completedTasks: user.completedTasks,
      });
      resetEffects();
      setMessage(["Account updated successfully", "text-green-500 text-sm"]);
    } catch (err: any) {
      resetEffects();
      setMessage([err.message, "text-red-500 text-sm"]);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-black">
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="firstName" className="text-right col-span-2">
                First Name
              </Label>
              <Controller
                render={({ field }) => (
                  <Input id="firstName" className="col-span-4" {...field} />
                )}
                name="firstName"
                control={control}
              />
              {errors.firstName?.message && (
                <p className="text-red-500 text-sm col-span-6 text-center">
                  {errors.firstName?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="lastName" className="text-right col-span-2">
                Last Name
              </Label>
              <Controller
                render={({ field }) => (
                  <Input id="lastName" className="col-span-4" {...field} />
                )}
                name="lastName"
                control={control}
              />
              {errors.lastName?.message && (
                <p className="text-red-500 text-sm col-span-6 text-center">
                  {errors.lastName?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="emailLabel" className="text-right col-span-2">
                Email
              </Label>
              <Label
                htmlFor="emailText"
                id="email"
                className="m-1 col-span-4 text-gray-400 font-light"
              >
                {user.email}
              </Label>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="password" className="text-right col-span-2">
                New Password
              </Label>
              <Controller
                render={({ field }) => (
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="col-span-3"
                    {...field}
                  />
                )}
                name="password"
                control={control}
              />
              <div className="text-right col-span-1">
                {showPassword ? (
                  <Link href="" className="underline" onClick={togglePassword}>
                    Hide
                  </Link>
                ) : (
                  <Link href="" className="underline" onClick={togglePassword}>
                    Show
                  </Link>
                )}
              </div>
              {errors.password?.message && (
                <p className="text-red-500 text-sm col-span-6 text-center">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="confirm" className="text-right col-span-2">
                Retype Password
              </Label>
              <Controller
                render={({ field }) => (
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    className="col-span-3"
                    {...field}
                  />
                )}
                name="confirm"
                control={control}
              />
              {errors.confirm?.message && (
                <p className="text-red-500 text-sm col-span-6 text-center">
                  {errors.confirm?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="accountType" className="text-right col-span-2">
                Account Type
              </Label>
              <Label
                htmlFor="emailText"
                id="email"
                className="m-1 col-span-4 text-gray-400 font-light"
              >
                {user.type === "student" ? <p>Student</p> : <p>Teacher</p>}
              </Label>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="accountType" className="text-right col-span-2">
                Classroom Code
              </Label>
              <Label
                htmlFor="emailText"
                id="email"
                className="m-1 col-span-4 text-gray-400 font-light"
              >
                {user.code}
              </Label>
            </div>
          </div>
          {message && <p className={message[1]}>{message[0]}</p>}
          <DialogFooter>
            <Button type="submit">
              {loadingMessage ? "Loading..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
