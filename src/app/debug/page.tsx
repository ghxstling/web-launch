// Used for debugging purposes only
// This is an easy way to test auth and roles for backend endpoints
"use client";

import { useEffect, useState } from "react";
import { SignOutButton, SignInButton, useUser } from "@clerk/nextjs";
import { useUserService } from "../../../convex/services/userService";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useGenerateData } from "./seed";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function DebugPage() {
  const convex = useConvex();
  const { isLoaded, isSignedIn, user } = useUser();
  const userService = useUserService(convex);

  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [apiUser, setApiUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const session = user!.primaryEmailAddress!.emailAddress;
        let apiUser = await userService.getUserByEmail(session);
        console.log(apiUser);
        setApiUser(apiUser);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUser();
    }
  }, [isLoaded, isSignedIn, userService.getUserByEmail]);

  const resetDatabase = async () => {
    await convex.mutation(api.functions.resetDatabase.default);
  };

  const makeApiCall = async () => {
    try {
      const res = await fetch("/api/courses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setApiResponse(await res.json());
      setError(null);
    } catch (err) {
      setError("Error fetching data from the API");
      setApiResponse(null);
    }
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
      <Button onClick={makeApiCall}>Make API Call</Button>
      <Button onClick={async () => useGenerateData(123, convex)}>
        Generate Data
      </Button>
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
