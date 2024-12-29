/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { SubmitHandler, useForm } from "react-hook-form";
import { updateSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { User, IUpdateAccountForm } from "@/lib/types";
import { useUserService } from "@/../convex/services/userService";
import Link from "next/link";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  clerkUser: any;
}

export function EditAccountModal({
  isOpen,
  onClose,
  user,
  clerkUser,
}: UserModalProps) {
  const userService = useUserService();

  const [message, setMessage] = useState<string[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const css = {
    FormItem: "grid grid-cols-6 items-center gap-x-4",
    FormLabel: "text-right col-span-2 mt-[8px]",
    FormInput: "col-span-3",
    FormNoEdit: "m-1 col-span-4 text-gray-400 font-light",
    FormMsg: "text-red-500 text-sm col-start-3 col-span-4",
  };

  const form = useForm<IUpdateAccountForm>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      password: "",
      confirm: "",
    },
    resolver: zodResolver(updateSchema),
  });

  const togglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

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
      setMessage(["Account updated successfully", "text-green-500"]);
    } catch (err: any) {
      resetEffects();
      setMessage([err.message, "text-red-500"]);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[30rem] border-2 border-black">
        <DialogHeader>
          <DialogTitle>Edit account</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 pb-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className={css.FormItem}>
                    <FormLabel htmlFor="firstName" className={css.FormLabel}>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        className={css.FormInput}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={css.FormMsg} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className={css.FormItem}>
                    <FormLabel htmlFor="lastName" className={css.FormLabel}>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        className={css.FormInput}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={css.FormMsg} />
                  </FormItem>
                )}
              />
              <FormItem className={css.FormItem}>
                <FormLabel htmlFor="emailLabel" className={css.FormLabel}>
                  Email
                </FormLabel>
                <FormLabel htmlFor="emailText" className={css.FormNoEdit}>
                  {user.email}
                </FormLabel>
              </FormItem>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className={css.FormItem}>
                    <FormLabel htmlFor="password" className={css.FormLabel}>
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={css.FormInput}
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className="text-left text-sm col-span-1">
                      {showPassword ? (
                        <Link
                          href=""
                          className="underline"
                          onClick={togglePassword}
                        >
                          Hide
                        </Link>
                      ) : (
                        <Link
                          href=""
                          className="underline"
                          onClick={togglePassword}
                        >
                          Show
                        </Link>
                      )}
                    </FormLabel>
                    <FormMessage className={css.FormMsg} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem className={css.FormItem}>
                    <FormLabel htmlFor="confirm" className={css.FormLabel}>
                      Retype Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="confirm"
                        type={showPassword ? "text" : "password"}
                        className={css.FormInput}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={css.FormMsg} />
                  </FormItem>
                )}
              />
              <FormItem className={css.FormItem}>
                <FormLabel htmlFor="accountTypeLabel" className={css.FormLabel}>
                  Account Type
                </FormLabel>
                <FormLabel htmlFor="accountTypeText" className={css.FormNoEdit}>
                  {user.type === "student" ? <p>Student</p> : <p>Teacher</p>}{" "}
                </FormLabel>
              </FormItem>
              <FormItem className={css.FormItem}>
                <FormLabel
                  htmlFor="classroomCodeText"
                  className={css.FormLabel}
                >
                  Classroom Code
                </FormLabel>
                <FormLabel
                  htmlFor="classroomCodeLabel"
                  className={css.FormNoEdit}
                >
                  {user.code}
                </FormLabel>
              </FormItem>
            </div>
            {message && (
              <p className={message[1] + "  text-sm"}>{message[0]}</p>
            )}
            <DialogFooter>
              <Button type="submit">
                {loadingMessage ? "Loading..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
