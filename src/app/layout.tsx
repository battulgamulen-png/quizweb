"use client";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
        >
          <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="flex justify-between items-center h-14 px-6 border-b bg-background shrink-0">
              <div className="text-black font-semibold text-[24px]">
                Quiz app
              </div>

              <div className="flex gap-5">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-white rounded-full px-5 h-10">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>

            <div className="flex flex-1">
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
