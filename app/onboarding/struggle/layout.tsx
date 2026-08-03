import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struggle - Axis",
};

export default function StruggleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}