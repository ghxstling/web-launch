import { Button } from "@/components/ui/button";
import { Copyright, CopyrightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center">
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-5xl font-semibold">Welcome to LearnQuest!</h1>
          <p className="text-xl">Education at Your Fingertips</p>
        </div>
        <div className="flex flex-row gap-4 items-center ">
          <Button className="rounded-full border border-solid border-transparent text-base min-h-12 min-w-32">
            <Link href="/register">Sign up</Link>
          </Button>
          <Button className="rounded-full border border-solid border-transparent text-base min-h-12 min-w-32">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
