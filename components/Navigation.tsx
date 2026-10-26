import { Show, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Navigation() {
    return (
        <nav className="border-b border-border/50 bg-background/50 backdrop-blur sticky top-0 z-10">
            <div className="flex container h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="text-lg font-semibold">
                    RAG Chatbot
                </div>
                <div className="flex items-center gap-2">
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
                </div>
            </div>
        </nav>
    );
}