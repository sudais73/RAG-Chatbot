
"use client";

import { Suspense } from "react";
import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-10 border-b border-border/50 bg-background/50 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-semibold">
          Sude Tech Chatbot
        </div>

        <div className="flex items-center gap-2">
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
              </div>
            }
          >
            {/* Rendered when user is NOT signed in */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </Show>

            {/* Rendered when user IS signed in */}
            <Show when="signed-in">
              <SignOutButton>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
            </Show>
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
