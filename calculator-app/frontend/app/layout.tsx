/**
 * Root layout component
 */
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
      <body>{children}</body>
    </html>
  );
}
