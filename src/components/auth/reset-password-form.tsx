"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { IResetForm } from "@/lib/types";
import { resetSchema } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { useUserService } from "@/../convex/services/userService";

export function ResetPasswordForm() {
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const userService = useUserService();

  const [foundEmail, setFoundEmail] = useState<boolean>(false);
  const [message, setMessage] = useState<String | undefined>(undefined);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const css = {
    FormItem: "grid gap-2 space-y-0",
    FormMsg: "text-red-500 text-sm col-start-2 col-span-4 text-left",
  };

  const togglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  if (!isLoaded) return null;

  if (isSignedIn) router.push("/");

  const resetEffects = () => {
    setMessage(undefined);
    setLoadingMessage(false);
  };

  const form = useForm<IResetForm>({
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
    resolver: zodResolver(resetSchema),
  });

  const create: SubmitHandler<IResetForm> = async (data) => {
    resetEffects();
    setLoadingMessage(true);
    try {
      const user = await userService.getUserByEmail(data.email);

      // if (user.status === "complete") {
      //   await setActive({ session: user.createdSessionId });
      //   router.push("/dashboard");
      // }
    } catch (err: any) {
      resetEffects();
      setMessage(err.message);
    }
  };

  const reset = async (data) => {
    resetEffects();
    setLoadingMessage(true);
    try {
      const user = await signIn!.create({
        identifier: data.email,
        strategy: "password",
        password: data.password,
      });

      if (user.status === "complete") {
        await setActive({ session: user.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      resetEffects();
      setMessage(err.message);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset your Account</CardTitle>
        <CardDescription>
          Enter your email below to begin resetting your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(!foundEmail ? create : reset)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={css.FormItem}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={css.FormMsg} />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {loadingMessage ? "Loading..." : "Continue"}
            </Button>
          </form>
        </Form>
        {/* <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  )}
                  name="email"
                  control={control}
                />
                {errors.email?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {showPassword ? (
                    <Link
                      href=""
                      className="font-normal ml-auto inline-block text-sm underline"
                      onClick={togglePassword}
                    >
                      Hide
                    </Link>
                  ) : (
                    <Link
                      href=""
                      className="font-normal ml-auto inline-block text-sm underline"
                      onClick={togglePassword}
                    >
                      Show
                    </Link>
                  )}
                </div>
                <Controller
                  render={({ field }) => (
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  )}
                  name="password"
                  control={control}
                />
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
                {errors.password?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.password?.message}
                  </p>
                )}
                {message && <p className="text-red-500 text-sm">{message}</p>}
              </div>
              <Button type="submit" className="w-full">
                {loadingMessage ? "Loading..." : "Log in"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </Form> */}
      </CardContent>
    </Card>
  );
}
