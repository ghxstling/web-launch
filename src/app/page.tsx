"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  ClerkLoaded,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 items-center">
        <ClerkLoaded>
          <div className="flex flex-col gap-3 items-center">
            <h1 className="text-5xl font-semibold">Welcome to LearnQuest!</h1>
            <p className="text-xl">Education at Your Fingertips</p>
          </div>
          <div className="flex flex-row gap-8 items-center ">
            <SignInButton>
              <Button className="rounded-full border border-solid border-transparent text-base min-h-12 min-w-32">
                Log In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="rounded-full border border-solid border-transparent text-base min-h-12 min-w-32">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </ClerkLoaded>
      </main>
    </div>
  );
}
