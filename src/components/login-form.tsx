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
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { loginSchema } from "@/lib/zodSchemas";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

interface IFormInput {
  email: string;
  password: string;
}

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [message, setMessage] = useState<String | undefined>(undefined);
  const [loadingMessage, setLoadingMessage] = useState(false);

  if (!isLoaded) return null;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const resetEffects = () => {
    setMessage(undefined);
    setLoadingMessage(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    resetEffects();
    setLoadingMessage(true);
    try {
      const user = await signIn!.create({
        identifier: data.email,
        strategy: "password",
        password: data.password,
      });

      if (user) {
        setActive({
          session: user.createdSessionId,
        });
      }
    } catch (err: any) {
      resetEffects();
      setMessage(err.message);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login to LearnQuest</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                render={({ field }) => (
                  <Input id="email" placeholder="john@example.com" {...field} />
                )}
                name="email"
                control={control}
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Controller
                render={({ field }) => (
                  <Input id="password" type="password" {...field} />
                )}
                name="password"
                control={control}
              />
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
      </CardContent>
    </Card>
  );
}
