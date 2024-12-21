"use client";

import { useEffect, useState } from "react";
import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { useUserService } from "../../../convex/services/userService";
import { Button } from "@/components/ui/button";
import { useGenerateData } from "./seed";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function DebugPage() {
  const convex = useConvex();
  const { isLoaded, isSignedIn, user } = useUser();
  const userService = useUserService(convex);

  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiUser, setApiUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const session = user!.primaryEmailAddress!.emailAddress;
        let apiUser = await userService.getUserByEmail(session);
        setApiUser(apiUser);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUser();
    }
  }, [isLoaded, isSignedIn, userService.getUserByEmail]);

  const generateData = async () => {
    setError(null);
    setApiResponse({ message: "Generating data..." });
    useGenerateData(123, convex)
      .then(() => {
        setApiResponse({ message: "Seeding completed" });
      })
      .catch((err) => {
        setError("Error seeding data: " + err);
        console.log(err);
      });
  };

  const resetDatabase = async () => {
    await convex.mutation(api.functions.resetDatabase.default);
    await convex.mutation(api.functions.users.addUser.default, {
      firstName: "TEST",
      lastName: "TEACHER",
      email: "dylan.choy21@gmail.com",
      password: "12341234",
      confirm: "12341234",
      type: "teacher",
      code: "",
      completedTasks: [],
    });
    await convex.mutation(api.functions.users.addUser.default, {
      firstName: "TEST",
      lastName: "STUDENT",
      email: "dcho282@aucklanduni.ac.nz",
      password: "12341234",
      confirm: "12341234",
      type: "student",
      code: "",
      completedTasks: [],
    });
    setApiResponse({ message: "Database has been reset" });
  };

  return (
    <div>
      <h1>Debug Page - API Calls</h1>
      {!isLoaded && <p>Loading...</p>}
      {isSignedIn ? (
        <>
          Signed in as {apiUser?.email} <br />
          <SignOutButton>
            <Button className="border border-solid border-transparent text-base">
              Sign Out
            </Button>
          </SignOutButton>
        </>
      ) : (
        <>
          Not signed in <br />
          <SignInButton>
            <Button className="border border-solid border-transparent text-base">
              Sign In
            </Button>
          </SignInButton>
        </>
      )}
      <Button onClick={generateData}>Generate Data</Button>
      <Button onClick={resetDatabase}>Reset Database</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {apiResponse && (
        <pre>
          <code>{JSON.stringify(apiResponse, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}
