"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <ResetPasswordForm />
    </div>
  );
}
