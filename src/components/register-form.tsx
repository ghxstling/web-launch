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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserType } from "@/lib/enums";
import { registerSchema } from "@/lib/zodSchemas";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  type: UserType | undefined;
  code: string;
}

export function RegisterForm() {
  const { isLoaded, signUp } = useSignUp();
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm: "",
      type: undefined,
      code: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoadingMessage(true);
    try {
      await signUp!.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: {
          userType: data.type,
          code: data.code,
        },
      });

      await signUp!.prepareEmailAddressVerification({
        strategy: "email_link",
        redirectUrl: `${window.location.origin}/dashboard`,
      });

      setVerifying(true);
    } catch (err) {
      alert(err);
    }
  };

  if (!isLoaded) return null;

  if (verifying) {
    return (
      <>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl mx-auto">Success!</CardTitle>
          </CardHeader>
          <CardContent className="mx-auto">
            <div className="grid gap-3">
              <p className="text-center">
                An email has been sent to your email with a link to verify your
                account. Please check your inbox and click the link to continue.
              </p>
              <Button type="submit" className="w-full">
                <Link href="/login">Return to Log In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Begin your journey with LearnQuest today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="text">Full Name</Label>
                <div className="flex flex-row gap-2">
                  <div className="grid max-w-[calc(50%-0.5rem)] gap-2">
                    <Controller
                      render={({ field }) => (
                        <Input id="text" placeholder="John" {...field} />
                      )}
                      name="firstName"
                      control={control}
                    />
                    {errors.firstName?.message && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid max-w-[calc(50%)] gap-2">
                    <Controller
                      render={({ field }) => (
                        <Input id="text" placeholder="Smith" {...field} />
                      )}
                      name="lastName"
                      control={control}
                    />
                    {errors.lastName?.message && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
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
              </div>
              {errors.email?.message && (
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Controller
                  render={({ field }) => (
                    <Input id="password" type="password" {...field} />
                  )}
                  name="password"
                  control={control}
                />
              </div>
              {errors.password?.message && (
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="password">Retype Password</Label>
                <Controller
                  render={({ field }) => (
                    <Input id="confirm" type="password" {...field} />
                  )}
                  name="confirm"
                  control={control}
                />
              </div>
              {errors.confirm?.message && (
                <p className="text-red-500 text-sm">
                  {errors.confirm?.message}
                </p>
              )}
              <div className="grid gap-2">
                <Label>Are you a...</Label>
                <Controller
                  render={({ field }) => (
                    <RadioGroup
                      id="type"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex flex-row items-center mx-auto max-w-full space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher">Teacher</Label>
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student">Student</Label>
                      </div>
                    </RadioGroup>
                  )}
                  name="type"
                  control={control}
                />
              </div>
              {errors.type?.message && (
                <p className="text-red-500 text-sm">{errors.type?.message}</p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="code">Classroom Code</Label>
                <Controller
                  render={({ field }) => (
                    <Input
                      id="code"
                      type="text"
                      placeholder="ABC123"
                      maxLength={6}
                      {...field}
                    />
                  )}
                  name="code"
                  control={control}
                />
              </div>
              {errors.code?.message && (
                <p className="text-red-500 text-sm">{errors.code?.message}</p>
              )}
              <Button type="submit" className="w-full">
                {loadingMessage ? "Loading..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div id="clerk-captcha" />
    </>
  );
}
