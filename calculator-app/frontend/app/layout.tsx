/**
 * Root layout component
 */
import { QueryProvider } from "@/api/QueryProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator App",
  description: "Full-stack calculator with history and fraction support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
