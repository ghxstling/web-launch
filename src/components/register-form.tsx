"use client";

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
import { IRegisterForm } from "@/lib/types";
import { registerSchema } from "@/lib/zodSchemas";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvex } from "convex/react";
import { useUserService } from "../../convex/services/userService";
import { useClassroomCodesService } from "../../convex/services/classroomCodesService";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const convex = useConvex();
  const userService = useUserService(convex);
  const classroomCodesService = useClassroomCodesService(convex);

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<String | undefined>(undefined);
  const [verifyingMessage, setVerifyingMessage] = useState<String | undefined>(
    undefined,
  );
  const [code, setCode] = useState("");
  const [user, setUser] = useState<IRegisterForm | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>({
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

  const resetEffects = () => {
    setMessage(undefined);
    setLoadingMessage(false);
    setVerifyingMessage(undefined);
  };

  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    resetEffects();
    setLoadingMessage(true);
    try {
      const validCode = await classroomCodesService.getClassroomCode(
        data.code!,
      );
      if (!validCode) {
        resetEffects();
        setMessage("Invalid classroom code");
        return;
      }

      await signUp!.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: {
          userType: data.type,
          code: validCode.code,
        },
      });

      await signUp!.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setUser(data);
      setVerifying(true);
    } catch (err: any) {
      resetEffects();
      setMessage(err.message);
    }
  };

  const validateCode = async (e: React.FormEvent) => {
    resetEffects();
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp!.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        console.log(await userService.createUser(user!));
        router.push("/dashboard");
      }
    } catch (err: any) {
      resetEffects();
      setVerifyingMessage(err.message);
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
            <form onSubmit={validateCode}>
              <div className="grid gap-3">
                <p className="text-center">
                  A code has been sent to your email. Please enter it below to
                  verify your account.
                </p>
                <Input
                  id="validateCode"
                  value={code}
                  type="text"
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ABC123"
                  maxLength={6}
                />
                {verifyingMessage && (
                  <p className="text-red-500 text-sm">{verifyingMessage}</p>
                )}
                <Button type="submit" className="w-full">
                  Verify
                </Button>
              </div>
            </form>
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
                        <Input id="firstName" placeholder="John" {...field} />
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
                        <Input id="lastName" placeholder="Smith" {...field} />
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
              {message && <p className="text-red-500 text-sm">{message}</p>}
              <Button type="submit" className="w-full">
                {loadingMessage ? "Loading..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
